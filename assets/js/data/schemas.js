/* =========================
   Permalinks + Utilities
   ========================= */

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizeFieldName(field) {
  let fieldName = (field || '').startsWith('.') ? field.substring(1) : (field || '');
  return fieldName === '' ? '*' : fieldName;
}

function buildSql(schemaName, fieldName, limit) {
  return `SELECT ${fieldName} FROM ${schemaName} LIMIT ${limit};`;
}

function toAnchor(schema, field) {
  const normalized = normalizeFieldName(field); // "*" or field name
  return normalized === '*' ? `#/${schema}` : `#/${schema}.${normalized}`;
}

function fromAnchor(hash) {
  if (!hash || !hash.startsWith('#/')) return null;
  const raw = hash.slice(2);
  if (!raw) return null;

  const dot = raw.indexOf('.');
  if (dot === -1) return { schema: raw, field: '*' };
  return { schema: raw.slice(0, dot), field: raw.slice(dot + 1) };
}

function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(ta);
  }
  return Promise.resolve();
}

/* =========================
   UI State Persistence
   ========================= */

const UI_STATE_KEY = 'crumbs_schema_ui_state_v1';

function saveUiState() {
  const state = {
    hash: window.location.hash || '',
    requiredOnly: !!document.getElementById('required_only')?.checked,
    tableFilter: document.getElementById('table_filter')?.value || ''
  };
  try {
    localStorage.setItem(UI_STATE_KEY, JSON.stringify(state));
  } catch {}
}

function loadUiState() {
  try {
    const raw = localStorage.getItem(UI_STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/* =========================
   Field Details Rendering
   ========================= */

function setSelectedMeta(rowData) {
  const metaEl = document.getElementById('selected_schema_meta');
  if (!metaEl) return;

  if (!rowData) {
    metaEl.innerHTML = `<span class="muted">Select a field to see details.</span>`;
    return;
  }

  const schema = escapeHtml(rowData.schema || '');
  const rawField = rowData.field || '';
  const fieldName = escapeHtml(normalizeFieldName(rawField));
  const type = escapeHtml(rowData.type || '');
  const required = escapeHtml(rowData.required || '');

  metaEl.innerHTML = `
    <div><strong>${schema}</strong> · <code>${fieldName}</code></div>
    <div class="muted">Type: ${type || '—'} · Required: ${required || '—'}</div>
  `;
}

function setPermalinkButtonEnabled(enabled) {
  const btn = document.getElementById('copy_permalink');
  if (!btn) return;
  btn.disabled = !enabled;
}

function format_examples(data) {
  const fieldName = normalizeFieldName(data.field);
  const isTableRoot = fieldName === '*';

  const limit = Array.isArray(data.examples) ? data.examples.length : 0;
  const sql = buildSql(data.schema, fieldName, limit || 5);

  let formatted = `
    <div class="example-block">
      <div class="example-header">
        <div class="example-title">${isTableRoot ? 'Sample records' : 'Examples'}</div>
        <button class="copy-sql-btn" type="button" data-sql="${escapeHtml(sql)}">
          Copy SQL
        </button>
      </div>
      <div class="example-sql">
        <code>${escapeHtml(sql)}</code>
      </div>
  `;

  if (!Array.isArray(data.examples) || data.examples.length === 0) {
    formatted += `
        <div class="muted">No ${isTableRoot ? 'sample records' : 'examples'} available.</div>
      </div>
    `;
    return formatted;
  }

  formatted += `<ol class="example-list">`;
  data.examples.forEach((example) => {
    const highlighted = hljs.highlight(example, { language: 'javascript' }).value;
    formatted += `
      <li class="example-item">
        <pre><code class="language-javascript">${highlighted}</code></pre>
      </li>
    `;
  });
  formatted += `</ol></div>`;
  return formatted;
}

/* =========================
   DataTable Initialization
   ========================= */
function mountCustomSearchControl() {
  const host = document.getElementById('dt_search');
  const dtSearch = document.querySelector('#schema_datatable_wrapper .dt-search');
  const input = dtSearch?.querySelector('input');

  if (!host || !dtSearch || !input) return;

  if (host.querySelector('.dt-search-wrap')) return;

  dtSearch.classList.add('dt-hidden');

  const wrap = document.createElement('div');
  wrap.className = 'dt-search-wrap';
  wrap.setAttribute('aria-label', 'Search within fields');

  const icon = document.createElement('span');
  icon.className = 'dt-search-icon';
  icon.textContent = '🔍';

  input.placeholder = 'Search…';
  input.setAttribute('aria-label', 'Search within fields');

  wrap.appendChild(icon);
  wrap.appendChild(input);

  host.innerHTML = '';
  host.appendChild(wrap);
}

let table = new DataTable('#schema_datatable', {
  ajax: '/assets/json/data/schemas.json',

  autoWidth: false,

  columns: [
    { data: 'schema' },
    {
      data: 'field',
      className: 'aixcc-filter',
      render: function (data, type, row) {
        if (type === 'display') {
          if (row.type === 'object' || row.type === 'array' || row.type === '') {
            return row.childrenExpanded
              ? '<span class="expandable">▼ </span>' + data
              : '<span class="expandable">▶ </span>' + data;
          }
          return '&nbsp;&nbsp;&nbsp;&nbsp;' + data;
        }
        return data;
      }
    },
    { data: 'type' },
    {
      data: 'required',
      render: function (data, type) {
        if (type !== 'display') return data;
        const v = String(data || '').trim().toLowerCase();
        const isReq = v === 'yes' || v === 'true' || v === 'required';
        return isReq
          ? '<span class="req-pill" title="Required field">🔑 Required</span>'
          : '<span class="opt-pill" title="Optional field">Optional</span>';
      }
    },
    { data: 'description' }
  ],

  columnDefs: [
    { targets: 0, width: '18%' }, // Table
    { targets: 1, width: '36%' }, // Field
    { targets: 2, width: '12%' }, // Type
    { targets: 3, width: '12%' }, // Required
    { targets: 4, width: '22%' }  // Description
  ],

  order: [[0, 'asc'], [1, 'asc']],
  responsive: true,

  paging: false,
  scrollCollapse: true,
  scrollY: '50vh',

  lengthChange: false,

  initComplete: function () {
    mountCustomSearchControl();

    table.columns.adjust();
  }
});

/* =========================
   Row Expansion / Visibility
   ========================= */

table.on('click', 'tbody span.expandable', function (e) {
  e.stopPropagation();

  let tr = e.target.closest('tr');
  let row = table.row(tr);

  row.data().childrenExpanded =
    row.data().childrenExpanded === undefined || !row.data().childrenExpanded;

  let rowName = row.data().field;
  let rowDepth = rowName.split('.').length;

  let datas = table.rows().data();
  for (let i = 0; i < datas.length; i++) {
    let d = datas[i];
    if (d.expanded === undefined) d.expanded = false;

    if (row.data().schema != d.schema) continue;

    if (!row.data().childrenExpanded) {
      if (d.field.startsWith(rowName + '.') && d.field !== row.data().field) {
        d.childrenExpanded = false;
        d.expanded = false;
      }
    } else {
      if (d.field.startsWith(rowName + '.')) {
        d.expanded = d.field.split('.').length == rowDepth + 1;
      }
    }
  }

  table.search.fixed('range', function (searchStr, data) {
    return data.expanded || data.field == "";
  });

  table.rows().invalidate();
  table.draw(false);

  saveUiState();
  updateToggleButton();

  table.columns.adjust();
});

/* =========================
   Selection + Permalinks
   ========================= */

function selectRowBySchemaField(schema, fieldName) {
  const targetField = fieldName === '*' ? '' : `.${fieldName}`;

  const rows = table.rows().nodes();
  for (let i = 0; i < rows.length; i++) {
    const tr = rows[i];
    const rowData = table.row(tr).data();
    if (!rowData) continue;

    const matchesSchema = rowData.schema === schema;
    const matchesField =
      (fieldName === '*' && rowData.field === '') ||
      (fieldName !== '*' && rowData.field === targetField);

    if (matchesSchema && matchesField) {
      $('#schema_datatable tbody tr.selected').removeClass('selected');
      tr.classList.add('selected');

      setSelectedMeta(rowData);
      $('#selected_schema_examples').html(format_examples(rowData));
      setPermalinkButtonEnabled(true);

      tr.scrollIntoView({ block: 'center' });

      return true;
    }
  }
  return false;
}

table.on('click', 'tbody td', function (e) {
  let tr = e.target.closest('tr');

  $('#schema_datatable tbody tr.selected').removeClass('selected');
  tr.classList.add('selected');

  const rowData = table.row(tr).data();

  setSelectedMeta(rowData);

  const hash = toAnchor(rowData.schema, rowData.field);
  history.replaceState(null, '', hash);

  $('#selected_schema_examples').html(format_examples(rowData));

  setPermalinkButtonEnabled(true);
  saveUiState();
});

/* =========================
   Copy Buttons (SQL + Permalink)
   ========================= */

document.addEventListener('click', function (e) {
  const sqlBtn = e.target.closest('.copy-sql-btn');
  if (sqlBtn) {
    const sql = sqlBtn.getAttribute('data-sql') || '';
    copyTextToClipboard(sql).then(() => {
      const original = sqlBtn.textContent;
      sqlBtn.textContent = 'Copied!';
      setTimeout(() => (sqlBtn.textContent = original), 900);
    });
    return;
  }

  const linkBtn = e.target.closest('#copy_permalink');
  if (linkBtn) {
    copyTextToClipboard(window.location.href).then(() => {
      const original = linkBtn.textContent;
      linkBtn.textContent = 'Copied!';
      setTimeout(() => (linkBtn.textContent = original), 900);
    });
  }
});

/* =========================
   Toolbar: Table Filter + Required Toggle
   ========================= */

function populateTableFilter() {
  const select = document.getElementById('table_filter');
  if (!select) return;

  while (select.options.length > 1) select.remove(1);

  const schemas = new Set();
  const datas = table.rows().data();
  for (let i = 0; i < datas.length; i++) schemas.add(datas[i].schema);

  [...schemas].sort().forEach((name) => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  select.addEventListener('change', () => {
    const v = select.value;
    table.column(0).search(v ? `^${v}$` : '', true, false).draw(false);
    saveUiState();
  });
}

function wireRequiredToggle() {
  const cb = document.getElementById('required_only');
  if (!cb) return;

  cb.addEventListener('change', () => {
    if (cb.checked) {
      table.search.fixed('range', () => true);
      table.column(3).search('^(yes|true|required)$', true, false).draw(false);
    } else {
      table.search.fixed('range', function (searchStr, data) {
        return data.expanded || data.field == "";
      });
      table.column(3).search('').draw(false);

      const datas = table.rows().data();
      for (let i = 0; i < datas.length; i++) {
        datas[i].expanded = false;
        datas[i].childrenExpanded = false;
      }
      table.rows().invalidate();
      table.draw(false);
    }

    saveUiState();
    updateToggleButton();
    table.columns.adjust();
  });
}

/* =========================
   Expand/Collapse Toggle (single button)
   ========================= */

function expandAll() {
  const datas = table.rows().data();
  for (let i = 0; i < datas.length; i++) {
    datas[i].childrenExpanded = true;
    datas[i].expanded = true;
  }
  table.search.fixed('range', () => true);
  table.rows().invalidate();
  table.draw(false);

  saveUiState();
  table.columns.adjust();
}

function collapseAll() {
  const datas = table.rows().data();
  for (let i = 0; i < datas.length; i++) {
    datas[i].childrenExpanded = false;
    datas[i].expanded = false;
  }
  table.search.fixed('range', (searchStr, data) => data.field == "");
  table.rows().invalidate();
  table.draw(false);

  saveUiState();
  table.columns.adjust();
}

function computeIsExpandedAll() {
  const datas = table.rows().data();
  if (!datas || datas.length === 0) return false;
  for (let i = 0; i < datas.length; i++) {
    if (!datas[i].expanded) return false;
  }
  return true;
}

function updateToggleButton() {
  const btn = document.getElementById('toggle_expand');
  if (!btn) return;

  if (computeIsExpandedAll()) {
    btn.textContent = '⤡';
    btn.title = 'Collapse all';
    btn.setAttribute('aria-label', 'Collapse all');
  } else {
    btn.textContent = '⤢';
    btn.title = 'Expand all';
    btn.setAttribute('aria-label', 'Expand all');
  }
}

document.addEventListener('click', function (e) {
  const btn = e.target.closest('#toggle_expand');
  if (!btn) return;

  if (computeIsExpandedAll()) {
    collapseAll();
  } else {
    expandAll();
  }
  updateToggleButton();
});

/* =========================
   Clear Filters
   ========================= */

function clearAllFilters() {
  const tableSelect = document.getElementById('table_filter');
  if (tableSelect) tableSelect.value = '';

  const requiredCb = document.getElementById('required_only');
  if (requiredCb) requiredCb.checked = false;

  table.search('');
  table.columns().search('');
  table.column(0).search('');
  table.column(3).search('');

  const datas = table.rows().data();
  for (let i = 0; i < datas.length; i++) {
    datas[i].expanded = false;
    datas[i].childrenExpanded = false;
  }

  table.search.fixed('range', function (searchStr, data) {
    return data.field == "";
  });

  table.rows().invalidate();
  table.draw(false);

  $('#schema_datatable tbody tr.selected').removeClass('selected');
  setSelectedMeta(null);
  document.getElementById('selected_schema_examples').innerHTML =
    'Click on a schema row above to see examples...';

  setPermalinkButtonEnabled(false);

  history.replaceState(null, '', window.location.pathname);

  try {
    localStorage.removeItem(UI_STATE_KEY);
  } catch {}

  updateToggleButton();
  table.columns.adjust();
}

document.addEventListener('click', function (e) {
  const btn = e.target.closest('#clear_filters');
  if (!btn) return;
  clearAllFilters();
});

/* =========================
   Initial Load: Default View + Restore State + Hash Selection
   ========================= */

$(document).ready(function () {
  table.search.fixed('range', function (searchStr, data) {
    return data.field == "";
  });
  table.draw();

  mountCustomSearchControl();

  populateTableFilter();
  wireRequiredToggle();

  const state = loadUiState();
  const initialHash =
    (window.location.hash && window.location.hash.startsWith('#/'))
      ? window.location.hash
      : (state?.hash || '');

  const select = document.getElementById('table_filter');
  if (select && state && typeof state.tableFilter === 'string' && state.tableFilter.length) {
    select.value = state.tableFilter;
    table.column(0).search(`^${state.tableFilter}$`, true, false);
  }

  const cb = document.getElementById('required_only');
  if (cb && state && typeof state.requiredOnly === 'boolean') {
    cb.checked = state.requiredOnly;
    if (cb.checked) {
      table.search.fixed('range', () => true);
      table.column(3).search('^(yes|true|required)$', true, false);
    }
  }

  table.draw(false);

  const parsed = fromAnchor(initialHash);
  if (parsed) {
    history.replaceState(null, '', initialHash);

    if (parsed.field !== '*') {
      const datas = table.rows().data();
      for (let i = 0; i < datas.length; i++) {
        if (datas[i].schema === parsed.schema) {
          datas[i].expanded = true;
          datas[i].childrenExpanded = true;
        }
      }
      table.search.fixed('range', () => true);
      table.rows().invalidate();
      table.draw(false);
    }

    if (selectRowBySchemaField(parsed.schema, parsed.field)) {
      setPermalinkButtonEnabled(true);
    }
  } else {
    setPermalinkButtonEnabled(false);
  }

  updateToggleButton();
  table.columns.adjust();
});

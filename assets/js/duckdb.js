import * as duckdb from 'https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@latest/+esm';

let db = null;
let conn = null;

const SAMPLE_QUERIES = {
    'audit': [{
        'description': 'Patch and POV count by team and round',
        'query': `select count(*) as c,
	team_name,
	event_type,
	round
from audit
where event_type in ('pov_submission', 'patch_submission')
group by team_name,
	event_type,
	round
order by c desc;`
    },
    {
        'description': 'POV Submissions Details',
        'query': `WITH
  submission_result AS (
   SELECT
     disposition
   , event.pov_id pov_id
   FROM
     audit
   WHERE (event_type = 'pov_submission_result')
) 
SELECT
  audit.timestamp
, s.disposition
, audit.event_type
, audit.event.pov_id
, audit.task_id
, audit.team_id
, audit.round
FROM
  (audit
INNER JOIN submission_result s ON (s.pov_id = audit.event.pov_id))
WHERE (event_type = 'pov_submission');`
    }
    ],
    'events': [
        {
            'description': 'LLM Completions',
            'query': `SELECT span_id,
	team_name,
	attributes.gen_ai.completion
FROM events
where attributes.gen_ai.completion is not null
LIMIT 10`
        },
        {
            'description': "Common Event Names",
            'query': `select count(*) as c,
	team_name,
	name
from events
group by team_name,
	name
order by c desc
limit 100;`
        }
    ],
    'traces': [
        {
            'description': 'Common CRS Actions',
            'query': `select count(*) as c,
	team_name,
	attributes.crs.action.name
from traces
where attributes.crs.action.name is not null
group by team_name,
	attributes.crs.action.name
order by c desc
limit 100;`
        },
        {
            'description': 'Summary LLM usage statistics',
            'query': `SELECT
  round
, team_id
, attributes.gen_ai.system ai_system
, attributes.gen_ai.request.model model_name
, COUNT(*) total_requests
, AVG(attributes.gen_ai.usage.total_tokens) avg_total_tokens
, AVG(attributes.gen_ai.usage.input_tokens) avg_input_tokens
, AVG(attributes.gen_ai.usage.output_tokens) avg_output_tokens
, AVG(attributes.gen_ai.server.time_to_first_token) avg_time_to_first_token
, AVG(attributes.gen_ai.server.time_per_output_token) avg_time_per_output_token
, attributes.gen_ai.reasoning_effort
, COUNT((CASE WHEN (attributes.gen_ai.finish_reason = 'stop') THEN 1 END)) successful_completions
FROM
  traces
WHERE (attributes.gen_ai IS NOT NULL)
GROUP BY round, team_id, attributes.gen_ai.system, attributes.gen_ai.request.model, attributes.gen_ai.reasoning_effort;`
        }
    ],
};

async function initDuckDB() {
    try {
        updateStatus('Initializing DuckDB WASM...');

        const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
        const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
        const worker_url = URL.createObjectURL(
            new Blob([`importScripts("${bundle.mainWorker}");`], { type: 'text/javascript' })
        );
        const worker = new Worker(worker_url);
        const logger = new duckdb.ConsoleLogger();
        db = new duckdb.AsyncDuckDB(logger, worker);
        await db.instantiate(bundle.mainModule);
        URL.revokeObjectURL(worker_url);

        conn = await db.connect();

        updateStatus('Loading Parquet files...');
        await loadParquetFiles();

        updateStatus('');
        await loadTablesList();
        renderSampleQueries();

        // NEW: accordion + filters
        initLeftAccordion();
        initLeftFilters();

        // Initialize results header meta (safe no-ops if header isn't present yet)
        updateResultsMeta({ source: '—', rows: '—', setTime: false });

    } catch (error) {
        console.error('Error initializing DuckDB:', error);
        updateStatus('Error: ' + error.message);
    }
}

async function loadParquetFiles() {
    const tables = [
        'audit',
        'events',
        'traces',
    ];

    for (const table of tables) {
        try {
            const response = await fetch(`/assets/data/${table}.parquet`);
            const arrayBuffer = await response.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            await db.registerFileBuffer(`${table}.parquet`, uint8Array);

            await conn.query(`CREATE TABLE ${table} AS SELECT * FROM read_parquet('${table}.parquet')`);
        } catch (error) {
            console.error(`Error loading ${table}:`, error);
        }
    }
}

async function loadTablesList() {
    try {
        const result = await conn.query('SHOW TABLES');
        const data = result.toArray();
        const tables = data.map(row => row.name);

        const tablesListDiv = document.getElementById('tables-list');
        if (tables.length === 0) {
            tablesListDiv.innerHTML = '<div class="info">No tables found</div>';
            return;
        }

        tablesListDiv.innerHTML = tables.map(table => `
            <div class="table-item">
                <strong>${table}</strong>
                <button class="btn-small" onclick="describeTable('${table}')">Schema</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading tables:', error);
    }
}

/**
 * Updates the Results header bar meta fields.
 * Requires these IDs in the DOM:
 * - results-source
 * - results-last-run
 * - results-rows
 */
function updateResultsMeta({ source = '—', rows = '—', setTime = true } = {}) {
    const sourceEl = document.getElementById('results-source');
    const lastRunEl = document.getElementById('results-last-run');
    const rowsEl = document.getElementById('results-rows');

    if (sourceEl) sourceEl.textContent = source;

    if (lastRunEl && setTime) {
        const now = new Date();
        lastRunEl.textContent = now.toLocaleTimeString();
    }

    if (rowsEl) rowsEl.textContent = String(rows);
}

window.describeTable = async function (tableName) {
    try {
        const result = await conn.query(`DESCRIBE ${tableName}`);
        displayResults(result, { source: `Schema (${tableName})` });
    } catch (error) {
        displayError(error.message);
    }
};

/* -----------------------------
   Accordion + Filters (NEW)
------------------------------ */
function initLeftAccordion() {
    const sections = document.querySelectorAll('.acc-section');
    if (!sections.length) return;

    sections.forEach(section => {
        const header = section.querySelector('.acc-header');
        const panel = section.querySelector('.acc-panel');
        if (!header || !panel) return;

        header.addEventListener('click', () => {
            const isOpen = section.classList.toggle('is-open');
            header.setAttribute('aria-expanded', String(isOpen));
        });
    });
}

function initLeftFilters() {
    const tablesFilter = document.getElementById('tables-filter');
    const queriesFilter = document.getElementById('queries-filter');

    if (tablesFilter) {
        tablesFilter.addEventListener('input', () => {
            const q = tablesFilter.value.trim().toLowerCase();
            document.querySelectorAll('#tables-list .table-item').forEach(el => {
                const text = el.textContent.toLowerCase();
                el.style.display = text.includes(q) ? '' : 'none';
            });
        });
    }

    if (queriesFilter) {
        queriesFilter.addEventListener('input', () => {
            const q = queriesFilter.value.trim().toLowerCase();

            document.querySelectorAll('#sample-queries .query-group').forEach(group => {
                let anyVisible = false;

                group.querySelectorAll('.sample-query').forEach(sample => {
                    const text = sample.textContent.toLowerCase();
                    const visible = text.includes(q);
                    sample.style.display = visible ? '' : 'none';
                    if (visible) anyVisible = true;
                });

                group.style.display = anyVisible ? '' : 'none';
            });
        });
    }
}
/* ----------------------------- */

function renderSampleQueries() {
    const samplesDiv = document.getElementById('sample-queries');
    let html = '';

    for (const [table, queries] of Object.entries(SAMPLE_QUERIES)) {
        html += `
            <div class="query-group">
                <h3>${table}</h3>
                ${queries.map((query) => `
                    <div class="sample-query">
                        <div class="sample-query-title">${query.description}</div>
                        <div class="query-item">
                            <pre><code class="language-sql">${hljs.highlight(query.query, { language: 'sql' }).value}</code></pre>
                            <button class="btn-small" onclick="runQuery(\`${query.query}\`, \`${query.description}\`)">Run</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    samplesDiv.innerHTML = html;
}

window.runQuery = async function (query, description = null) {
    document.getElementById('query-input').value = query;
    await executeQuery(description ? `Sample Query (${description})` : 'Sample Query');
};

async function executeQuery(sourceOverride = null) {
    const queryInput = document.getElementById('query-input');
    const query = queryInput.value.trim();

    if (!query) {
        displayError('Please enter a query');
        return;
    }

    try {
        const result = await conn.query(query);
        displayResults(result, { source: sourceOverride || 'SQL Terminal' });
    } catch (error) {
        displayError(error.message, sourceOverride || 'SQL Terminal');
    }
}

function displayResults(result, { source = 'Results' } = {}) {
    const resultsDiv = document.getElementById('results-output');
    const data = result.toArray();

    // Update header meta first (so even "0 rows" updates correctly)
    updateResultsMeta({
        source,
        rows: data.length,
        setTime: true
    });

    if (data.length === 0) {
        resultsDiv.innerHTML = '<div class="info">Query executed successfully. No results returned.</div>';
        return;
    }

    const columns = Object.keys(data[0]);

    let html = '<div class="table-wrapper"><table class="dark-mode">';
    html += '<thead><tr>' + columns.map(col => `<th>${col}</th>`).join('') + '</tr></thead>';
    html += '<tbody>';

    data.forEach(row => {
        html += '<tr>' + columns.map(col => {
            let value = row[col];
            if (value === null) value = '<em>null</em>';
            else if (typeof value === 'object') {
                value = JSON.stringify(value, (_, v) => typeof v === 'bigint' ? v.toString() : v);
            } else if (typeof value === 'bigint') {
                value = value.toString();
            }
            return `<td>${value}</td>`;
        }).join('') + '</tr>';
    });

    html += '</tbody></table></div>';
    resultsDiv.innerHTML = html;
}

function displayError(message, source = '—') {
    const resultsDiv = document.getElementById('results-output');

    // Update header meta even for errors
    updateResultsMeta({
        source,
        rows: '—',
        setTime: true
    });

    resultsDiv.innerHTML = `<div class="error">Error: ${message}</div>`;
}

function updateStatus(message) {
    document.getElementById('status').textContent = message;
}

document.getElementById('execute-btn').addEventListener('click', () => executeQuery('SQL Terminal'));
document.getElementById('clear-btn').addEventListener('click', () => {
    document.getElementById('query-input').value = '';
    document.getElementById('results-output').innerHTML = '';
    // Reset meta but don't change last-run time
    updateResultsMeta({ source: '—', rows: '—', setTime: false });
});

document.getElementById('query-input').addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        executeQuery('SQL Terminal');
    }
});

initDuckDB();
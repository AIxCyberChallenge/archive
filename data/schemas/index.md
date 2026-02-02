---
layout: default
title: CRUMBS Schema
permalink: /data/schemas/
---

<link rel="stylesheet" href="https://cdn.datatables.net/2.3.4/css/dataTables.dataTables.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/rose-pine-dawn.min.css">

<link rel="stylesheet" href="/assets/css/crumbs-schema.css">

<main>
  <div class="container">
    <h1>CRUMBS Data Schemas</h1>

    <p class="schema-help">
      Browse tables and fields below. Select a field to see description, example values, and a query snippet.
    </p>

    <div class="schema-layout">
      <div class="schema-master">

        <!-- Header bar (like advanced schema viewer): icon left, search right -->
        <div class="schema-headbar" aria-label="Schema table controls">
          <div class="schema-headbar-left" aria-label="Expand/collapse all">
            <button
              id="toggle_expand"
              class="icon-btn"
              type="button"
              title="Expand all"
              aria-label="Expand all"
            >
              ⤢
            </button>
          </div>

          <!-- DataTables search gets moved & rebuilt here via JS -->
          <div class="schema-headbar-right" id="dt_search"></div>
        </div>

        <!-- Secondary controls row -->
        <div class="schema-subbar" aria-label="Schema filters">
          <div class="schema-subbar-left">
            <select id="table_filter">
              <option value="">All tables</option>
            </select>

            <label class="required-toggle">
              <input type="checkbox" id="required_only" />
              Required
            </label>
          </div>

          <div class="schema-subbar-right">
            <button id="clear_filters" class="clear-filters-btn" type="button">
              Clear filters
            </button>
          </div>
        </div>

        <table id="schema_datatable" class="display compact">
          <thead>
            <tr>
              <th>Table</th>
              <th>Field</th>
              <th>Type</th>
              <th>Required</th>
              <th>Description</th>
            </tr>
          </thead>
        </table>
      </div>

      <aside class="schema-detail" aria-label="Field details">
        <div class="detail-card">
          <div class="detail-header">
            <div class="detail-header-row">
              <h2 class="detail-title">Field details</h2>
              <button
                id="copy_permalink"
                class="copy-link-btn"
                type="button"
                title="Copy link to this field"
                disabled
              >
                🔗 Copy link
              </button>
            </div>

            <div class="detail-meta" id="selected_schema_meta">
              <span class="muted">Select a field to see details.</span>
            </div>
          </div>

          <div id="selected_schema_examples">
            Click on a schema row above to see examples...
          </div>
        </div>
      </aside>
    </div>
  </div>

  <div class="container">
    <details class="schema-advanced">
      <summary>Advanced: Raw JSON schema</summary>
      <p class="muted">
        Source-of-truth JSON Schema for validation/integration.
      </p>
      {% include json_schema_viewer.html schema_url="/assets/json/data/merged_json_schemas.json" %}
    </details>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/javascript.min.js"></script>
  <script type="text/javascript" src="https://code.jquery.com/jquery-3.7.1.js"></script>
  <script type="text/javascript" src="https://cdn.datatables.net/2.3.4/js/dataTables.js"></script>
  <script type="text/javascript" src="/assets/js/data/schemas.js"></script>
</main>

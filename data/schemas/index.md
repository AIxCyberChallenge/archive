---
layout: default
title: CRUMBS Schema
permalink: /data/schemas/
---

<link rel="stylesheet" href="https://cdn.datatables.net/2.3.4/css/dataTables.dataTables.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/rose-pine-dawn.min.css">

<main>
    <div class="container">
        <h1>CRUMBS Data Schemas</h1>
        <p><button id="expand_button">Expand all tables/fields</button></p>
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
            <tfoot>
                <tr>
                    <th>Table</th>
                    <th>Field</th>
                    <th>Type</th>
                    <th>Required</th>
                    <th>Description</th>
                </tr>
            </tfoot>
        </table>
        <h2>Examples</h2>
        <div id="selected_schema_examples">Click on a schema row above to see examples...</div>
    </div>

    <div class="container">
        <h2>JSON schemas</h2>
{% include json_schema_viewer.html schema_url="/assets/json/data/merged_json_schemas.json" %}
    </div>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/javascript.min.js"></script>
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.7.1.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/2.3.4/js/dataTables.js"></script>
    <script type="text/javascript" src="/assets/js/data/schemas.js"></script>
</main>


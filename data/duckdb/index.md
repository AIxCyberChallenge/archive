---
layout: duckdb 
title: AIxCC Competition Archive
---


<main>
    <div class="container">
        <div class="sherpa-content" >
            <h2 class="mb-2">Data Explorer</h2>
            <p class="mb-2">Explore, interact with and reason over the competition results and telemetry</p>
        </div>

        <div class="main-content">
            <div class="sidebar">
                <h2>Getting Started</h2>
                <div id="status" class="status">Loading DuckDB...</div>

                <div class="tables-section">
                    <h3>Available Tables</h3>
                    <div id="tables-list"></div>
                </div>

                <div class="samples-section">
                    <h3>Sample Queries</h3>
                    <div id="sample-queries"></div>
                </div>
            </div>

            <div class="terminal-section">
                <div class="terminal-header">
                    <h3>SQL Terminal</h3>
                    <button id="clear-btn" class="btn-primary">Clear</button>
                </div>

                <div class="query-input-section">
                    <textarea id="query-input" placeholder="Enter your SQL query here..." rows="15"></textarea>
                    <button id="execute-btn" class="btn-primary">Execute Query</button>
                </div>

                <div class="results-section">
                    <h4>Results</h4>
                    <div id="results-output"></div>
                </div>
            </div>
        </div>
    </div>

    <script type="module" src="/assets/js/duckdb.js"></script>
</main>
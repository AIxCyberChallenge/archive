# Getting Started with CRUMBS

CRUMBS is a large, public dataset from the AIxCC Finals that captures Cyber Reasoning System behavior, competition telemetry, and submission artifacts at scale. This page is designed for analysts and researchers who want to explore the data, understand how it is organized, and choose the best way to work with it—whether directly in the browser, locally with DuckDB, or at scale using AWS Athena. If you are new to CRUMBS, start with the Interactive Data Explorer below; for deeper analysis, follow the links to documentation and example notebooks.

<br>

CRUMBS combines multiple data sources collected during the AIxCC Finals competition and exhibition rounds, including competition audit logs, Cyber Reasoning System (CRS) telemetry, competition score evaluations, competition task objects, and CRS submission artifacts (POVs, patches).

In total, the dataset contains **400M+ records**, including CRS LLM prompts, completions, and tool calls.

<br>

---

## Fastest Way to Explore (No Setup Required)

### 🔍 Interactive Data Explorer (Recommended)

If you want to quickly understand what’s in CRUMBS, start here.

You can explore a representative sample of the dataset directly in your browser using a **web-based DuckDB session**. No AWS account or local setup is required.

<div style="display: flex; align-items: center;">
  <div>
    <img src="/assets/img/dataexplorer.gif" style="width:300px" />
  </div>
  <div style="margin-left: 20px">
    <p>
      Explore approximately <strong>20k rows</strong> from the CRUMBS dataset using SQL.
      Sample queries are provided to demonstrate the structure of key tables and the types of analysis you can perform.
    </p>
    <p>
      👉 <a href="../duckdb/">Open the Interactive Data Explorer</a>
    </p>
  </div>
</div>

<br>

---

## Accessing the Full Dataset

Once you’re familiar with the data structure, you can move beyond the sample and work with the full CRUMBS dataset. Data is stored in Amazon S3 and can be accessed in multiple ways depending on your analysis needs.

### 🖥 Local Analysis with DuckDB

For fast local exploration, you can download the CRUMBS Parquet files and query them locally using DuckDB.

- SQL-based analysis
- No cloud services required after download
- Ideal for exploratory analysis and prototyping

📘 Setup instructions and helper scripts are available in the  
[CRUMBS GitHub repository – DuckDB setup](https://github.com/AIxCyberChallenge/crumbs/tree/main/duckdb)

---

### ☁️ Cloud-Scale Analysis with AWS Athena

For large-scale analysis, CRUMBS can be queried directly in S3 using AWS Athena.

- Serverless SQL queries
- No local storage required
- Scales to the full dataset

📘 Athena setup scripts and documentation are available in the  
[CRUMBS GitHub repository – Athena setup](https://github.com/AIxCyberChallenge/crumbs/tree/main/athena)

💡 As a reference, running all example notebooks typically costs **less than $1** in Athena query charges.

---

## Data Organization

All CRUMBS data is publicly available via the `s3://aicyberchallenge-crumbs` AWS S3 bucket and organized by format and purpose. Understanding this layout will help you choose the right access method and write more efficient queries.

| Name    | S3 Location | Description |
|---------|-------------|-------------|
| parquet | `s3://aicyberchallenge-crumbs/parquet/` | Primary analytics format for DuckDB and Athena |
| jsonl   | `s3://aicyberchallenge-crumbs/jsonl/`   | Raw newline-delimited event records |
| objects | `s3://aicyberchallenge-crumbs/objects/` | Competition artifacts (POVs, patches, code) |
| schemas | `s3://aicyberchallenge-crumbs/schemas/` | Schema definitions for CRUMBS data types |
| samples | `s3://aicyberchallenge-crumbs/samples/` | Small subsets for quick testing |

> **Note:** The data under `jsonl` and `parquet` represent the **same underlying records**, provided in different formats for different use cases. Each dataset has a one-to-one correspondence across formats (e.g., a table available in Parquet is also available in JSONL).

🔍 For an interactive, analyst-friendly view of the schemas, use the **CRUMBS Schema Viewer**. The viewer lets you browse tables and fields, inspect field types and required/optional status, and copy example SQL or sample records for exploration.  
➡️ [**CRUMBS Schema Viewer**](/data/schemas/)

📘 Detailed schema documentation is available in the  
[CRUMBS GitHub repository](https://github.com/AIxCyberChallenge/crumbs/).

---

## Example Analyses & Marimo Notebooks

We provide a growing collection of **Marimo notebooks** that demonstrate how to access, analyze, and derive insights from the CRUMBS dataset.

These notebooks include:
- End-to-end data access examples
- CRS behavior and performance analysis
- Narrative-driven explorations of competition results

If you’re new, we recommend starting with the published notebooks before running analyses locally.

- 📊 <a href="../notebooks/">View published notebooks</a>
- 📓 <a href="https://github.com/AIxCyberChallenge/crumbs/tree/main/notebooks">Browse notebooks on GitHub</a>

Marimo is a modern, script-first Python notebook framework designed for reproducible, interactive data exploration.

---

## Contribute

The [CRUMBS GitHub repository](https://github.com/AIxCyberChallenge/crumbs/) exists to make AIxCC Finals data widely accessible to the research community.

We welcome contributions, especially new Marimo notebooks, derived analyses, and documentation improvements. If you create a notebook that tells a compelling story from the CRUMBS dataset, we encourage you to submit a pull request.

# Getting Started with CRUMBS

<br>

The data collected during AIxCC Finals competition and the exhibtion rounds has been processed and formed into a dataset we call CRUMBS. 
All CRUMBS data is open to the public via the `s3://aicyberchallenge-crumbs` AWS S3 bucket. 
The data is a combination of the competition audit log, competitor Cyber Reasoning System (CRS) telemetry, competition score evaluations, competition task objects and CRS submission artifacts (POVs, Patches). 
In total, there are over 400M records in CRUMBS.
The CRS telemetry includes CRS LLM prompt/completions and tool calls. 

<br>
<br>


| Name    | S3 Location                     | Description                      |
|---------|---------------------------------|----------------------------------|
| parquet | `s3://aicyberchallenge-crumbs/parquet/`     | CRUMBS data stored as parquet files |
| jsonl   | `s3://aicyberchallenge-crumbs/jsonl/`       | CRUMBS data stored as new-line delimted json |
| objects | `s3://aicyberchallenge-crumbs/objects/`     | Competition tasking objects and CRS submission artifacts (POVs, Patches) |
| schemas | `s3://aicyberchallenge-crumbs/schemas/`     | JSON Schemas for the data types in CRUMBS |
| samples | `s3://aicyberchallenge-crumbs/samples/`     | A small subset of the CRUMBS data in both jsonl and parquet formats |


<br>

## Analzying the Data

The system logs and CRS telemetry in the CRUMBS dataset is provided as a collection of Parquet files, organized by data type and partitioned by round and team. This structure enables efficient access and compatibility with a variety of analysis platforms, including DuckDB and AWS Athena.

<br>

Because the data resides in Amazon S3 in Parquet format, Athena is a natural choice for large-scale analysis. Athena is a serverless, interactive query service that supports standard SQL queries directly over data stored in S3, eliminating the need for data loading or complex infrastructure management.

<br>

For researchers who prefer not to use AWS services, a downloadable copy of the dataset is also available for local analysis.

<br>

The [CRUMBS github repository](https://github.com/AIxCyberChallenge/crumbs/) provides ready-to-use scripts and examples to help researchers get started with either DuckDB or Athena quickly. 
* [DuckDB Setup](https://github.com/AIxCyberChallenge/crumbs/tree/main/duckdb) for efficient local querying against locally synced CRUMBS data files.
* [AWS Athena Setup](https://github.com/AIxCyberChallenge/crumbs/tree/main/athena) for provisioning the dataset as an Athena database in your own AWS account.

<br>

## Interactive Data Explorer

<div style="display: flex;">
<div>
<img src="/assets/img/dataexplorer.gif" style="width:300px" />
</div>
<div style="margin-left: 20px">
<p>You can started directly from your browser. A small sample of this data is available <a href="../duckdb/">here</a> for you to explore in a web-based DuckDB session. Write your own SQL queries against approximately 20k of the 400M recrords in CRUMBS. We've also provided a number of sample queries to help demonstrate the data in contained in several of the CRUMBS data tables and what can be done with it.</p>
</div>
</div>

<br>

## Examples


The [Competition Data Insights](../notebooks/) page has several example [Marimo notebooks](https://marimo.io/) that walk through stories found in the data and ways you can query and analzye the data using other tools. 

<br>

<br>

## Contribute


The [CRUMBS github repository](https://github.com/AIxCyberChallenge/crumbs/) exists to help make the AIxCC Finals data widely accesible to the community.
It offers documentation, scripts and a place to collaborate with other researchers and share insights for the advancement of CRS technology.
We want to foster collaboration to advance Cyber Reasoning Systems (CRS) techonology to accelerate the distribution of AIxCC-developed technology. 
Contributions are encouraged. In particular, we welcome pull requests that add Marimo notebooks showcasing analyses, derived insights, or compelling narratives built on the CRUMBS dataset.

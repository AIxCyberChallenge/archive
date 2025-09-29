# Getting Started with CRUMBS

<br>


The data collected during AIxCC Finals and the exhibtion rounds has been processed and formed into a dataset we call CRUMBS. All CRUMBS data is stored and freely avalible via the `s3://aicyberchallenge-crumbs` AWS S3 bucket. The data in CRUMBS is a combination of the competition audit log, CRS telemetry, competition score evaluations, competition task objects and CRS submissions (POVs, Patches, Bundles). A layout of the S3 bucket is described in the table below.<br><br>

| Type   | S3 Location                     | Description                      |
|--------|---------------------------------|----------------------------------|
| audit  | `s3://aicyberchallenge-crumbs/parquet/audit/`           | Tasking and CRS submission and evaluation events |
| traces | `s3://aicyberchallenge-crumbs/parquet/traces/`        | Telemtry style spans that capture team provided CRS activity during the competition |
| events | `s3://aicyberchallenge-crumbs/parquet/events/`       | Event data from CRS telemetry spans broken out of the span. This includes LLM prompts and responses |
| scores_by_submission | `s3://aicyberchallenge-crumbs/parquet/scores_by_submission`       | Per-submission scoreing records |
| scores_by_team_and_task | `s3://aicyberchallenge-crumbs/parquet/scores_by_team_and_task/`       | Aggregated scoring per team per task |
| objects | `s3://aicyberchallenge-crumbs/objects/`     | Competition tasking objects and CRS submissions |

<br>
<br>

The queryable CRUMBS data set is a collection of parquet files, seperated by type of data and further partitioned by round and by team. This makes it accesible via a number of tools including duckdb and Athena. The [CRUMBS github repository](https://github.com/AIxCyberChallenge/crumbs/) and this website have several example [Marimo notebooks](../notebooks/) that walk through different ways you can use the data with Athena and with local data analysis tools.

<br><br>

# Local Usage

The data can also be analyzed locally with a number of different data analysis tools. Here, we provide an example using DuckDB.

<br>

## DuckDB

The CRUMBS parquet files can be downloaded locally by running the following command. You will need approximately 50 GB of disk space to download the entire archive.

<br>
```bash
aws s3 cp s3://aicyberchallenge-crumbs/parquet/ ./data/ --recursive --exclude "*" --include "*.parquet"
```
<br>

Navigate to the data directory and launch a DuckDB cli session. To create the base tables in the DuckDB session, you can run these commands.

<br>

```code
D CREATE VIEW events AS SELECT * FROM read_parquet('data/parquet/events/round=*/team_id=*/all.parquet');
D CREATE VIEW traces AS SELECT * FROM read_parquet('data/parquet/traces/round=*/team_id=*/all.parquet');
D CREATE VIEW audit AS SELECT * FROM read_parquet('data/parquet/audit/round=*/team_id=*/all.parquet');
D select count(distinct(audit.event.object_name)) entity_count, team_id, event.entity from audit where round = 'final' and team_id is not null group by team_id, event.entity order by entity_count desc;
```

<br>

A scripted workflow for setting up full CRUMBS access with DuckDB can be found in the [CRUMBS github repository](https://github.com/AIxCyberChallenge/crumbs/)

<br>

# Using AWS Athena

<br>

Because the data is stored as parquet in AWS S3, Athena is a natural platform for querying and analysis. AWS Athena is a serverless, interactive query service that lets you analyze data directly in Amazon S3 using standard SQL. You pay only for the queries you run, with no infrastructure to manage. The guide on setting up Athena for CRUMBS analysis below expects some familiarity with the platform.

<br>

## AWS Accounts

To access CRUMBS in Athena, you will need an AWS account. More information on creating an AWS account can be found [here](https://aws.amazon.com/resources/create-account/)

<br>

## Creating Tables and Views

SQL create statements for several tables and views have been provided in the [CRUMBS github repository](https://github.com/AIxCyberChallenge/crumbs/main/athena). These must be run in Athena prior to running any queries. The CRUMBS repository has a helper script that will create an the Athena database, tables and views that make up CRUMBS. It assumes an already authenticated and active AWS session.

<br>

```sh
python create_database.py --database crumbs
```

<br>

## Querying the data

Once the table is created, you can run queries like those below.

<br>

This query will fetch and link prompts and completions from the events table. It includes joins on the traces and task tables to pull in additional data about the LLM request, including LLM model, provider and AIxCC task information (when possible). It allows for filtering on things like llm provider names, challenge task programming language, and team ids.


<br>

```sql
select events.team_name,
	events.team_id,
	events.span_id,
	events.trace_id,
	events.task_id,
	task.challenge_name, 
	task.language,
	traces.attributes.gen_ai.request.model,
	traces.attributes.gen_ai.provider.name,
	filter(
		ARRAY_AGG(events.attributes.gen_ai.prompt),
		x->x is not null
	) as prompts,
	filter(
		ARRAY_AGG(events.attributes.gen_ai.completion),
		x->x is not null
	) as completions
from events
	inner join traces on events.span_id = traces.span_id
	left outer join task on events.task_id = task.task_id
where events.round = 'final'
	and traces.attributes.gen_ai.provider.name = 'anthropic'
	and task.language = 'c'
	and events.team_id = '3020f48e-8999-4a3e-a238-afe4d187a566'
	and (
		events.attributes.gen_ai.prompt is not null
		or events.attributes.gen_ai.completion is not null
	)
group by (
		events.span_id,
		events.team_id,
		events.trace_id,
		events.task_id,
		events.team_name,
		traces.attributes.gen_ai.request.model,
		traces.attributes.gen_ai.provider.name,
		task.language,
		task.challenge_name
	)
limit 10
```

<br>

This query will count the submitted entity types (POVs, Patches, Bundles) in the finals for each team 


<br>

```sql
select count(distinct(audit.event.object_name)) entity_count, 
	team_id, 
	event.entity 
from audit 
where round = 'final' 
	and team_id is not null 
group by team_id, event.entity 
order by entity_count desc;
```

<br>

This query will produce LLM usage statistics broken down by team and task in the final round of the competition

<br>

```sql
select count(*) as request_count,
	sum(t.attributes.gen_ai.usage.total_tokens) as total_tokens,
	avg(t.attributes.gen_ai.usage.total_tokens) as avg_total_tokens,
	t.team_id,
	task.language,
	t.round,
	t.task_id
from traces t
	inner join task on t.task_id = task.task_id
where t.round = 'final'
	and t.attributes.gen_ai.request.model is not null
group by (t.team_id, t.round, t.task_id, task.language)
order by t.team_id;
```
<br>

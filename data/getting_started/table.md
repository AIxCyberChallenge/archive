# Getting Started with CRUMBS

<br>

All CRUMBS data is stored and freely avalible via the `s3://aicyberchallenge-crumbs` s3 bucket. The data in CRUMBS is a combination of the competition audit log, CRS telemetry, and competition score evaluation, competition task objects and CRS submissions (POVs, Patches, Bundles). A layout of the S3 bucket is described in the table below.<br><br>

| Type   | S3 Location                     | Description                      |
|--------|---------------------------------|----------------------------------|
| audit  | `s3://aicyberchallenge-crumbs/processed/audit/`           | Tasking and CRS submission and evaluation events |
| traces | `s3://aicyberchallenge-crumbs/processed/traces/`        | Telemtry style spans that capture team provided CRS activity during the competition |
| events | `s3://aicyberchallenge-crumbs/processed/events/`       | Event data from CRS telemetry spans broken out of the span. This includes LLM prompts and responses |
| scores_by_submission | `s3://aicyberchallenge-crumbs/processed/scores_by_submission`       | Per-submission scoreing records |
| scores_by_team_and_task | `s3://aicyberchallenge-crumbs/processed/scores_by_team_and_task/`       | Aggregated scoring per team per task |
| objects | `s3://aicyberchallenge-crumbs/objects/`     | Competition tasking objects and CRS submissions |

<br>
<br>

The queryable CRUMBS data set is a collection of parquet files, seperated by type of data and further partitioned by round and by team. This makes it accesible via a number of tools including duckdb and Athena. The [CRUMBS github repository](https://github.com/AIxCyberChallenge/crumbs/) and this website have several example marimo notebooks that walk through different ways you can use the data with Athena and with local data analysis tools.

<br><br>

# Local Usage

The data can also be analyzed locally with a number of different data analysis tools. Here, we provide an example using DuckDB.

<br>

## DuckDB

The CRUMBS parquet files can be downloaded locally by running the following command. You will need approximately 50 GB of disk space to download the entire archive.

<br>
```bash
aws s3 cp s3://aicyberchallenge-crumbs/processed/ ./data/ --recursive --exclude "*" --include "*.parquet"
```
<br>

Navigate to the data directory and launch a DuckDB cli session.

<br>

```code
D CREATE VIEW events AS SELECT * FROM read_parquet('events/round=*/team_id=*/all.parquet');
D CREATE VIEW traces AS SELECT * FROM read_parquet('traces/round=*/team_id=*/all.parquet');
D CREATE VIEW audit AS SELECT * FROM read_parquet('audit/round=*/team_id=*/all.parquet');
D select count(distinct(audit.event.object_name)) entity_count, team_id, event.entity from audit where round = 'final' and team_id is not null group by team_id, event.entity order by entity_count desc;
```

<br><br>

# Using AWS Athena

<br>

Because the data is stored as parquet in AWS S3, Athena is a natural platform for querying and analysis. AWS Athena is a serverless, interactive query service that lets you analyze data directly in Amazon S3 using standard SQL. You pay only for the queries you run, with no infrastructure to manage. The guide on setting up Athena for CRUMBS analysis below expects some familiarity with the platform.

<br>

## Creating Tables and Views

SQL create statements for several tables and views have been provided in the [CRUMBS github repository](https://github.com/AIxCyberChallenge/crumbs/main/athena). These must be run in Athena prior to running any queries. 

<br>

As an example, we will create the `audit` table using the create statments in `tables/audit.sql` by running this command in Athena.

<br>

```sql
CREATE EXTERNAL TABLE `audit`(
  `disposition` string, 
  `event` struct<bucket_name:string,entity:string,entity_id:string,file_archived:string,object_name:string,pov_id:string,status:string,architecture:string,engine:string,fuzzer_name:string,sanitizer:string,testcase_sha256:string,bundle_id:string,broadcast_sarif_id:string,description:string,freeform_id:string,patch_id:string,crs_url:string,details:struct<competition_reachable:string,backtrace:string,error:string,exception:string>,error:string,ready:boolean,state:struct<tasks:struct<canceled:tinyint,errored:tinyint,failed:smallint,pending:tinyint,processing:tinyint,succeeded:smallint,waiting:smallint>>,version:string,functionality_tests_passing:boolean,patch_sha256:string,payload:string,retries:smallint,challenge_name:string,commit_hash:string,deadline:bigint,fuzz_tooling_hash:string,fuzz_tooling_url:string,repo_url:string,task_type:string,unharnessed:boolean,assessment:string,assessment_id:string,sarif_broadcast_id:string,sarif_id:string,base_commit_hash:string,delta_commit_hash:string,challenge:struct<base_ref:string,branch_commit_sha:string,branch_name:string,challenge_type:string,delta_base_branch:string,delta_base_branch_exists:boolean,delta_head_branch:string,delta_head_branch_exists:boolean,delta_pull_request_exists:boolean,delta_ref:string,full_scan_release_exists:boolean,full_scan_release_tag_exists:boolean,gh_trigger_acked:boolean,gh_trigger_nacked:boolean,git_artifact_exists:boolean,html_url:string,is_delta_scan:boolean,is_full_scan:boolean,key:string,language:string,name:string,owner:string,release_name:string,release_tag_name:string,repo_name:string,round_id:string,sarif_name:string,sarif_sha:string,unharnessed:boolean,vulns:array<struct<author:string,details:struct<cwes:array<string>,description:string,locations:array<struct<endColumn:tinyint,endLine:smallint,path_from_root:string,startColumn:tinyint,startLine:smallint>>>,has_valid_sarif:boolean,metadata_spec_version:string,name:string,patch:struct<bad:string,good:string>,pov:struct<blob:string,harness:string>,sarif_blobs:array<string>,valid:boolean,vuln_id:string>>,vulns_with_valid_sarif:array<string>>>, 
  `event_type` string, 
  `log_context` string, 
  `round_id` string, 
  `schema_version` string, 
  `task_id` string, 
  `team_id` string, 
  `timestamp` double, 
  `version` string)
PARTITIONED BY ( 
  `round` string)
ROW FORMAT SERDE 
  'org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe' 
STORED AS INPUTFORMAT 
  'org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat' 
OUTPUTFORMAT 
  'org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat'
LOCATION
  's3://aicyberchallenge-crumbs/processed/audit/';
```

<br>

We recommend creating all the tables and views supplied here.

After the table is created, you must run the following command to recognize the partitions of the table. This must be done for every table you add.

<br>

```sql
MSCK REPAIR TABLE audit;
MSCK REPAIR TABLE events;
MSCK REPAIR TABLE tasks;
MSCK REPAIR TABLE scores_by_submission;
MSCK REPAIR TABLE scores_by_team_and_task;
```
<br><br>
## Querying the data

Once the table is created, you can run queries like: 
<br><br>
```sql
--- Count the submitted entity types in the finals for each team 
select count(distinct(audit.event.object_name)) entity_count, team_id, event.entity from audit where round = 'final' and team_id is not null group by team_id, event.entity order by entity_count desc;
```
<br>
```sql
--- LLM usage statistics per team per task for finals
select count(*) as request_count,
	sum(t.attributes.gen_ai.usage.total_tokens) as total_tokens,
	avg(t.attributes.gen_ai.usage.total_tokens) as avg_total_tokens,
	t.team_id,
	tasks.language,
	t.round,
	t.task_id
from traces t
	inner join tasks on t.task_id = tasks.task_id
where t.round = 'final'
	and t.attributes.gen_ai.request.model is not null
group by (t.team_id, t.round, t.task_id, tasks.language)
order by t.team_id;
```
<br>
```sql
--- Get all linked prompts and completions for a given team that. Join on task information when avalible
select events.team_name,
	events.team_id,
	events.span_id,
	events.trace_id,
	events.task_id,
	tasks.challenge_name, 
	tasks.language,
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
	left outer join tasks on events.task_id = tasks.task_id
where events.round = 'final'
	and traces.attributes.gen_ai.provider.name = 'anthropic'
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
		tasks.language,
		tasks.challenge_name
	)
limit 10
```

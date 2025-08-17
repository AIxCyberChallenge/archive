---
layout: default
title: Quickstart
description: Get started building a CRS compatible with the AIxCC Competition APIs
---

{% capture qs_md %}
### Build your own CRS: quickstart

Implement the CRS API endpoints for `/status/`, `/v1/task/`, and `/v1/sarif/`. Then use the Competition API to trigger smoke tests and iterate.

> Note: The Competition API source code has not yet been released by the organizers. The OpenAPI specs are provided so researchers can build compliant CRSs for future testing.

#### Request an integration (delta) task

```bash
curl -u <team-id>:<secret> -X POST \
  'https://api.aixcc.tech/v1/request/delta/' \
  -H 'Content-Type: application/json' \
  --data '{"duration_secs": 3600}'
```

#### Request a specific Exhibition 3 challenge

```bash
curl -u <team-id>:<secret> -X POST \
  'https://api.aixcc.tech/v1/request/ex3-tk-full-01/' \
  --json '{"duration_secs": 43200}'
```

#### List available challenges

```bash
curl -u <team-id>:<secret> -X GET \
  'https://api.aixcc.tech/v1/request/list/'
```

#### Optional: generate client/server stubs (OpenAPI Generator)

```bash
docker run --rm -v "$PWD":/local openapitools/openapi-generator-cli generate \
  -i /local/docs/competition.yaml \
  -g <lang> \
  -o /local/out
```

See OpenAPI Generator docs for language-specific config.
{% endcapture %}

<div class="container">
  <div class="sherpa-content">
    {{ qs_md | markdownify }}
  </div>
</div>

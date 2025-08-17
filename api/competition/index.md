---
layout: default
title: Competition API
permalink: /api/competition/
---

<main>
  <div class="container">
    <h1>Competition API</h1>
    <p class="mb-2">Read the Competition API specification using Redoc.</p>

    <div class="sherpa-content" markdown="1">

> Highlights in v0.4
>
> - PoV endpoint is now `/v1/task/<task_id>/pov` (renamed from `/vuln`).
> - New status `errored` indicates a server-side testing issue; resubmit when seen.
> - Initial returned status is never `invalid` (that status was removed).
> - The optional SARIF field moved to its own endpoint (`/submitted-sarif`).
> - Patch responses include `functionality_tests_passing` for clarity.
> - New "bundle" entity lets you associate PoVs, patches, and SARIF (submitted or broadcast) in any order.

    </div>
  </div>
</main>

{% include redoc.html spec_url="/docs/competition.yaml" %}

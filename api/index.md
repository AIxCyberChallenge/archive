---
layout: default
title: API Explorer
description: Redoc viewers and documentation for the AIxCC Competition API and CRS API
---

<main>
  <div class="container">
  <div class="sherpa-content" markdown="1">
  <h2 class="mb-2">How the APIs fit together</h2>
  <p class="mb-2">A single Competition API coordinates many CRSs. The Competition API issues tasks and broadcasts SARIF to each CRS. CRSs respond with proofs of vulnerability (POVs), patches, submitted SARIF, and assessments of broadcast SARIF. Bundles allow associating related submissions.</p>
  </div>

  <div class="card-grid">
    <a class="card" id="link-comp" href="/api/competition/">
      <div class="sherpa-content">
        <h2>Competition API</h2>
        <p>The public interface the infrastructure exposes to teams. Sends tasks and broadcast SARIF to CRSs; accepts POVs, patches, submitted SARIF, assessments, and bundles.</p>
      </div>
    </a>
    <a class="card" id="link-crs" href="/api/crs/">
      <div class="sherpa-content">
        <h2>CRS API</h2>
        <p>The interface each team’s CRS provides so the Competition API can deliver tasks and receive status. Defines how CRSs handle broadcasts (e.g., SARIF) and report status.</p>
      </div>
    </a>
    <a class="card" id="link-crs" href="/api/quickstart/">
      <div class="sherpa-content">
        <h2>Quickstart</h2>
        <p>Get started building a CRS.</p>
      </div>
    </a>
  </div>

  <div class="diagram-wrap">
    <div class="d2" data-src="/assets/d2/api-overview.d2"></div>
  </div>
</div>
</main>

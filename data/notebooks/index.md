---
layout: default
title: Data Explorer
description: Interactive access to the AIxCC CRUMBS dataset (coming soon)
---


<main>
    <div class="container">
    <div class="sherpa-content" >
    <h2 class="mb-2">Competition Insights</h2>
    <p class="mb-2">Explore Marimo notebooks that tell stories from the competition, explore the data we collected, and how you can interact with it</p>
    </div>

        <div class="card-grid">
            {% for notebook in site.notebooks %}
            <a class="card" href="{{ notebook.notebook_html | relative_url }}">
                <img src="{{ notebook.screenshot }}" alt="CRUMBS Notebook" />
                <div class="team-info">
                <h2>{{ notebook.title }}</h2>
                    <p><strong>Description:</strong> {{ notebook.description }}</p>
                    <p style="margin-top: 20px"><strong>Created:</strong> {{ notebook.date | date: "%B %d, %Y" }}</p>
                </div>
            </a>
            {% endfor %}
        </div>
    </div>
</main>
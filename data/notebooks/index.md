---
layout: default
title: Data Explorer
description: Interactive access to the AIxCC CRUMBS dataset (coming soon)
---

<main>
    <div class="container">
    <div class="sherpa-content" >
    <h2 class="mb-2">CRUMBS Notebooks</h2>
    <p class="mb-2">We have provided some sample Marimo notebooks to showcase some of the data and ways you can interact with it.</p>
    </div>

        <div class="card-grid">
            {% for notebook in site.notebooks %}
            <a class="card" href="{{ notebook.notebook_html | relative_url }}">
                <img src="{{ notebook.screenshot }}" style="width: 25%;" alt="CRUMBS Notebook" />
                <div class="team-info">
                <h2>{{ notebook.title }}</h2>
                    <p><strong>Description:</strong> {{ notebook.description }}</p>
                    <p><strong>Topics:</strong> {{ notebook.topics | join: ", " }}</p>
                    <p><strong>Created:</strong> {{ notebook.date | date: "%B %d, %Y" }}</p>
                </div>
            </a>
            {% endfor %}
        </div>
    </div>
</main>
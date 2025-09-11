---
layout: default
title: Data Explorer
description: Interactive access to the AIxCC CRUMBS dataset (coming soon)
---

<main>
    <div class="container">
        <h2>CRUMBS Notebooks</h2>
        <p>We have provided some sample Marimo notebooks to showcase some of the data and ways you can interact
            with it.</p>
        {% for notebook in site.notebooks %}
        <div class="notebook-card" style="border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3><a href="{{ notebook.notebook_html| relative_url }}">{{ notebook.title }}</a></h3>
            <p><strong>Description:</strong> {{ notebook.description }}</p>
            <p><strong>Topics:</strong> {{ notebook.topics | join: ", " }}</p>
            <p><strong>Created:</strong> {{ notebook.date | date: "%B %d, %Y" }}</p>
            <a href="{{ notebook.notebook_html | relative_url }}" class="btn btn-primary"
                style="background-color: #007cba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px;">View
                Notebook →</a>
        </div>
        {% endfor %}
    </div>
</main>
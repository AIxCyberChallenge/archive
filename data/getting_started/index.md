---
layout: default
title: Getting Started
permalink: /data/getting_started/
---

<main>
    <div class="container" >
        <div class="">
            {% capture my_include %}{% include_relative table.md %}{% endcapture %}
            {{ my_include | markdownify }}
        </div>
    </div>
</main>
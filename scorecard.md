---
layout: page
title: Scorecard
permalink: /scorecard/
summary: "Every Bitslyf prediction, with its confidence, its date and how it turned out."
---
{% assign preds = site.predictions | sort: "date" | reverse %}
{% assign resolved = preds | where_exp: "d", "d.result != 'open'" %}

Every prediction made on Bitslyf, kept in public. The record only means something once enough calls have resolved, so read the hit rate with that in mind.

{% include tally.html %}

## Every call

<table>
  <thead><tr><th>Claim</th><th>Confidence</th><th>Resolves</th><th>Status</th></tr></thead>
  <tbody>
  {% for p in preds %}
    <tr><td><a href="{{ p.url | relative_url }}">{{ p.claim }}</a></td><td>{{ p.confidence }}%</td><td>{{ p.resolves | date: "%-d %b %Y" }}</td><td><strong>{{ p.result | capitalize }}</strong></td></tr>
  {% endfor %}
  </tbody>
</table>

## Calibration

A forecaster is well calibrated when the calls made at 70% come true about 70% of the time. This table fills in as calls resolve.

<table>
  <thead><tr><th>Confidence</th><th>Resolved</th><th>Correct</th><th>Hit rate</th></tr></thead>
  <tbody>
  {% for b in (5..9) %}
    {% assign low = b | times: 10 %}{% assign high = low | plus: 10 %}
    {% assign inb = resolved | where_exp: "d", "d.confidence >= low and d.confidence < high" %}
    {% assign hits = inb | where: "result", "correct" %}
    <tr><td>{{ low }}–{{ high | minus: 1 }}%</td><td>{{ inb.size }}</td><td>{{ hits.size }}</td><td>{% if inb.size > 0 %}{{ hits.size | times: 100 | divided_by: inb.size }}%{% else %}–{% endif %}</td></tr>
  {% endfor %}
  </tbody>
</table>

{% include rules.html %}

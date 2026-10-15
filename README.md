# Bitslyf

Research log on industries, workflows and predictions. Static Jekyll site, hosted on GitHub Pages.

## Deploying

1. Create a repo named `bitslyf.github.io` (or any repo with Pages enabled).
2. Push these files to the default branch.
3. Settings → Pages → Source: *Deploy from a branch* → your branch, `/ (root)`.
4. For the custom domain: Settings → Pages → Custom domain → `bitslyf.com`, then add these DNS records at your registrar:
   - `A` records for the apex to GitHub's four Pages IPs (listed in GitHub's docs).
   - `CNAME` for `www` → `<username>.github.io`.
5. Tick *Enforce HTTPS* once the certificate is issued.

No build step and nothing to install — GitHub builds the Jekyll site on push.

## Writing an essay

Add a file to `_essays/`, named `YYYY-MM-DD-slug.md`:

```yaml
---
title: "Your headline"
date: 2026-10-20
layer: analysis      # analysis | research | thesis
slug: your-slug
summary: "The one line shown on the feed."
---

Your essay, in Markdown.
```

It appears on the feed and under its tag automatically. No HTML to touch.

## Making a prediction

Add a file to `_predictions/`, named `YYYY-MM-DD-slug.md`. Front matter only — predictions are
records, not essays:

```yaml
---
claim: "One sentence, falsifiable"
date: 2026-10-20
confidence: 70              # a number, never a word
resolves: 2027-06-30
result: open                # open | correct | wrong
essay: your-slug            # the essay that argued it
falsified_by: "What would prove this wrong."
source: "Where this resolves against."
summary: "Line shown on the feed."
---
```

When it resolves, **append** — never edit the claim:

```yaml
result: wrong
resolved_on: 2026-09-30
resolution: "What actually happened, and where the reasoning failed."
```

The tally on the Predictions tab (made / resolved / correct) updates itself.

## Before launch

- Point the subscribe form at an email provider (Buttondown, Kit). It is inert until then.
- Fill in the social links in `_config.yml` and the contact address in `about.md`.
- Delete the sample essays and predictions.

## Local preview (optional)

```sh
gem install bundler jekyll
jekyll serve
```

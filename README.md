# Bitslyf

Discover. Predict. Build. A research lab on industries, from how they work to what to build next.
Jekyll site, built by GitHub Actions and served on GitHub Pages at bitslyf.com.

## Where posts go

| Log | Folder | Page URL |
|---|---|---|
| Analysis | `_analysis/` | bitslyf.com/analysis/your-title/ |
| Research | `_research/` | bitslyf.com/research/your-title/ |
| Prediction | `_predictions/` | bitslyf.com/prediction/your-title/ |
| Thesis | `_thesis/` | bitslyf.com/thesis/your-title/ |
| RFS | `_rfs/` | bitslyf.com/rfs/your-title/ |

Name each file `YYYY-MM-DD-your-title.md`. The part after the date becomes the URL,
so `_analysis/2026-11-01-how-semiconductor-factories-are-built.md` opens at
`bitslyf.com/analysis/how-semiconductor-factories-are-built/`.

Each log page shows 12 entries, newest first. Page 2, 3 … appear by themselves.
The homepage's "The latest work", the counts in "The five logs", the scorecard line
and the search all update by themselves when you push a post.

## Analysis, Research, Thesis or RFS post

```markdown
---
title: "How semiconductor factories are built"
summary: "One or two sentences. Shown on the list page, the homepage and under the title."
tags: [semiconductors, fabs]      # used by search (#semiconductors)
builds_on: some-other-post        # optional: the file name part of an earlier post
takeaways:                        # optional box at the top
  - First point
sources:                          # optional list at the end
  - title: "TSMC Q3 2026 earnings call"
    url: "https://..."
---

Your full explanation, in Markdown. Use ## for section headings.
```

## Prediction post

```markdown
---
claim: "Packaging capacity remains the binding constraint on accelerator shipments"
summary: "One line in plain words."
confidence: 70
resolves: 2027-12-31
result: open                      # open | correct | wrong
falsified_by: "What would prove it wrong."
source: "The public source that settles it."
essay: advanced-packaging         # the post it came from (file name part)
tags: [semiconductors]
---
```

When it resolves, change `result:` and add `resolved_on:` and `resolution:`. Never change the claim.

## Request for Startups (RFS) post

RFS has its own look: numbered cards (RFS 01, 02 …, in publishing order) and a structured brief page.

```markdown
---
title: "Software that shortens the grid interconnection queue"
summary: "One or two sentences shown on the card and under the title."
status: open                      # open | building
problem: "What is broken today."
why_now: "What changed that makes it solvable."
first_version: "The smallest thing worth building first."
who: "The skills the founding team needs."
evidence: [interconnection-queue] # file-name parts of the Analysis/Research/Prediction it came from
questions:
  - "Something you are still unsure about."
tags: [energy, grid]
---

Optional longer explanation in Markdown.
```

## How the site is built

- `.github/workflows/jekyll.yml` builds and deploys on every push to `main` (about 1–2 minutes).
  In the repo: Settings → Pages → Source must be **GitHub Actions**.
- `_plugins/section_pager.rb` makes the page 2, 3 … of each log.
- `search.json` is the list the header search looks through.

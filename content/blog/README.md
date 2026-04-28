# Blog content

Markdown pieces published in the **Aesthetics Unlocked Journal** — three
a week on Sunday, Tuesday, and Thursday, written by the scheduled remote
agent and committed straight to `main`. Vercel auto-deploys.

## Filename

`YYYY-MM-DD-slug.md`. The leading date drives ordering and is stripped
from the URL by `lib/blog.ts`. URL is `/blog/<slug>`.

## Frontmatter shape

```yaml
---
title: "The headline"
slug: "optional-override-otherwise-derived-from-filename"
date: "2026-04-29"
excerpt: "One sentence shown on the index and in OG cards."
topic: "ingredient-science" # ingredient-science | treatments | regulation | studies | myths | other
sources:
  - title: "Article or statement title"
    url: "https://example.org/..."
    publisher: "JAAD"
  - title: "Second corroborating source"
    url: "https://example.org/..."
    publisher: "AAD"
author: "Bernadette Tobin RN, MSc" # optional, this is the default
---
```

## Body

GitHub-flavoured markdown. Render path is `remark` + `remark-gfm` +
`remark-html`. No raw HTML needed in posts — headings, lists, links,
tables, blockquotes all work.

**Voice rule:** Aesthetics Unlocked marketing voice. Calm, direct, short sentence pairs.
First person from Bernadette. No hype, no "miracle", no consumer advice
("you should…"). Cite a source for every factual claim — minimum two
agreeing sources before a claim ships.

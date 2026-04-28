# Authoring a course

This folder is the **single source of truth for course content** rendered by the members-area lesson player at `/members/courses/<slug>/<lesson-slug>`. Every course is one folder; every lesson is one markdown file. Add a folder, add the markdown, the rest of the system picks it up.

---

## Folder structure

```
content/courses/
└── <course-slug>/
    ├── course.json                 ← editorial Part dividers
    ├── 01-<lesson-slug>.md         ← lesson 1
    ├── 02-<lesson-slug>.md         ← lesson 2
    └── …
```

The `NN-` prefix on each lesson file controls the order they're loaded; the `order` field in frontmatter must match.

---

## Adding a new course — the workflow

1. **Add the catalog entry** in `lib/courses.ts` — slug, title, summary, modules, price, etc. Set `kartraMembershipName` to the exact string Kartra returns in `lead.memberships[].membership_name` (this is how the launchpad knows the member owns this course).
2. **Create the folder** `content/courses/<slug>/`.
3. **Create `course.json`** with the Part dividers (see template below). Optional — leave the `parts` array empty to render the chapter ledger as a flat list.
4. **Create one markdown file per lesson** — `01-introduction.md`, `02-…`, etc. Frontmatter reference below.
5. **Done.** No code changes needed. The lesson player route auto-discovers the new course; pre-renders happen at build time.

---

## `course.json`

```json
{
  "parts": [
    {
      "eyebrow": "Part 01",
      "title": "Foundations",
      "body": "What this arc covers — one sentence.",
      "startOrder": 1
    },
    {
      "eyebrow": "Part 02",
      "title": "Practice",
      "body": "What this arc covers — one sentence.",
      "startOrder": 5
    }
  ]
}
```

`startOrder` must match the `order` field of the first lesson in that arc. The chapter ledger renders a charcoal poster band before that lesson.

---

## Lesson frontmatter

```yaml
---
title: "What is Acne?"            # shown in the player chrome
order: 2                          # 1-based; matches the NN- filename prefix
icon: lens                        # picks a glyph from the icon library (below)
duration: "9 min"                 # short read-time hint
summary: "One sentence describing what this chapter covers."
isCertificate: true               # optional; mark the final chapter as the certificate step
---
```

All fields are optional except `title`, `order`, and `summary`. Unknown `icon` values fall back to a generic numbered circle.

---

## Icon catalog

Pick the glyph that best fits the chapter subject. All icons share the same pink-stroke line-drawn vocabulary so the player stays visually coherent.

| Name              | When to use                                                         |
| ----------------- | ------------------------------------------------------------------- |
| `doorway`         | Introductions, "open" / "begin" chapters                            |
| `lens`            | Definitions, examination, deep-dives                                |
| `cross-section`   | Anatomy, structure, layered breakdowns                              |
| `branching`       | Causes, drivers, factor lists                                       |
| `warning`         | Risks, complications, pitfalls                                      |
| `clipboard`       | Assessments, checklists, evaluation workflows                       |
| `signpost`        | Treatments, decision trees, choosing a pathway                      |
| `people`          | Case studies, client examples, two-person scenarios                 |
| `shield`          | Standards, guidance, compliance, NHS/NICE/MHRA references           |
| `document-stack`  | Summaries, recaps, multi-document references                        |
| `medal`           | Certificates, completion, awards                                    |
| `target`          | Goals, objectives, focus chapters                                   |
| `lightbulb`       | Insights, mindset shifts, framework reveals                         |
| `scales`          | Trade-offs, weighing options, ethics                                |
| `chart`           | Growth, metrics, results, financial concepts                        |
| `circle`          | Fallback / generic chapter (no specific theme)                      |

To add a new glyph: edit `components/members/LessonIcon.tsx` and add it to the `ICONS` map.

---

## Body markdown — what gets transformed

The lesson body is plain markdown (GFM tables and lists supported). Three patterns get **automatically promoted** to editorial elements:

### 1. Section headings → charcoal "Section" poster bands

Every `## Heading` becomes a full-width charcoal band with a pink "SECTION 0N" eyebrow + Montserrat Black title. Numbered headings (`## 1. Foo`) keep their explicit number; un-numbered ones auto-number in document order. The ids on these bands drive the desktop "On this chapter" right rail.

### 2. Numbered sub-headings → step pills

`### 1. Foo` and `**1. Foo**` become a charcoal step pill + bold title. Use these for ordered sequences (e.g. "1. Confirm diagnosis · 2. Identify lesion type · …").

### 3. Bold-prefixed paragraphs → callout boxes

Any paragraph starting with one of these labels followed by `:` (or sitting alone immediately before a body paragraph) gets lifted into a pink-soft callout box with a charcoal icon:

| Label                    | Icon              | Use for                                  |
| ------------------------ | ----------------- | ---------------------------------------- |
| `Clinical relevance`     | stethoscope       | Practitioner-facing application notes    |
| `Clinical tip`           | stethoscope       | Bedside / treatment-room shortcuts       |
| `Key point`              | diamond           | Headline takeaways                       |
| `Best practice`          | diamond           | The recommended way                      |
| `Key teaching points`    | diamond           | Multi-bullet teaching summaries          |
| `Important`              | warning triangle  | Anything safety- or scope-critical       |
| `Important clarification`| warning triangle  | Correcting common misconceptions         |
| `NICE emphasis`          | warning triangle  | Direct NICE-guidance flags               |
| `Why this matters`       | warning triangle  | Rationale / consequence framing          |
| `Red flags`              | warning triangle  | Refer-immediately conditions             |
| `Common mistakes`        | warning triangle  | What to avoid                            |
| `Definition`             | open book         | Glossary-style term definitions          |
| `Definition of …`        | open book         | Same, with a fuller phrase               |

Two formats both work:

```markdown
**Clinical relevance:** Hormonal acne often presents on the jawline.
```

```markdown
**Definition**

Acne (medically termed _acne vulgaris_) is …
```

Anything not in the dictionary stays as a regular bold-prefix paragraph.

### 4. Tables — automatic mobile stacking

Standard markdown tables render as editorial tables on tablet/desktop (charcoal header row, pink-tinted zebra rows). On viewports under 640px each row becomes a card with the column header as a pink Oswald eyebrow above each value. No horizontal scroll needed. Just author the table normally; the system injects `data-label` attributes server-side.

---

## What the player adds for free

- **Reading-progress bar** — pink rule fixed to viewport top
- **Sticky chapter pill row** — stays visible as you read
- **Dark lesson hero** — the chapter eyebrow + title + summary + byline + glyph render as a full-bleed charcoal poster (always dark, course-wide). The white body content kicks in below.
- **Chapter dividers (`Part`)** — from `course.json`
- **Section bands inside lessons** — from your `## headings`
- **Pink-soft callout boxes** — from labelled paragraphs
- **Step badges** — from numbered headings
- **Mobile-stacking tables** — from any markdown table
- **Up-next preview card** — at the foot of every lesson
- **Bernadette byline + audio-intro placeholder** — in the lesson hero
- **On-this-page nav** — sticky right rail on desktop ≥ 1280px when the lesson has 4+ sections
- **Keyboard nav** — `← →` between lessons, `M` to mark complete
- **Progress tracking** — localStorage at v1; will move to Supabase when auth lands

### Tonal map of a lesson page

```
[ charcoal · chapter title band                 ]   ← course chrome
[ white    · sticky chapter pill row            ]   ← navigation
[ charcoal · lesson hero (eyebrow/title/summary)]   ← lesson chrome
[ white    · audio intro pill                   ]
[ charcoal · video placeholder                  ]
[ white    · lesson body (pink-soft callouts,
             charcoal section bands inside)     ]
[ white    · up-next preview                    ]
[ white    · prev / mark complete / next        ]
```

The lesson body still has charcoal **section bands** inside it — those are the `## heading` transforms — so the dark/light rhythm continues all the way down.

---

## What it doesn't do (yet)

- **Video** — `VideoPlaceholder` shows a charcoal frame with a chapter tag. Real video lands when Mux is wired (frontmatter will gain `mux: <playback-id>`).
- **Audio intro** — pill is a "Coming soon" placeholder. When Bernadette's m4a files are uploaded, frontmatter will gain `audio: "intro.m4a"` and the pill becomes a real player.
- **Auth / paywall** — currently the entire `/members/*` area runs against `MOCK_LEAD` with no session check. Don't ship real customers until Supabase Auth + the Kartra IPN webhook are wired.

---

## Quick-start template — new course

```bash
mkdir -p content/courses/my-new-course
```

`content/courses/my-new-course/course.json`:
```json
{
  "parts": [
    { "eyebrow": "Part 01", "title": "Foundations", "startOrder": 1 }
  ]
}
```

`content/courses/my-new-course/01-welcome.md`:
```markdown
---
title: "Welcome"
order: 1
icon: doorway
duration: "3 min"
summary: "What this course will give you and how to get the most from it."
---

Body content here. Use `## Foo` for major sections, `**Key point:**` for callouts, standard markdown tables for tabular data.
```

Then add a `Course` entry to `lib/courses.ts` with `slug: "my-new-course"` + `kartraMembershipName: "<exact name from Kartra>"`. That's it.

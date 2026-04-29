---
name: au-course-illustrations
description: Generate brand-consistent educational illustrations (SVG diagrams) for Aesthetics Unlocked course lessons and insert them at the right teaching moments in the lesson markdown. Use this skill whenever the user asks to "illustrate the course content", "add diagrams to a lesson", "draw the framework", "visualise the 4 mechanisms", "illustrate the pilosebaceous unit", or any request to add educational visuals supporting the teaching inside `content/courses/<slug>/<lesson>.md`. Replicates the illustration-supported teaching style Bernadette had inside Kartra. Outputs SVG files into `public/illustrations/<course>/<lesson>/` and inserts `![alt](/illustrations/...)` references at the right line in the lesson body.
---

# AU Course Illustrations — skill

Generate **brand-consistent educational illustrations** for Aesthetics Unlocked course lessons.

The point of this skill is to recreate the illustration-supported teaching that Bernadette had inside Kartra — anatomical cross-sections, process diagrams, framework graphics, comparison panels — without drifting from the AU brand or producing generic AI-image clipart.

**Default output: SVG.** Anatomical diagrams, frameworks, decision trees, comparisons, severity scales — all of these live inside the AU brand far better as SVG than as AI-generated rasters. SVG is on-palette, infinitely scalable, version-control-friendly, and edits are surgical. Reach for AI image generation only for atmospheric / conceptual moments where SVG would feel too clinical.

---

## When to use this skill

The user asks to:

- Add illustrations / diagrams to a lesson
- Visualise a framework, process, or model from a course
- Draw an anatomical structure or clinical concept
- Add educational visuals to support teaching
- Recreate the Kartra illustration style for a course
- "Illustrate the four mechanisms of acne", "draw the Three E's", "show the pilosebaceous unit", "visualise the Traffic Light System", etc.

If the user just asks to add *one* image to a marketing page (not a course lesson), use the existing image-gen skills (`taste-imagegen-web`, `taste-brandkit`) instead — this skill is specifically for teaching diagrams inside the lesson player.

---

## AU brand specs (NON-NEGOTIABLE)

Every illustration produced by this skill MUST follow these rules:

### Palette

| Role | Value |
|------|-------|
| Charcoal (lines, type) | `#212121` |
| Pink (accent / focal) | `#e697b7` |
| White (canvas) | `#ffffff` |
| Cream (alt canvas) | `#f5f1ec` |
| Pink-soft (fills) | `#f5d5e1` |
| Charcoal-soft (fills) | `#e8e8e8` |

**No other colours.** No gradients. No drop shadows. No glows. No 3D effects.

### Typography (in SVG `<text>`)

- Display labels: `font-family: 'Montserrat', system-ui, sans-serif; font-weight: 700;`
- Body labels: `font-family: 'Lato', system-ui, sans-serif; font-weight: 400;`
- All UPPERCASE labels: `letter-spacing: 0.18em;`

### Geometry

- Stroke weight: **2px** (consistent across the whole illustration)
- Corners: `rounded-[5px]` max, **never `rounded-full`** (per AU memory file `feedback_no_rounded_corners.md`)
- Spacing: generous — never crowded
- Line caps: `stroke-linecap="round"` for organic shapes (anatomy), `square` for diagrams
- Default canvas: `viewBox="0 0 800 600"` (3:2 aspect)
- Square illustrations: `viewBox="0 0 600 600"`

### Style

- Editorial / clinical-poster aesthetic. Think *The New England Journal of Medicine* meets a luxury fashion brand.
- Clean linework, no fills unless purposeful
- Pink used sparingly as a **focal accent** — never as a background
- Charcoal carries 90% of the visual weight; pink is the highlight
- Captions sit BELOW the illustration in the lesson markdown, not inside the SVG

---

## Workflow

When the user asks to illustrate a lesson, follow these steps EXACTLY in order.

### Step 1 — Read the lesson

Read the target lesson markdown file in `content/courses/<course>/<lesson>.md`.

### Step 2 — Identify illustration-worthy moments

Scan for these patterns. Each one is a candidate for an illustration:

| Pattern in markdown | Illustration type to generate |
|---|---|
| Numbered list of mechanisms / drivers / pillars / steps | **Process flow** OR **framework** |
| Anatomical reference (e.g. "pilosebaceous unit", "stratum corneum", "vascular network") | **Anatomical cross-section** |
| Severity scale (mild / moderate / severe) | **Severity scale** |
| Two things compared in prose or a table (e.g. "AHAs vs BHAs") | **Comparison panel** |
| Treatment / decision pathway with branches | **Decision tree** |
| Named framework (e.g. "Three E's", "UNLOCK PROFIT", "RAG Traffic Light") | **Framework graphic** |
| Stages of a journey / lifecycle | **Journey diagram** |

**Ignore** body paragraphs, bullet lists of generic recommendations, FAQs, and anything that doesn't have a visual structure underneath it.

**Aim for 2–4 illustrations per lesson, max.** Over-illustrating dilutes impact. Pick the highest-density teaching moments.

### Step 3 — Choose the right type for each

Use the [Illustration types catalogue](#illustration-types-catalogue) below. Each type has a template and example.

### Step 4 — Generate the SVG

Write the SVG file directly using the `Write` tool. Save to:

```
public/illustrations/<course-slug>/<lesson-slug>/<NN>-<concept-slug>.svg
```

Example:
```
public/illustrations/acne-decoded/02-what-is-acne/01-pilosebaceous-unit.svg
public/illustrations/acne-decoded/02-what-is-acne/02-four-mechanisms.svg
```

Always include in the SVG:
- A `<title>` element (for accessibility — screen readers use this)
- A `<desc>` element (longer accessibility description)
- Inline styles only (no external CSS — these need to render in isolation)
- The brand palette only

### Step 5 — Insert the image into the lesson

Edit the lesson markdown to insert image references at the right point. Pattern:

```markdown
![Caption describing the illustration](/illustrations/<course>/<lesson>/<file>.svg)
```

Insert each image **immediately after the introductory paragraph** of the section it illustrates — not at the start, not at the end. The reader should encounter the illustration just as they're forming the mental model.

Example insertion point:

```markdown
## The four mechanisms underneath every breakout

Every active acne lesion is the visible end of four interlocking processes happening underneath the skin.

![The four interlocking mechanisms of acne formation, from sebum overproduction through to the inflammatory response.](/illustrations/acne-decoded/02-what-is-acne/02-four-mechanisms.svg)

### 1. Excess sebum production
...
```

### Step 6 — Report back

After all illustrations are generated and inserted, report:

- Lesson file edited
- N illustrations added (with path + concept for each)
- Recommendation for the next lesson, if obvious

---

## Illustration types catalogue

Each type below has a **structural template** and an **example SVG** sized for a typical lesson (`800×600`). Adapt the structure to the specific lesson concept; keep the visual rules constant.

---

### 1. Anatomical cross-section

**When to use:** Skin biology, pilosebaceous unit, vascular network, immune cell behaviour, follicular structure.

**Structure:**
- Layered horizontal bands (epidermis / dermis / subcutis) with clear boundary lines
- Labelled features with thin leader lines connecting label → feature
- Feature of interest highlighted in pink; surrounding anatomy in charcoal stroke
- Labels positioned outside the anatomy on either side, NEVER overlapping the structure

**Example — pilosebaceous unit:**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-labelledby="title desc">
  <title id="title">The pilosebaceous unit</title>
  <desc id="desc">Cross-section of skin showing the hair follicle, sebaceous gland, and follicular canal — the functional unit where acne forms.</desc>

  <!-- Skin layers -->
  <rect x="40" y="80" width="720" height="80" fill="#f5f1ec" stroke="#212121" stroke-width="2"/>
  <rect x="40" y="160" width="720" height="220" fill="#ffffff" stroke="#212121" stroke-width="2"/>
  <rect x="40" y="380" width="720" height="140" fill="#e8e8e8" stroke="#212121" stroke-width="2"/>

  <!-- Layer labels -->
  <text x="60" y="120" font-family="Montserrat, sans-serif" font-weight="700" font-size="11" letter-spacing="2.4" fill="#212121">EPIDERMIS</text>
  <text x="60" y="280" font-family="Montserrat, sans-serif" font-weight="700" font-size="11" letter-spacing="2.4" fill="#212121">DERMIS</text>
  <text x="60" y="460" font-family="Montserrat, sans-serif" font-weight="700" font-size="11" letter-spacing="2.4" fill="#212121">SUBCUTIS</text>

  <!-- Hair follicle -->
  <path d="M 400 80 L 400 380" stroke="#212121" stroke-width="2" fill="none"/>
  <ellipse cx="400" cy="380" rx="20" ry="14" fill="#ffffff" stroke="#212121" stroke-width="2"/>

  <!-- Sebaceous gland (pink — focus) -->
  <path d="M 360 240 Q 340 220 360 200 Q 380 195 400 210 Q 420 195 440 200 Q 460 220 440 240 Z"
        fill="#e697b7" stroke="#212121" stroke-width="2"/>

  <!-- Connecting duct -->
  <path d="M 400 240 L 400 80" stroke="#e697b7" stroke-width="3"/>

  <!-- Hair shaft -->
  <line x1="400" y1="80" x2="400" y2="50" stroke="#212121" stroke-width="2"/>

  <!-- Labels with leader lines -->
  <line x1="540" y1="220" x2="450" y2="215" stroke="#212121" stroke-width="1"/>
  <text x="550" y="225" font-family="Lato, sans-serif" font-size="13" fill="#212121">Sebaceous gland</text>

  <line x1="540" y1="160" x2="410" y2="160" stroke="#212121" stroke-width="1"/>
  <text x="550" y="165" font-family="Lato, sans-serif" font-size="13" fill="#212121">Follicular canal</text>

  <line x1="260" y1="380" x2="380" y2="380" stroke="#212121" stroke-width="1"/>
  <text x="120" y="385" font-family="Lato, sans-serif" font-size="13" fill="#212121">Hair follicle base</text>
</svg>
```

---

### 2. Process flow

**When to use:** Numbered mechanisms, sequenced steps, cause-and-effect chains. The acne-decoded "four mechanisms" is the canonical example.

**Structure:**
- Horizontal row (or 2x2 grid) of numbered cards
- Each card: number (large pink), title (charcoal display), 1-line description (lato body)
- Optional connecting arrows for sequential processes (omit if mechanisms are simultaneous, like the four acne drivers)
- Equal spacing, equal sizing — visual rhythm matters

**Example — four mechanisms of acne (2×2 grid, no arrows because simultaneous):**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-labelledby="title desc">
  <title id="title">The four mechanisms of acne formation</title>
  <desc id="desc">The four interlocking biological processes that drive every active acne lesion: sebum overproduction, follicular hyperkeratinisation, C. acnes imbalance, and inflammatory response.</desc>

  <!-- Card 1: Sebum -->
  <rect x="40" y="60" width="340" height="220" fill="#ffffff" stroke="#212121" stroke-width="2" rx="5"/>
  <text x="60" y="110" font-family="Montserrat, sans-serif" font-weight="900" font-size="64" fill="#e697b7">1</text>
  <text x="60" y="170" font-family="Montserrat, sans-serif" font-weight="800" font-size="20" fill="#212121">Excess sebum</text>
  <text x="60" y="220" font-family="Lato, sans-serif" font-size="14" fill="#212121">Androgens stimulate</text>
  <text x="60" y="240" font-family="Lato, sans-serif" font-size="14" fill="#212121">sebaceous overproduction.</text>

  <!-- Card 2: Hyperkeratinisation -->
  <rect x="420" y="60" width="340" height="220" fill="#ffffff" stroke="#212121" stroke-width="2" rx="5"/>
  <text x="440" y="110" font-family="Montserrat, sans-serif" font-weight="900" font-size="64" fill="#e697b7">2</text>
  <text x="440" y="170" font-family="Montserrat, sans-serif" font-weight="800" font-size="20" fill="#212121">Hyperkeratinisation</text>
  <text x="440" y="220" font-family="Lato, sans-serif" font-size="14" fill="#212121">Dead keratinocytes plug</text>
  <text x="440" y="240" font-family="Lato, sans-serif" font-size="14" fill="#212121">the follicle (microcomedone).</text>

  <!-- Card 3: C. acnes -->
  <rect x="40" y="320" width="340" height="220" fill="#ffffff" stroke="#212121" stroke-width="2" rx="5"/>
  <text x="60" y="370" font-family="Montserrat, sans-serif" font-weight="900" font-size="64" fill="#e697b7">3</text>
  <text x="60" y="430" font-family="Montserrat, sans-serif" font-weight="800" font-size="20" fill="#212121">C. acnes imbalance</text>
  <text x="60" y="480" font-family="Lato, sans-serif" font-size="14" fill="#212121">Anaerobic environment</text>
  <text x="60" y="500" font-family="Lato, sans-serif" font-size="14" fill="#212121">lets the bacterium proliferate.</text>

  <!-- Card 4: Inflammation -->
  <rect x="420" y="320" width="340" height="220" fill="#ffffff" stroke="#212121" stroke-width="2" rx="5"/>
  <text x="440" y="370" font-family="Montserrat, sans-serif" font-weight="900" font-size="64" fill="#e697b7">4</text>
  <text x="440" y="430" font-family="Montserrat, sans-serif" font-weight="800" font-size="20" fill="#212121">Inflammation</text>
  <text x="440" y="480" font-family="Lato, sans-serif" font-size="14" fill="#212121">Immune response produces</text>
  <text x="440" y="500" font-family="Lato, sans-serif" font-size="14" fill="#212121">papules, pustules, and PIH.</text>
</svg>
```

---

### 3. Framework graphic

**When to use:** Named conceptual structures the lesson teaches as a single unit. UNLOCK PROFIT, the Three E's, the RAG Traffic Light, the Three Pillars of the Clinical Core, etc.

**Structure varies by framework, but always includes:**
- Framework name as the anchor (top centre, large display type)
- Component parts arranged according to the framework's geometry (pillars / triangle / wheel / pyramid / radial)
- Each part labelled with its name + 1-line description
- Pink reserved for the framework anchor; components in charcoal

**Example — Three E's of niche (Expertise / Excitement / Economics):**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-labelledby="title desc">
  <title id="title">The Three E's framework</title>
  <desc id="desc">Niche clarity sits at the intersection of expertise, excitement, and economics.</desc>

  <!-- Anchor label -->
  <text x="400" y="60" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="900" font-size="14" letter-spacing="3" fill="#e697b7">THE THREE E'S</text>
  <text x="400" y="100" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="800" font-size="28" fill="#212121">Where your niche lives</text>

  <!-- Three circles (Venn) -->
  <circle cx="320" cy="320" r="140" fill="none" stroke="#212121" stroke-width="2"/>
  <circle cx="480" cy="320" r="140" fill="none" stroke="#212121" stroke-width="2"/>
  <circle cx="400" cy="450" r="140" fill="none" stroke="#212121" stroke-width="2"/>

  <!-- Pink overlap (the niche) -->
  <circle cx="400" cy="370" r="40" fill="#e697b7" opacity="0.5"/>
  <text x="400" y="378" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="800" font-size="13" letter-spacing="1.5" fill="#212121">NICHE</text>

  <!-- Labels -->
  <text x="220" y="220" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="800" font-size="18" fill="#212121">Expertise</text>
  <text x="220" y="240" text-anchor="middle" font-family="Lato, sans-serif" font-size="12" fill="#212121">what you do best</text>

  <text x="580" y="220" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="800" font-size="18" fill="#212121">Excitement</text>
  <text x="580" y="240" text-anchor="middle" font-family="Lato, sans-serif" font-size="12" fill="#212121">what lights you up</text>

  <text x="400" y="570" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="800" font-size="18" fill="#212121">Economics</text>
  <text x="400" y="590" text-anchor="middle" font-family="Lato, sans-serif" font-size="12" fill="#212121">what pays you well</text>
</svg>
```

---

### 4. Comparison panel

**When to use:** Two things contrasted in prose or a markdown table (AHAs vs BHAs, mild vs severe, before vs after, ETR vs PPR, etc.).

**Structure:**
- Two equal columns separated by a thin charcoal vertical rule
- Header per column (Montserrat, uppercase, with letter-spacing)
- Bullet points (Lato, body weight) — 3–5 per side max
- Pink accent on a single distinguishing word per side (the differentiator)

**Example — AHAs vs BHAs:**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-labelledby="title desc">
  <title id="title">AHAs vs BHAs comparison</title>
  <desc id="desc">Side-by-side comparison of alpha hydroxy acids and beta hydroxy acids: solubility, target site, primary benefit, and best use.</desc>

  <!-- Title -->
  <text x="400" y="60" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="800" font-size="22" fill="#212121">Choosing the right exfoliant</text>

  <!-- Vertical divider -->
  <line x1="400" y1="100" x2="400" y2="540" stroke="#212121" stroke-width="2"/>

  <!-- LEFT — AHAs -->
  <text x="60" y="140" font-family="Montserrat, sans-serif" font-weight="900" font-size="14" letter-spacing="3" fill="#e697b7">AHAS</text>
  <text x="60" y="170" font-family="Montserrat, sans-serif" font-weight="800" font-size="20" fill="#212121">Surface exfoliation</text>

  <text x="60" y="230" font-family="Lato, sans-serif" font-weight="700" font-size="13" fill="#212121">Solubility</text>
  <text x="60" y="252" font-family="Lato, sans-serif" font-size="13" fill="#212121">Water-soluble</text>

  <text x="60" y="290" font-family="Lato, sans-serif" font-weight="700" font-size="13" fill="#212121">Target</text>
  <text x="60" y="312" font-family="Lato, sans-serif" font-size="13" fill="#212121">Skin surface</text>

  <text x="60" y="350" font-family="Lato, sans-serif" font-weight="700" font-size="13" fill="#212121">Best for</text>
  <text x="60" y="372" font-family="Lato, sans-serif" font-size="13" fill="#212121">Texture, pigmentation</text>

  <!-- RIGHT — BHAs -->
  <text x="440" y="140" font-family="Montserrat, sans-serif" font-weight="900" font-size="14" letter-spacing="3" fill="#e697b7">BHAS</text>
  <text x="440" y="170" font-family="Montserrat, sans-serif" font-weight="800" font-size="20" fill="#212121">Pore clearing</text>

  <text x="440" y="230" font-family="Lato, sans-serif" font-weight="700" font-size="13" fill="#212121">Solubility</text>
  <text x="440" y="252" font-family="Lato, sans-serif" font-size="13" fill="#212121">Oil-soluble</text>

  <text x="440" y="290" font-family="Lato, sans-serif" font-weight="700" font-size="13" fill="#212121">Target</text>
  <text x="440" y="312" font-family="Lato, sans-serif" font-size="13" fill="#212121">Inside the pore</text>

  <text x="440" y="350" font-family="Lato, sans-serif" font-weight="700" font-size="13" fill="#212121">Best for</text>
  <text x="440" y="372" font-family="Lato, sans-serif" font-size="13" fill="#212121">Congestion, inflammatory acne</text>
</svg>
```

---

### 5. Decision tree

**When to use:** Treatment pathway, refer-or-treat decisions, clinical algorithm.

**Structure:**
- Top: the question/condition being evaluated
- Branches: rectangular nodes for outcomes
- Connecting lines orthogonal (no diagonals — clinical-poster aesthetic)
- Pink reserved for the **escalation** branch (refer to specialist) — visually flags the safety-critical path
- Maximum 3 levels of depth — beyond that, split into two illustrations

**Example — acne severity → pathway:**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-labelledby="title desc">
  <title id="title">Acne severity decision pathway</title>
  <desc id="desc">NICE-aligned decision tree: assess severity, choose between in-clinic management, GP-prescribed topical pathway, or dermatology referral.</desc>

  <!-- Root -->
  <rect x="280" y="40" width="240" height="60" fill="#212121" rx="5"/>
  <text x="400" y="78" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="800" font-size="14" fill="#ffffff">Assess severity</text>

  <!-- Lines down -->
  <line x1="400" y1="100" x2="400" y2="140" stroke="#212121" stroke-width="2"/>
  <line x1="160" y1="140" x2="640" y2="140" stroke="#212121" stroke-width="2"/>
  <line x1="160" y1="140" x2="160" y2="180" stroke="#212121" stroke-width="2"/>
  <line x1="400" y1="140" x2="400" y2="180" stroke="#212121" stroke-width="2"/>
  <line x1="640" y1="140" x2="640" y2="180" stroke="#212121" stroke-width="2"/>

  <!-- Mild -->
  <rect x="60" y="180" width="200" height="80" fill="#ffffff" stroke="#212121" stroke-width="2" rx="5"/>
  <text x="160" y="215" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="800" font-size="14" fill="#212121">Mild</text>
  <text x="160" y="240" text-anchor="middle" font-family="Lato, sans-serif" font-size="12" fill="#212121">In-clinic + home care</text>

  <!-- Moderate -->
  <rect x="300" y="180" width="200" height="80" fill="#ffffff" stroke="#212121" stroke-width="2" rx="5"/>
  <text x="400" y="215" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="800" font-size="14" fill="#212121">Moderate</text>
  <text x="400" y="240" text-anchor="middle" font-family="Lato, sans-serif" font-size="12" fill="#212121">GP topical + monitoring</text>

  <!-- Severe (pink — escalation) -->
  <rect x="540" y="180" width="200" height="80" fill="#e697b7" stroke="#212121" stroke-width="2" rx="5"/>
  <text x="640" y="215" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="800" font-size="14" fill="#212121">Severe / scarring</text>
  <text x="640" y="240" text-anchor="middle" font-family="Lato, sans-serif" font-size="12" fill="#212121">Refer to dermatology</text>

  <!-- Footer note -->
  <text x="400" y="540" text-anchor="middle" font-family="Lato, sans-serif" font-size="12" fill="#212121" font-style="italic">Refer at any severity if scarring risk, psychological impact, or treatment failure.</text>
</svg>
```

---

### 6. Severity scale / Traffic Light

**When to use:** Graduated states (mild/moderate/severe), risk levels, the RAG Traffic Light System.

**Structure:**
- Horizontal bar split into N equal segments (3 for mild/moderate/severe; 3 for RAG)
- Each segment labelled below
- For severity scales: charcoal gradient from light to dark
- For RAG: charcoal segment for Green-band, charcoal-soft for Amber, **pink for Red** (only place pink represents danger in the AU palette)

**Example — RAG Traffic Light (uses charcoal/cream/pink in non-traditional way to stay on-palette):**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" role="img" aria-labelledby="title desc">
  <title id="title">The Traffic Light System (RAG)</title>
  <desc id="desc">Risk classification framework: Green is best practice, Amber requires evidence, Red is active risk to licence, insurance, or reputation.</desc>

  <!-- Title -->
  <text x="400" y="60" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="900" font-size="14" letter-spacing="3" fill="#212121">THE TRAFFIC LIGHT SYSTEM</text>

  <!-- Three segments -->
  <rect x="60" y="120" width="220" height="100" fill="#ffffff" stroke="#212121" stroke-width="2" rx="5"/>
  <text x="170" y="160" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="900" font-size="20" fill="#212121">GREEN</text>
  <text x="170" y="190" text-anchor="middle" font-family="Lato, sans-serif" font-size="13" fill="#212121">Best practice</text>

  <rect x="290" y="120" width="220" height="100" fill="#f5f1ec" stroke="#212121" stroke-width="2" rx="5"/>
  <text x="400" y="160" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="900" font-size="20" fill="#212121">AMBER</text>
  <text x="400" y="190" text-anchor="middle" font-family="Lato, sans-serif" font-size="13" fill="#212121">Requires evidence</text>

  <rect x="520" y="120" width="220" height="100" fill="#e697b7" stroke="#212121" stroke-width="2" rx="5"/>
  <text x="630" y="160" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="900" font-size="20" fill="#212121">RED</text>
  <text x="630" y="190" text-anchor="middle" font-family="Lato, sans-serif" font-size="13" fill="#212121">Active risk</text>

  <!-- Bottom labels: examples -->
  <text x="170" y="270" text-anchor="middle" font-family="Lato, sans-serif" font-style="italic" font-size="12" fill="#212121">Documented, defensible</text>
  <text x="400" y="270" text-anchor="middle" font-family="Lato, sans-serif" font-style="italic" font-size="12" fill="#212121">Defensible only on paper</text>
  <text x="630" y="270" text-anchor="middle" font-family="Lato, sans-serif" font-style="italic" font-size="12" fill="#212121">Stop, correct, escalate</text>

  <!-- Reading direction arrow -->
  <text x="400" y="340" text-anchor="middle" font-family="Lato, sans-serif" font-size="13" fill="#212121">If you cannot justify it on paper, you cannot defend it in practice.</text>
</svg>
```

---

### 7. Journey diagram

**When to use:** Lifecycle, treatment plan over time, client journey through clinic, course pathway.

**Structure:**
- Horizontal timeline anchored by an arrow
- Numbered milestones on the line
- Brief label above or below each milestone
- Pink accent on the **endpoint** (the desired outcome)

**Example — 12-week treatment plan:**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" role="img" aria-labelledby="title desc">
  <title id="title">12-week treatment plan</title>
  <desc id="desc">Phased treatment: assessment, induction, maintenance, review at week 12 to assess response.</desc>

  <text x="400" y="60" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="900" font-size="14" letter-spacing="3" fill="#212121">12-WEEK TREATMENT PLAN</text>

  <!-- Timeline -->
  <line x1="80" y1="200" x2="700" y2="200" stroke="#212121" stroke-width="2"/>
  <polygon points="700,200 720,205 700,210" fill="#212121"/>

  <!-- Milestone 1 -->
  <circle cx="120" cy="200" r="14" fill="#ffffff" stroke="#212121" stroke-width="2"/>
  <text x="120" y="206" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="800" font-size="13" fill="#212121">1</text>
  <text x="120" y="160" text-anchor="middle" font-family="Lato, sans-serif" font-weight="700" font-size="12" fill="#212121">Week 0</text>
  <text x="120" y="240" text-anchor="middle" font-family="Lato, sans-serif" font-size="11" fill="#212121">Assessment</text>

  <!-- Milestone 2 -->
  <circle cx="280" cy="200" r="14" fill="#ffffff" stroke="#212121" stroke-width="2"/>
  <text x="280" y="206" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="800" font-size="13" fill="#212121">2</text>
  <text x="280" y="160" text-anchor="middle" font-family="Lato, sans-serif" font-weight="700" font-size="12" fill="#212121">Week 2</text>
  <text x="280" y="240" text-anchor="middle" font-family="Lato, sans-serif" font-size="11" fill="#212121">Induction</text>

  <!-- Milestone 3 -->
  <circle cx="450" cy="200" r="14" fill="#ffffff" stroke="#212121" stroke-width="2"/>
  <text x="450" y="206" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="800" font-size="13" fill="#212121">3</text>
  <text x="450" y="160" text-anchor="middle" font-family="Lato, sans-serif" font-weight="700" font-size="12" fill="#212121">Week 6</text>
  <text x="450" y="240" text-anchor="middle" font-family="Lato, sans-serif" font-size="11" fill="#212121">Maintenance</text>

  <!-- Milestone 4 — endpoint, pink -->
  <circle cx="640" cy="200" r="18" fill="#e697b7" stroke="#212121" stroke-width="2"/>
  <text x="640" y="207" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="800" font-size="13" fill="#212121">4</text>
  <text x="640" y="160" text-anchor="middle" font-family="Lato, sans-serif" font-weight="700" font-size="12" fill="#212121">Week 12</text>
  <text x="640" y="240" text-anchor="middle" font-family="Lato, sans-serif" font-size="11" fill="#212121">Review &amp; revise</text>
</svg>
```

---

## Special cases

### When SVG isn't enough — atmospheric / conceptual moments

Some lessons have moments where a clean diagram would feel too clinical — the opening of a free taster, the close of the certificate lesson, an emotional or philosophical paragraph.

For those, **don't generate an SVG**. Instead, generate an image-prompt block in the lesson markdown that the team can feed into their preferred image-gen tool:

```markdown
<!-- AU IMAGE PROMPT — AI generation
prompt: "Editorial photograph of a UK aesthetic clinic — clean, minimalist, soft natural light. Charcoal walls, single pink accent (a vase of peonies). Hands resting on a documentation folder. Shot on medium format, 50mm, depth of field shallow on the folder. No identifiable faces. Mood: calm professional authority."
aspect: 3:2
brand: aesthetics-unlocked
-->
![[generated image goes here once produced — replace this placeholder]](/illustrations/<course>/<lesson>/<NN>-<concept>-placeholder.png)
```

The team owns the actual image generation — this skill just outputs the prompt + placement.

### Re-illustrating an existing lesson

If the lesson already has illustrations (`/illustrations/...` references in the markdown), audit them first:

1. List the existing illustrations
2. Ask the user whether to keep, replace, or augment them
3. Don't silently overwrite — illustrations may have been hand-edited by Bernadette

### Generating across a whole course

If the user asks to illustrate a *whole course* rather than one lesson, work lesson-by-lesson and report progress. Don't try to build a single mega-context — read each lesson, generate, insert, move on. Stop after every 3 lessons and ask if the style is landing before continuing.

---

## Quality bar — what makes it AU vs generic

A good AU illustration is:

- **Recognisable as AU at a glance** — palette + typography do this work alone
- **Pedagogically useful** — actually clarifies the concept, doesn't just decorate
- **Restrained** — never over-illustrated, never busy, never decorative-only
- **Caption-honest** — the caption beneath says what the illustration *teaches*, not just what it shows
- **Accessible** — `<title>` and `<desc>` always present, alt text in markdown always meaningful

A bad AU illustration:

- Uses a colour outside the palette
- Has a drop shadow, gradient, or pill shape
- Crowds labels onto the structure
- Decorates without teaching
- Has a vague caption ("Illustration of acne") instead of a teaching one
- Repeats the lesson body text inside the SVG

---

## Naming convention

Files: `NN-<concept-slug>.svg` where NN is a 2-digit order (01, 02, 03...)

Examples:
- `01-pilosebaceous-unit.svg`
- `02-four-mechanisms.svg`
- `03-severity-scale.svg`

The `concept-slug` is kebab-case, no abbreviations. "pilosebaceous-unit" not "pse-unit".

---

## Final reminder

Never abbreviate **Aesthetics Unlocked** to **AU** in any caption, alt text, or label that ends up in the lesson body. Per `feedback_aesthetics_unlocked_naming.md` in the user's memory file — full name only.

In SVG `<title>` and `<desc>` accessibility nodes, "AU" is fine because those don't render visibly.

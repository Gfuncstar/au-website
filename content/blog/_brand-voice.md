# Brand audit — Aesthetics Unlocked

The visual and verbal identity captured from the live site, ready to drop into the rebuild.

## Colour palette

The active site uses a tight palette. Most of the visual weight is carried by black, charcoal, white, and a single signature pink.

| Role | Value | Notes |
|------|-------|-------|
| **Brand pink (primary)** | `rgb(230, 151, 183)` / `#e697b7` | Used for the AU logo wordmark, hero accent words ("Practitioners", "Injecting", "Business"), highlight strokes, button hovers. The defining brand colour. |
| **Brand pink (alt)** | `rgb(229, 151, 183)` / `#e597b7` | Almost-identical secondary pink — appears once in nav hover. Likely a small CSS inconsistency; standardise on `#e697b7` in the rebuild. |
| **Black (primary background)** | `rgb(0, 0, 0)` / `#000000` | Hero block backgrounds, course tile backgrounds. |
| **Charcoal (page background)** | `rgba(33, 33, 33, 1)` / `#212121` | The site's default page background — slightly softer than pure black. |
| **Body text dark** | `#333` | Used in light/inverted blocks. |
| **White** | `rgb(255, 255, 255)` / `#ffffff` | All copy on dark backgrounds, logo white variant. |
| **White overlay (50%)** | `rgba(255, 255, 255, 0.5)` | Soft watermarks (AU logo behind hero card). |
| **Black overlay (5–50%)** | `rgba(0, 0, 0, 0.05)` → `rgba(0, 0, 0, 0.5)` | Hero background dimming, card glassmorphic shadows. |

**No greens, ambers, or reds in the brand palette** — though the courses describe a "Traffic Light System" (RAG), the live brand visuals don't use those colours. The 🟢 🟠 🔴 emoji are used in copy. For the rebuild, decide whether to introduce traffic-light tints as a visual asset for course pages, or keep relying on the emoji.

## Typography

### Loaded from Google Fonts

The Kartra template loads 9 font families via a single Google Fonts request. Most are not actually used in the rendered styles — they're loaded as a precaution.

```
Roboto, Lato, Raleway, Montserrat, Oswald, Spectral,
Roboto Condensed, Nunito, Open Sans
```

Each is loaded with weights: 300, 300i, 400, 400i, 600, 600i, 700, 700i, 900, 900i.

**For the rebuild, drop the unused families.** Loading 9 families, 10 weights each, hurts performance.

### Actually used in computed styles

| Use | Family | Weights observed |
|-----|--------|------------------|
| **Display / headlines** | `Montserrat` | 400, 700 (bold) |
| **Body & nav** | `Roboto` | 400 |

That's it. The rebuild only needs Montserrat (display) + Roboto (body). Two families is plenty.

### Recommended type scale

The Kartra renders use rem values inline. Reverse-engineered:

| Element | Live size | Notes |
|---------|-----------|-------|
| Hero headline (display) | `3.5rem` Montserrat 700 | "Injecting Strategy Into Business" |
| Section headline (H3) | ~`1.5rem` Montserrat 700 | "Clinical Identity & Brand Authority" |
| Sub-heading | `1rem` Montserrat 700 | "The Platform for Practitioners" |
| Body | `0.8rem` Montserrat 400 | "Aesthetics Unlocked™ is the…" |

The body size of `0.8rem` (~12.8px) is small — accessibility flag. Bump to `1rem` (16px) baseline in the rebuild.

## Logo set

Saved in `assets/logos/`:

| File | Use case | Notes |
|------|----------|-------|
| `aesthetics-unlocked-logo-primary.png` | **Primary mark** — pink "aesthetics" + grey "Unlocked" | The full-colour logo for light backgrounds. |
| `aesthetics-unlocked-logo-pink-on-dark.png` | Pink "aesthetics" + light pink "Unlocked" | Used in the live nav with opacity. |
| `aesthetics-unlocked-logo-white.png` | Solid white logo | For dark backgrounds. |
| `aesthetics-unlocked-logo-white-alt.png` | Solid white logo (variant) | Slightly different aspect; same purpose. |
| `bernadette-signature-black.png` | Bernadette's hand signature in black ink | Used in editorial / quote attribution sections. |
| `bernadette-signature-white.png` | Same signature, white-on-transparent | For dark backgrounds. |

**MISSING — flag for design:**

- **Dedicated black logo variant.** None of the four logo files are pure black. For invoices, monochrome print, single-colour swag, etc., a true black version is needed.
- **Mono / single-colour logos.** Useful for subtle uses.
- **Icon / submark.** The "U" lock-shape inside the logo would work as an app icon / favicon. Currently the favicon on the live site is the generic Kartra favicon (`d2uolguxr56s4e.cloudfront.net/img/shared/favicon.ico`) — the AU brand has no real favicon.
- **SVG versions.** Every logo on the site is PNG. SVG is essential for a clean rebuild.

## Imagery style

A mix of three modes:

1. **Editorial portrait photography of Bernadette** — `1217259960973ber.jpg`, `1369012040JACKET.jpg`, `327311913801TALL.jpg`, `455010146909ber_wide.jpg`, `1012852156413ber3.jpg`. Warm, professional, calm. These are the strongest assets and should anchor the rebuild.

2. **Course content screenshots** — many filenames like `Screenshot_2026-01-XX_at_HH.MM.SS.png`. Used as course tile imagery. These are functional, not beautiful — they make the site look DIY. Flag to replace with branded course mockups for the rebuild.

3. **AI-generated illustrations** — three Gemini-generated images on the 3-day-startup page. Decent placeholders but not aligned with the editorial photography elsewhere. Inconsistent. Flag to replace.

**Award badge:** `28022677334_baa-33-e1733746521924.png` — recurring nomination strip ("BAAPS / Educator of the Year 2026" — verify exact awarding body).

## Tone of voice

The brand operates in **two distinct voices**. Both must be preserved in the rebuild — they do different jobs.

### Voice 1 — Marketing voice (sales pages, broadcasts, social)

Calm. Direct. Short sentence pairs. Confident. No hype.

> 'I'm not teaching theory — i'm teaching lived experience'

> Compliance gets you open. Reputation keeps you in business.

> Aesthetics isn't unregulated. It's misunderstood.

> Most practitioners try the same things that unfortunately never work long-term.

> You don't just learn the system — you learn how to apply it in real life.

> This isn't about doing more. It's about getting clear — first.

> Clear strategy. No fluff. More income — without more hours.

> Bernadette isn't teaching theory she's teaching lived experience.

### Voice 2 — Course-content voice (inside the membership / lessons)

Warmer. Mentor-tutor. Confessional. Reassuring openings that lower the reader's guard. Same authority underneath, but the temperature is different. Use this voice on "Inside the course" page sections, course welcome emails, and lesson previews.

> If you're here, it tells me something important about you already: You don't just want to do aesthetics — you want to do it properly. *(RAG 2-Day welcome)*

> As your mentor on this journey, my role is to help you move beyond confusion and fear around regulation and instead use it as a strategic advantage. *(RAG Pathway welcome)*

> Most new aesthetic practitioners skip this stage. They jump straight into trying to be "everything" — every treatment, every trend, every client. And that's where overwhelm begins. *(3-Day Mini)*

> Most practitioners don't get into trouble for being careless. They get into trouble because the rules were never clearly explained to them. *(RAG 2-Day)*

> This journey is intentionally soft, spacious, and supportive. No pressure. No expectations. Just quiet insights that begin shaping a practitioner identity you can confidently grow into. *(3-Day Mini)*

> You're not here to fit into the industry. You're here to find your place within it. *(3-Day Mini)*

> Profit is a byproduct of clarity, not complexity. *(3-Day Mini)*

The strongest writing on the entire AU platform sits inside the courses, not on the marketing pages. The rebuild should pull these passages onto the public sales pages where they earn their place — see `course-content.md` for the full inventory.

### Voice characteristics

- **Calm and authoritative.** No hype. No "10X your clinic in 30 days" bro-marketing language. The tone earns the price ticket through credentials and clarity, not urgency.
- **Direct, with short, punchy sentence pairs.** "Compliance gets you open. Reputation keeps you in business." Two halves of a thought, separated by a full stop.
- **Frames compliance as opportunity, not threat.** Most regulation copy in the industry leans on fear. AU reframes it as a path to reputation — distinctive.
- **First-person from Bernadette throughout.** "I'm not teaching theory." "I built my clinic and reputation through specialism…" Personal authority, not corporate detachment.
- **Mild typos and small inconsistencies on the live site** ("ARN'T", "Aestetics", "Complia"). Voice is good — execution needs polish.

### Recurring phrases / motifs

- "**Lived experience**" (not theory)
- "**Clarity before confidence**"
- "**Reputation before risk**"
- "**The Traffic Light System / RAG**"
- "**From Regulation to Reputation™**"
- "**The 5K Formula™**"
- "**Unlock**" — used as the activating verb across CTAs ("Unlock your discount", "Unlock your profit", "Unlock free roadmap"). Tied to the brand name.
- "**Educator-led**", "**evidence-based**", "**ethical**"
- "**Without [pressure / overwhelm / chasing clients]**"

### Avoid in rebuild

- "Aestetics" (typo, appears on About page)
- "ARN'T" (should be "AREN'T", appears on RAG Waitlist page)
- "UK Aesthetics Complia" (truncated, should be "UK Aesthetics Compliance")
- HTML entities written as literals in meta descriptions (`&trade;`, `&pound;`)

## Trade marks

Verified live in the Kartra membership content (see `course-content.md`):

- **Aesthetics Unlocked™** — brand wordmark
- **From Regulation to Reputation™** — RAG Pathway product mark
- **The 5K+ Formula™** — flagship paid course mark. Note the **plus sign** — that's the mark inside the membership and the header marquee. The public sales page renders it as "The 5K Formula™" without the plus. **Inconsistent — standardise on `The 5K+ Formula™` everywhere.**
- **The UNLOCK PROFIT™ Framework** — internal name for the underlying methodology of the 5K+ Formula course. Referenced as "Unlock Profit Framework" without ™ on the public site — also needs standardising.
- **The RAG Pathway** — sub-brand, no ™ on most uses
- **Three Pillars of the Clinical Core (Niche)** — visual framework, not formally trademarked but treated as a named system inside the 5K+ Formula course

The ® symbol appears next to "Unlocked" in the logo lockup (`aesthetics-unlocked-logo-primary.png`), implying registered trademark. Verify with Bernadette which marks are TM (unregistered) vs ® (registered) and use the correct symbol consistently in the rebuild.

## Featured-in / social proof badges

- **Cosmopolitan magazine** — primary press feature, used as a "Recently Featured in" trust strip
- **Educator of the Year 2026 — NOMINATED** — used heavily as a credibility band

For the rebuild, capture the source URLs of these features so the rebuild can link out (currently the Cosmopolitan logo is shown but doesn't link to the actual article).

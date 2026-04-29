---
name: au-course-illustrations
description: Generate AI image-generation prompts for Aesthetics Unlocked course lesson illustrations in a dribbble-style multi-colour editorial medical-illustration aesthetic, plus insert image placeholders into the lesson markdown. Use this skill whenever the user asks to "illustrate the course content", "add diagrams to a lesson", "draw the framework", or any other request to add educational visuals to a lesson at `content/courses/<slug>/<lesson>.md`. Replicates the illustrated-object teaching style Bernadette had in Kartra. Output is a `prompts.md` file with one carefully tuned prompt per lesson, plus image placeholders inserted into each lesson markdown so the team can generate the images, drop them into `public/illustrations/<course>/<lesson>/`, and have the lesson player render them automatically.
---

# AU Course Illustrations — skill

Generate **carefully tuned AI image-generation prompts** for Aesthetics Unlocked course lesson illustrations, plus insert PNG/WebP image placeholders into the lesson markdown.

The target aesthetic is **dribbble-quality editorial medical illustration** — recognisable clinical objects (microscope, pill bottle, DNA helix, syringe, magnifying glass, clipboard, document, hand-with-pill) drawn in a friendly multi-colour palette of pink + mint + yellow + deep teal on a warm cream canvas, with chunky charcoal hand-drawn outlines and scattered sparkle accents.

Hand-coded SVG cannot match this aesthetic at production quality. **AI image generation is the right tool** for object-style illustrations. This skill writes the prompts; the user (or a downstream tool) generates the images and drops them into `public/illustrations/<course>/<lesson>/`.

For diagrammatic content (frameworks, decision trees, severity scales, charts, side-by-side comparisons), animated SVG remains the right tool — see `Mode B` below.

---

## When to use this skill

The user asks to:

- Add illustrations / diagrams to a lesson (or a whole course)
- Visualise a clinical concept, framework, process, or comparison
- Add educational visuals to support teaching

If the user wants a single decorative image on a marketing page, use `taste-imagegen-web` instead.

---

## Two modes

### Mode A — Object illustration (default for lessons)

Use this for **definitions, anatomical concepts, processes, mechanisms, treatments, case studies, certifications**. Almost every lesson illustration falls in this mode.

Output: an AI image-generation prompt that the team feeds into Midjourney / DALL-E / Imagen / Recraft / similar. Generated image is saved as `<NN>-<concept>.png` (or `.webp`) in the lesson folder.

### Mode B — Diagrammatic SVG (occasional)

Use this for **frameworks with named parts** (e.g. RAG Traffic Light, Three E's), **severity scales** (mild / moderate / severe), **decision trees**, **comparison panels with structured information**.

Output: hand-coded animated SVG. See "Mode B detail" below.

---

## Mode A — AI image-generation prompts

### The aesthetic anchor

Target visual reference: dribbble-style editorial medical illustration. Hallmarks:

- **Cream off-white background** (`#f5f1ec`)
- **Multi-colour shape blocking**: pink `#e697b7`, mint `#a8d8c0`, yellow `#f5e8a8`, deep teal `#2a4d3e`, cream highlights `#faf6f0`
- **Chunky hand-drawn charcoal outlines** (4–5px equivalent, `#212121`)
- **Soft yellow blob behind the subject** for warmth and depth
- **Scattered sparkle accents** — 4-pointed stars in pink/mint/yellow, small dots, short rays
- **One central recognisable medical/clinical object** (microscope, pill bottle, DNA, etc.) — not abstract
- **Friendly, editorial, slightly playful** — never clinical-grey or austere

### Prompt template

Use this template, swapping in the lesson-specific subject + colour notes:

```
Editorial flat illustration of a {OBJECT}, dribbble-style, hand-drawn vector aesthetic.
Cream off-white background (#f5f1ec). Soft yellow blob behind the subject for warmth.
Multi-colour palette: pink (#e697b7), mint green (#a8d8c0), warm yellow (#f5e8a8),
deep teal (#2a4d3e), cream-light (#faf6f0). The subject is built from solid colour
shape fills with thick charcoal outlines (#212121). The {OBJECT} has:
- {SPECIFIC FEATURE 1 with its colour}
- {SPECIFIC FEATURE 2 with its colour}
- {SPECIFIC FEATURE 3 with its colour}
Scattered around the subject: 4-pointed sparkle stars in pink and mint, a few small
dots in pink and yellow, short charcoal rays suggesting energy, 1-2 hand-drawn
curve doodles. Composition: subject centred, generous breathing room, slight
asymmetry, square 1:1 aspect ratio. Style: friendly, editorial, slightly playful,
medical-themed, clean flat shapes (no gradients, no drop shadows, no glassmorphism).
Reference: dribbble medical-illustration sets by illustrators like Folio Illustration
Agency or Dani Pasquini.
Negative prompt: photorealistic, 3D rendering, gradient, drop shadow, glow effect,
realistic photography, dark mode, sketchy, watercolour, text, labels, logos, watermark.
```

### Object library — per-lesson prompt seeds

| Lesson concept | Subject | Specific features |
|---|---|---|
| **What is acne? / definition** | Magnifying glass over a small skin patch | Pink handle and frame ring, cream-light lens centre with mint-green tint, small pink dots inside the lens (lesions on skin), yellow handle grip |
| **Anatomy / pilosebaceous unit** | Microscope viewing a slide | Deep-teal body, pink eyepiece dome and tube highlight, yellow stage and focus knob, mint slide with pink sample, deep-teal objective lens tip pointing down |
| **Comedogenesis / process** | Three petri dishes in a row OR a test tube rack with three tubes at different fill levels | Mint dish bases, pink contents at different stages (clear → cloudy → plugged), yellow caps |
| **Causes (multi-factorial)** | DNA double helix | Pink left strand, mint right strand, yellow rungs between, deep-teal small dots at base pairs |
| **Hormonal pathway** | Molecule diagram (4–6 connected atoms) OR a single capsule pill | Pink + mint + yellow atom spheres, charcoal bond lines |
| **Risk / complications** | Shield with subtle warning mark | Pink shield body, yellow inner badge, deep-teal exclamation mark or sparkle, mint border |
| **Assessment / how to assess** | Clipboard with checklist + pen | Mint clipboard body, pink clip at top, cream-light paper, charcoal lines for checklist items, yellow ticks, pink pen |
| **Treatment pathways / pills** | Pill bottle with pills around it | Mint bottle body, pink cap, yellow label, pink and cream-light pills (capsule and round) |
| **AHA vs BHA comparison** | Two paired skincare bottles with droppers | One pink bottle, one mint bottle, both with deep-teal droppers and yellow labels |
| **Case studies / two profiles** | Two patient profile cards or framed face silhouettes | Cream-light cards, pink and mint frames, abstract face shapes inside, yellow corner clips |
| **NHS / NICE guidance** | Official document with seal | Cream-light paper, pink ribbon at top, yellow wax seal, charcoal text strokes (illegible) |
| **Certificate / completion** | Ribbon-tied scroll OR medal | Cream-light scroll, pink ribbon, yellow seal OR mint medal body, pink ribbon, deep-teal star centre |

### Output format — `prompts.md` per course

Save a single `prompts.md` file in `public/illustrations/<course-slug>/`:

```markdown
# Illustration prompts — <Course Title>

Generate each image with your preferred AI image-gen tool (Midjourney v6+,
DALL-E 3, Imagen 3, Recraft, etc.). Save the result as `.png` (or `.webp`)
into the matching lesson folder.

Settings:
- Aspect ratio: 1:1
- Style: editorial flat illustration
- Resolution: at least 1024x1024

---

## Lesson <NN> — <Lesson Title>
**File path:** `public/illustrations/<course>/<lesson>/01-<concept>.png`
**Caption (used in lesson markdown):** *<lower-case caption>*

**Prompt:**
> <full prompt text>

---

(repeat for each lesson)
```

### Inserting placeholders into lessons

Even before the images exist, insert placeholder image references into the lesson markdown so the lesson player is ready the moment the team drops files in:

```markdown
![<caption>](/illustrations/<course>/<lesson>/<NN>-<concept>.png)
```

Until the file exists at that path, Next.js will render a 404 for the image — visually, the alt-text appears. That's an acceptable temporary state. The team generates → drops → the image appears.

### Workflow

1. **Read each lesson** in `content/courses/<course>/`.
2. **Choose the object** for each lesson from the table above.
3. **Write a prompt** for each lesson using the template, substituting the specific features.
4. **Save all prompts** to `public/illustrations/<course>/prompts.md`.
5. **Insert image placeholders** into each lesson markdown — at BOTH `au-website/content/courses/<course>/<lesson>.md` AND `clone-aesthetics-unlocked/content/courses/<course>/<lesson>.md`.
6. **Report back**: list every prompt + every lesson edited.

---

## Mode B — Diagrammatic SVG

When the lesson teaches a **structured framework, scale, decision tree, or comparison** that doesn't fit a single object metaphor, hand-coded animated SVG remains the right tool.

### Use Mode B for:

- RAG Traffic Light (3-state scale) — Green / Amber / Red bars
- Three E's framework — Venn-style overlapping circles
- Severity scales — three-step gradient
- Decision trees — branching pathways
- Bar charts / data visualisations
- Side-by-side comparisons with structured rows

### Mode B aesthetic rules

- **Cream `#f5f1ec` background**
- **Pink `#e697b7` as primary structural colour** (not charcoal)
- **Mint `#a8d8c0` and yellow `#f5e8a8`** as secondary accents
- **Charcoal `#212121` only for labels and 1–2 small accents**
- **Stroke width: 3–4px** for primary, 2px for detail
- **No text inside SVG** (mobile-readability) — captions in markdown
- **Square viewBox** (`0 0 600 600`) for mobile responsiveness
- **CSS in CDATA** (`<style><![CDATA[ ... ]]></style>`) to avoid XML parser issues
- **4-stage animation**: structure → detail → focal accent → pulse loop

### Mode B file location

Save as `.svg` (animated) to `public/illustrations/<course>/<lesson>/<NN>-<concept>.svg`. Markdown reference uses standard image syntax — same as Mode A.

---

## Caption rules (both modes)

- Lower-case sentence (no Title Case)
- 1 sentence, 12–28 words
- Describes what the illustration **teaches**
- No "image of…", no "illustration of…"

Examples:

✅ *the science underneath every breakout, brought into focus.*
✅ *seven interlocking causes — hormones drive, six others amplify.*
✅ *NICE-aligned defensible practice, on paper.*

---

## Quality bar

A good Mode A prompt:

- Names a recognisable medical object as the subject
- Specifies the per-feature colour assignments (which part is pink, which is mint, etc.)
- Includes the cream background + yellow blob context
- Names the sparkle / accent decorations
- Gives a strong negative prompt to suppress photorealism / 3D / dark mode

A good Mode B SVG:

- Uses pink as primary, with mint + yellow accents and charcoal sparingly
- Animates in 4 stages
- Is mobile-readable at 320px width
- Wraps CSS in CDATA

A bad output:

- Mode A prompt that's vague or doesn't name colours
- Mode B SVG that's grey / charcoal-dominant
- Either mode with text labels embedded in the artwork
- Either mode without the cream background

---

## Final reminders

- Never abbreviate **Aesthetics Unlocked** to **AU** in any caption (per `feedback_aesthetics_unlocked_naming.md`).
- The illustration is the visual hook; the lesson body still teaches.
- **One stunning illustration beats four mediocre ones.** Restraint matters.
- For Mode A, the prompt is the artefact — write it carefully. Image quality flows directly from prompt quality.

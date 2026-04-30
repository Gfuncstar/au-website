---
type: master-template
purpose: Master AU welcome email — used as E1 of every free-taster nurture sequence
voice: Course-content / mentor-tutor (warmer than marketing pages)
hard-rules:
  - "Subject must include the course title, not 'welcome email'"
  - "Preheader: 75 chars max, plain language, never repeats the subject"
  - "Body opens warm, not transactional"
  - "CTA uses {magic_link_url} — Kartra custom field token, see BERNADETTE-PREFLIGHT §D"
  - "No em-dashes anywhere in user-facing copy. Use full stops, semicolons or commas"
  - "No abbreviating 'Aesthetics Unlocked' to 'AU' in body"
  - "Brand pink #e697b7 highlights on 1-3 phrases max — sparingly, never as a background block"
  - "Sender always: Bernadette - Aesthetics Unlocked <hello@aunlock.co.uk>"
---

# E1 — Welcome email master template

This is the only email in each sequence that uses `{magic_link_url}`. Every other email in a sequence links to specific lessons or the upsell course page using ordinary URLs.

The `{magic_link_url}` token is a Kartra Lead Custom Field (see BERNADETTE-PREFLIGHT.md §D for setup). The site populates it automatically at opt-in time. The link expires in 24 hours; if the lead opens the email later, the fallback is `aestheticsunlocked.co.uk/login` with their email pre-filled.

## Variables Kartra expands inline

- `{first_name}` — provided by the lead, fallback to "there"
- `{magic_link_url}` — populated by `/api/subscribe` per opt-in
- `{course_title}` — set per sequence below
- `{lesson_one_title}` — set per sequence below

---

## Template body (copy-paste into Kartra)

**Subject:** *(set per sequence — examples below)*

**Preheader:** *(set per sequence — examples below)*

**Body (HTML / rich-text — pasted into Kartra's broadcast editor):**

```
Hi {first_name},

You're in.

I've put {course_title} together for the practitioners who want to do
the work properly, not the ones chasing trends. The fact that you're
reading this tells me something about you already.

{lesson_one_title} is ready. One click below and you're inside.

[ READ LESSON 1 → ]
{magic_link_url}

A few things worth knowing.

The lesson lives inside the Aesthetics Unlocked members area, so
that one click signs you in. No password to remember. The link is
good for 24 hours; if it expires, head to
https://aestheticsunlocked.co.uk/login and your email will already
be queued for a fresh one.

I'll send the next lesson in a day or two. In the meantime, if
anything inside the course makes you stop and want to ask
something, hit reply. I read everything.

Bernadette

—
Bernadette - Aesthetics Unlocked
hello@aunlock.co.uk
www.aestheticsunlocked.co.uk
```

---

## Sequence-specific E1 variants

Each sequence's E1 differs only in subject, preheader, course title, and lesson 1 title. The body above otherwise stays identical.

### Free Acne Decoded Mini

- **Subject:** `Lesson 1 of Acne Decoded, The Mini, is ready`
- **Preheader:** `Three lessons on what actually drives breakouts. No theory. Lived clinical work.`
- **course_title:** `Acne Decoded, The Mini`
- **lesson_one_title:** `Lesson 1: Why most acne advice quietly fails`

### Free Rosacea Beyond Redness Mini

- **Subject:** `Lesson 1 of Rosacea Beyond Redness, The Mini, is ready`
- **Preheader:** `Rosacea isn't a redness problem. Three short lessons explaining why that matters.`
- **course_title:** `Rosacea Beyond Redness, The Mini`
- **lesson_one_title:** `Lesson 1: Why "calm the redness" is the wrong starting point`

### Free Skin Specialist Mini

- **Subject:** `Lesson 1 of The Skin Specialist Mini is ready`
- **Preheader:** `Four lessons on what separates a treatment-doer from a true skin specialist.`
- **course_title:** `The Skin Specialist Mini`
- **lesson_one_title:** `Lesson 1: The line between treatment and specialism`

### Free 2-Day RAG

- **Subject:** `Day 1 of the Free 2-Day RAG Taster is ready`
- **Preheader:** `Compliance gets you open. Reputation keeps you in business. Day 1 inside.`
- **course_title:** `the Free 2-Day RAG Taster`
- **lesson_one_title:** `Day 1: The thing most practitioners get wrong about UK regulation`

### Free 3-Day Startup

- **Subject:** `Day 1 of your Free 3-Day Startup is ready`
- **Preheader:** `Three quiet days on building a clinic that doesn't run you into the ground.`
- **course_title:** `the Free 3-Day Startup`
- **lesson_one_title:** `Day 1: Clarity before confidence`

---

## Visual / formatting rules in Kartra

When pasting into Kartra's broadcast editor:

1. **Hero treatment:** dark charcoal banner at the top with the white Aesthetics Unlocked logo, just like the magic-link template. Single colour band, no gradient.
2. **CTA button:** brand pink `#e697b7` background, white text, square corners (`border-radius: 5px`), label in uppercase letter-spaced display font. Pasted via Kartra's button block.
3. **Pink highlights in body:** apply Kartra's text-colour tool to one phrase per email at most. Never a whole sentence. The phrase that earns the highlight is the one a reader would screenshot.
4. **No drop caps.** Standard paragraph leading.
5. **Top-right "view in browser" link removal:** Kartra adds this by default — delete it. The signature block at the bottom is enough.
6. **Mobile preview before send:** Kartra → Preview → Mobile. Verify the CTA fits within the screen width and doesn't truncate.

---

## What NOT to write

These break voice or breach the brand rules. Reject any draft that contains them:

- "Welcome to your journey" (cliché)
- "We're so excited to have you" (corporate-cheerful, never Bernadette)
- "Unlock your potential" (generic, not tied to the brand)
- "Dive deep" / "delve into" / "elevate" / "leverage" / "robust" / "seamlessly" (AI-tells)
- "10X" anything (hype)
- Em-dashes (—). Full stops or semicolons instead.
- Multiple emoji or any emoji other than the brand's traffic-light usage
- The abbreviation "AU" in user-visible copy. Always "Aesthetics Unlocked" in full.

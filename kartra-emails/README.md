# Aesthetics Unlocked, Kartra email assets

This folder holds two related but distinct sets of files:

1. **Per-sequence emails** in `free-*/` and `*-paid/` subfolders. These
   are the actual sign-in welcomes, nurture sequences, and post-purchase
   welcomes for each course on the holding site. **Drafted as
   markdown, built to HTML by a script.** This is the section to read
   first if you're preparing the launch send.
2. **Reusable system templates** at the top level (`01-welcome-free-taster.html`
   through `06-winback.html`). Generic AU-branded shells for
   broadcasts, receipts, course-completion notices and the like. Same
   design language; different job. Documented further down.

---

## Section 1: Per-sequence emails (the launch set)

### What's here

Ten sequence folders. Six free-taster nurtures (one per free course
on the site, seven emails each, ~13 to 14 day cadence) and four
post-purchase welcomes (one per paid course, single email):

| Folder | Trigger | Files | Upsells to |
|---|---|---|---|
| `free-acne-decoded/` | `Acne Mini Opted In` tag | E01-E07 + README | Acne Decoded, £79 |
| `free-rosacea-beyond-redness/` | `Rosacea Mini Opted In` tag | E01-E07 + README | Rosacea Beyond Redness, £150 |
| `free-skin-specialist-mini/` | `Skin Specialist Mini Opted In` tag | E01-E07 + README | The Skin Specialist Programme, £399 |
| `free-2-day-rag/` | `Taster 2Day Opted In` tag | E01-E07 + README | The RAG Pathway, £499 |
| `free-3-day-startup/` | `5K_Prelaunch_Start` tag | E01-E07 + README | The 5K+ Formula, £1,199 |
| `free-clinical-audit/` | `Compliance Audit Opted In` tag | E01-E07 + README | The RAG Pathway, £499 |
| `acne-decoded-paid/` | `Acne Decoded Purchased` tag | E01 welcome + README | (post-purchase onboarding) |
| `rosacea-beyond-redness-paid/` | `Rosacea Purchased` tag | E01 welcome + README | (post-purchase onboarding) |
| `skin-specialist-programme-paid/` | `Skin Specialist Purchased` tag | E01 welcome + README | (post-purchase onboarding) |
| `rag-pathway-paid/` | `RAG Pathway Purchased` tag | E01 welcome + README | (post-purchase onboarding) |
| `5k-formula-paid/` | `12 Week Purchased` tag | E01 welcome + README | (post-purchase onboarding) |

### Two file formats per email

Each email lives as two side-by-side files:

| File | Purpose |
|---|---|
| `E0X-<topic>.md` | The canonical draft. Edit this for content changes. Frontmatter holds subject, preheader, sender, trigger, delay, CTA URL. |
| `E0X-<topic>.html` | The Kartra-ready render. Generated from the .md by `npm run build-kartra-emails`. Paste this straight into Kartra's HTML editor. Don't edit by hand, the next regen will overwrite. |

### How Bernadette uploads these to Kartra

For each email file:

1. Open the **`.html`** version (not the `.md`).
2. The very top is a comment block listing **Subject**, **Preheader**,
   **Sender**, and **Trigger / Delay**. Configure those four fields in
   Kartra's sequence editor first.
3. Switch Kartra's email editor to **HTML mode**.
4. Select all (Cmd-A), delete whatever's there, and **paste the entire
   contents of the .html file** in.
5. Save. Move on to the next email.

The .html already includes the charcoal header strip, pink eyebrow,
white card body, pink CTA button, and the footer block. No additional
styling needed in Kartra. The Kartra visual editor will probably
re-render the layout cleanly because every style is inline (Outlook
needs that, Kartra cooperates with it).

**Don't switch to visual mode after pasting.** Kartra's visual editor
sometimes rewrites HTML and breaks tables / inline buttons. Stay in
HTML mode for any later edits, or come back here, edit the `.md`,
re-run the build script, paste the new HTML over.

### How the build step works

```bash
npm run build-kartra-emails
```

That command runs `scripts/build-kartra-emails.ts`. It walks every
`kartra-emails/<sequence>/E*.md` file, parses the frontmatter, splits
out the subject and preheader, converts the markdown body to HTML
through remark, swaps the `**[ TEXT → ]**` CTA pattern for a styled
pink button, wraps everything in the AU brand email shell, and writes
the result alongside the .md as `E0X-<topic>.html`.

Re-running the build is idempotent. Edit a `.md`, run the script,
paste the new `.html`. No state to clean up.

### Brand voice rules these emails respect

- **No em-dashes** in body, subject, or preheader copy
- **Aesthetics Unlocked** written in full, never abbreviated to "AU"
- **Sender always:** `Bernadette - Aesthetics Unlocked <hello@aunlock.co.uk>`
- **Trademark symbols on first mention per email** for `The 5K+ Formula™`,
  `From Regulation to Reputation™`, `The Skin Specialist™`,
  `UNLOCK PROFIT™`, etc.
- See `_master/welcome-email-template.md` for the full ban list and
  voice notes Bernadette signed off on.

### Three flags for review

Surfaced by the drafting agent. Bernadette to confirm or swap before
the first send:

1. **`free-clinical-audit/E02`** names sections 3 + 6 of the audit as
   "the heaviest". If different sections better fit her clinical
   intuition, swap the names in the markdown and rebuild.
2. **`free-3-day-startup/E05`** uses concrete revenue numbers from
   `lib/courses.ts` (£200 to £400/hr mentoring, +£350/month from
   tighter pricing). Confirm she's comfortable putting these in
   writing or soften to a cohort observation.
3. **All E06 practitioner stories** are written illustratively in
   third person. Replace with verified cases, or accept the
   illustrative framing.

---

## Section 2: Reusable system templates

Self-contained HTML email templates that match the AU website design,
ready to upload into Kartra's email template library. Every email
Bernadette sends through Kartra (sequences, broadcasts, receipts) can
use one of these as the base instead of Kartra's 2017-default chrome.

## What's in here

Every template carries a banner comment at the very top stating the
**Source file** and the **Kartra name** it should be saved as. Use the
exact name shown there — that's what the upload map below depends on.

### Upload map (the sync ledger)

When a file in this folder changes, find the matching saved template
in Kartra by name and paste the new HTML over it. Don't rename in
Kartra — that breaks the sync ledger.

| Repo file | → Kartra → My Templates name | When the email fires | Has cross-sell? |
|---|---|---|---|
| `01-welcome-free-taster.html` | **AU - Welcome - Free Taster** | Step 1 of welcome sequence (free taster opt-in) | ✓ 3-course strip |
| `02-broadcast.html` | **AU - Broadcast (base)** | Standalone — duplicate this for each one-off send | — |
| `03-course-module-released.html` | **AU - Course Module Released** | Cohort drip ("your next module unlocks") | — |
| `04-payment-receipt.html` | **AU - Payment Receipt** | Post-Stripe webhook on paid enrolment | ✓ 2-course strip |
| `05-course-completion.html` | **AU - Course Completion** | Triggered by `*Complete` tag in Kartra | ✓ Primary next-step + 2-course strip |
| `06-winback.html` | **AU - Win-back** | 30+ day silent re-engagement | ✓ 3-angles strip |

### Sync rule

1. **Source of truth lives here in the repo.** Edit the `.html` file,
   commit + push. Don't make significant edits inside Kartra's editor.
2. **Open the matching saved Kartra template** by the name in the table.
3. **HTML mode → paste over the existing body → Save.** Never use the
   visual editor mode after upload — Kartra rewrites HTML and breaks
   inline styles, table layouts, and the cross-sell tables.
4. **Don't rename the Kartra template.** The repo banner comment uses
   the saved Kartra name as the join key. If you rename in Kartra,
   update the banner comment in the matching `.html` to match.

## How to upload to Kartra

1. **Kartra → My Templates → Add new template**
2. Choose **HTML** (not the visual editor)
3. Open the relevant `.html` file in this folder, copy the entire contents
4. Paste into Kartra's HTML pane
5. Save with a recognisable name, e.g. `AU - Welcome - Free Taster`
6. In any sequence / broadcast, select this template as the base

Kartra will preserve the inline styling. Don't switch the editor to
"visual" mode after uploading — that can rewrite the HTML.

## Merge tags (Kartra syntax)

Each template uses these Kartra tags in the body:

| Tag | Meaning |
|---|---|
| `{first_name}` | Recipient's first name (defaults to "there" if blank) |
| `{email}` | Recipient's email |
| `{unsubscribe_link}` | **Required by UK PECR/GDPR.** Kartra auto-injects. |
| `{site_url}` | The AU website URL — set to `https://aestheticsunlocked.co.uk` once production domain is live |
| `{course_title}` | (broadcast / drip / receipt only) name of the course |
| `{module_title}` | (drip only) name of the module just released |
| `{module_url}` | (drip only) deep link to the module |

Kartra's actual merge-tag syntax may vary (some accounts use
`{lead.first_name}` or `[first_name]`). Bernadette should test one
template before rolling out — if the tags don't substitute, they're
the wrong syntax and need a global find-and-replace.

## Design system

All templates share:

- **Max width 600px** — centered on viewport
- **Single column** — Outlook-safe, mobile-friendly
- **Tables for layout** — required for Outlook 2007–2019 still in use
- **Inline CSS** — most clients strip `<style>` tags
- **System-font fallbacks** — Montserrat → Helvetica, Lato → Helvetica,
  Georgia for italic. Web fonts won't reliably load in Outlook, so
  the design must look correct in fallback fonts too.

### Palette (matches the AU site exactly)

```
AU pink     #EE5A8E
AU charcoal #212121
AU cream    #FAF6F1
AU white    #FFFFFF
```

### Type scale (email-safe sizes)

```
Hero headline   32px  Montserrat 900 (Helvetica fallback)
Section H2      24px  Montserrat 800
Body            16px  Lato 400 (Helvetica fallback)
Eyebrow / cite  11px  Oswald 600 uppercase (Helvetica fallback)
Quote           17px  Spectral italic (Georgia fallback)
```

## Testing

Before rolling out widely, send each template to Bernadette's own:

- **Gmail (web + iOS)** — most common consumer client
- **Outlook desktop (Windows)** — strictest renderer
- **Apple Mail (iOS + macOS)** — second-most-common

Or sign up for **Litmus** (~£70 one-time annual test pass) for full
40-client preview matrix in one shot.

## Compliance

- **Unsubscribe link** is in every template footer — `{unsubscribe_link}`.
  Required under UK PECR + GDPR. Don't remove.
- **Physical postal address** — UK PECR requires a postal address in
  marketing emails. Currently set to `Aesthetics Unlocked, [Postal
  address pending]` in each footer — replace with the real registered
  business address before the first send.
- **From address** — Kartra sends from a configurable address in
  Account → Email settings. Recommend `hello@aunlock.co.uk` or
  `bernadette@aestheticsunlocked.co.uk`.
- **DKIM/SPF** — Kartra signs emails with their own keys by default,
  which is fine. For best deliverability, set up branded sending
  (your own DKIM-signed domain) in Kartra → Account → Email
  authentication when the production domain goes live.

## Updating templates

These HTML files are committed to the AU website repo so they're
version-controlled. When a template needs changes:

1. Edit the `.html` file in this folder
2. Commit + push (history visible)
3. In Kartra: open the saved template, paste the updated HTML over the
   existing body. (Kartra doesn't sync from a file URL — manual paste.)

That manual paste step is the one wart. Could be eliminated later by
either (a) using Kartra's API to push template updates, if their API
exposes a template-update endpoint, or (b) keeping all email content
on the AU site and using Kartra only as a transport for transactional
sends. Both are out-of-scope for this phase.

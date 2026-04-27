# AU-branded Kartra email templates

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

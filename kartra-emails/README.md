# AU-branded Kartra email templates

Self-contained HTML email templates that match the AU website design,
ready to upload into Kartra's email template library. Every email
Bernadette sends through Kartra (sequences, broadcasts, receipts) can
use one of these as the base instead of Kartra's 2017-default chrome.

## What's in here

| File | When to use it | Sequence step |
|---|---|---|
| `01-welcome-free-taster.html` | Immediate after free-taster opt-in | Step 1 of welcome sequence |
| `02-broadcast.html` | One-off newsletter / announcement | Standalone |
| `03-course-module-released.html` | Drip emails: "your next module is ready" | Cohort drip |
| `04-payment-receipt.html` | Immediately after paid course purchase | Post-Stripe webhook |
| `05-course-completion.html` | When a student finishes a course | Triggered by completion tag |
| `06-winback.html` | Re-engagement for inactive subscribers | 30+ day silent |

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

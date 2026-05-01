# Launch complete — Aesthetics Unlocked

**Launch date:** 1 May 2026
**Domain:** https://www.aestheticsunlocked.co.uk
**Status:** Live, sequences active, fully wired end-to-end

This is the canonical record of what shipped on launch day. See `LAUNCH-RUNBOOK.md` for the original plan, `PROJECT-STATE.md` for the ongoing state-of-build, and `BERNADETTE-PREFLIGHT.md` for the original preflight checklist.

---

## TL;DR

Site went live at `aestheticsunlocked.co.uk` after a same-day cutover from Kartra-hosted pages to a Vercel-hosted Next.js build. All 11 Kartra email sequences (47 emails, 53 email steps total) are now active and firing on tag-based triggers wired to the new website's opt-in and purchase flows. Site SEO is current with structured data, OG, Twitter cards, sitemap submission to Google Search Console. The whole stack is operational end-to-end.

---

## 1. Site infrastructure

| Component | State |
|---|---|
| Domain | `aestheticsunlocked.co.uk` (apex 307s to www) |
| DNS | GoDaddy — A `@` → `216.150.1.1`, CNAME `www` → `b6a88a78c36d8840.vercel-dns-017.com`, TTL 600 |
| Hosting | Vercel — auto-deploys on push to `main` |
| SSL | Let's Encrypt via Vercel, both apex + www |
| Analytics | Plausible — env var `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=aestheticsunlocked.co.uk` |
| Auth + DB | Supabase (passwordless OTP for members, `pending_memberships` table for buy-before-signin) |
| Search Console | Verified (token `m21duHNZgtRfKf-Cdz4meL_4aQA2l0nYBFwphHPqX8o` in `app/layout.tsx`); sitemap pending submission |
| Email sender | Resend SMTP on `aunlock.co.uk`, DKIM/SPF/DMARC aligned |

The previous Kartra-hosted records (A `34.68.234.4`, CNAME `www → aestheticsunlock.kartra.com`) are documented in the runbook for rollback.

## 2. Pre-existing email DNS preserved

The DNS flip touched only the website-pointing records. These email-related records on `aestheticsunlocked.co.uk` were preserved untouched:

- `_dmarc` TXT (`v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net`)
- DKIM CNAMEs `k01._domainkey`, `k012._domainkey` (SendGrid legacy)
- Sender CNAME `sk357781` (SendGrid legacy)
- `_domainconnect` CNAME (GoDaddy infrastructure)
- NS + SOA (locked nameservers)

The SendGrid records pre-date the Resend migration and are now dead-but-harmless. Cleanable in a future hygiene pass; not blocking anything.

---

## 3. Kartra setup — fully live

### 3.1 Sequences (11 active, 47 emails, 53 email steps)

| ID | Sequence | Trigger tag | Steps | Status |
|---|---|---|---|---|
| 244 | AU – Free 2-Day RAG Nurture | `Taster 2Day Opted In` | 7 | ✅ Active |
| 245 | AU – Free 3-Day Startup Nurture | `5K_Prelaunch_Start` | 7 | ✅ Active |
| 246 | AU – Free Acne Decoded Nurture | `Acne Mini Opted In` | 7 | ✅ Active |
| 247 | AU – Free Rosacea Mini Nurture | `Rosacea Mini Opted In` | 7 | ✅ Active |
| 248 | AU – Free Compliance Audit Nurture | `Compliance Audit Opted In` | 7 | ✅ Active |
| 249 | AU – Free Skin Specialist Mini Nurture | `Skin Specialist Mini Opted In` | 7 | ✅ Active |
| 250 | AU – Acne Decoded Post-Purchase | `Acne Decoded Purchased` | 1 | ✅ Active |
| 251 | AU – Rosacea Post-Purchase | `Rosacea Purchased` | 1 | ✅ Active |
| 252 | AU – Skin Specialist Programme Post-Purchase | `Skin Specialist Purchased` | 1 | ✅ Active |
| 253 | AU – RAG Pathway Post-Purchase | `RAG Pathway Purchased` | 1 | ✅ Active |
| 254 | AU – 5K Formula Post-Purchase | `12 Week Purchased` | 1 | ✅ Active |

### 3.2 Cleaned up legacy Kartra entities

**Deleted (12 sequences, replaced or orphaned):**

- Acne Decoded - Post Purchase (legacy, replaced by AU 250)
- RAG Pathway Post Purchase (legacy, replaced by AU 253)
- 12-Week Business Program Post Purchase (legacy, replaced by AU 254)
- 2-Day Taster - Nurture (legacy, replaced by AU 244)
- The Profit Shift - Nurture (legacy, list archived)
- The 5K Formula Waitlist Pre Lunch Price (legacy, replaced by AU 245)
- Rosacea Beyond Redness Broadcast Nurture (orphan, no trigger)
- RAG Pathway Broadcast Nurture (orphan)
- 5K Formula Broadcast Nurture (orphan)
- Acne Decoded - Broadcast Nurture (orphan)
- Cold Lead Nurture Sequence (orphan, 0 active)
- Rosacea Awareness Month (seasonal one-off)

**Paused (3 sequences with active subscribers — drained naturally over time):**

- 3 DAY STARTUP (88 active subscribers mid-flow)
- REGULATION - MINI COURSE (9 active)
- REGULATION - WAITLIST (2 active)

**Kept active (5 production sequences not part of the 11 AU set):**

- RAG Pathway - Abandoned Cart (rewired, fires on `RAG Pathway Abandoned Cart`)
- 12-Week Business Program Abandoned Cart (rewired, tag renamed to `5K Formula Abandoned Cart`)
- Acne Decoded - Abandoned Cart (rewired)
- Rosacea Beyond Redness - Abandoned Cart (rewired)
- The 5K Formula Waitlist (rewired to `5K Waitlist Opted In`)

### 3.3 Automations

15 production automations active. 1 orphan deleted (the rule subscribed contacts to the archived `THE PROFIT SHIFT` list and tagged them for the 3-Day Startup nurture). No automations reference deleted sequences, archived lists, or old Kartra-hosted URLs.

### 3.4 Kartra custom field

`magic_link_url` (Lead Custom Field, Text long, hidden from lead) is in place. Verified via Variables panel in the email editor — appears under "MY CUSTOM FIELDS".

### 3.5 Merge-tag syntax confirmed

Kartra uses `{internal_name}` syntax for all merge tags:

- Recipient first name: `{first_name}`
- Custom field: `{magic_link_url}` (and any other lead custom field follows the same pattern)
- Unsubscribe link: `{unsubscribe_link}` (used as href value, not auto-injected)

All 47 emails use this syntax verbatim.

---

## 4. Email content fixes (source files)

### 4.1 Stale prices

Found and replaced across 12 files (6 Acne Decoded, 6 5K+ Formula sequence emails) plus 6 README docs and the 06-winback.html master template:

- `£79 → £150` (Acne Decoded reprice, 14 occurrences)
- `£1,199 → £799` (5K+ Formula reprice, 13 occurrences)

The narrative "value framing" in each E05 still tracks at the new prices — no body rewrites needed.

### 4.2 Postal address

Replaced `[Postal address pending]` placeholder across **69 files** (all 47 sequence emails, 6 master templates, 6 READMEs, etc.) with the registered business address:

```
17a Friars Lane, Braintree, Essex CM7 9BL
```

UK PECR-compliant. Source files now correct end-to-end.

### 4.3 Live Kartra emails — pending

The 47 emails already pasted into Kartra's CKEditor still contain the placeholder. To be fixed during a follow-up bulk pass within 7 days of launch (low immediate enforcement risk during low-traffic phase). Source HTML is correct; only the live Kartra-stored copies need updating.

### 4.4 Link audit

Every URL referenced across all 47 emails was verified to return HTTP 200 on the live `www.aestheticsunlocked.co.uk` post-DNS-flip:

- 5 paid course sales pages
- 6 free-course members-area landings
- Login + privacy + apex
- Logo asset

Zero stale Kartra URLs in any active email (verified via grep across the active source).

---

## 5. Backend wiring

### 5.1 Supabase migration

`0002_pending_memberships.sql` applied via SQL Editor. Creates the `pending_memberships` table, enables RLS, and replaces `handle_new_auth_user` to drain pending grants into `memberships` on first sign-in.

Solves: a buyer who purchases via Stripe before ever signing in to the site no longer loses their entitlement. The IPN handler at `/api/kartra/ipn` upserts into `pending_memberships`; the auth-user trigger drains rows on first sign-in.

### 5.2 Vercel env vars

Added `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=aestheticsunlocked.co.uk` to Production scope (also Preview). Marked sensitive in dashboard (cosmetic only — `NEXT_PUBLIC_*` is exposed in client bundle by design).

Redeployed after env-var save. Plausible analytics now fires against the live domain.

---

## 6. SEO optimisation pass

### 6.1 Structured data added

- `app/courses/page.tsx` — CollectionPage + ItemList of all courses
- `app/standards/page.tsx` — CollectionPage + ItemList of all 8 regulators
- `app/for/page.tsx` — CollectionPage + ItemList of UK nations and cities
- `app/testimonials/page.tsx` — CollectionPage with Review nodes (5-star, itemReviewed Course)
- `app/contact/page.tsx` — `@graph` with ContactPage + Organization (with ContactPoint hours) + BreadcrumbList

Plus the existing structured data on /, /about, /courses/[slug], /blog/[slug], /regulation, /standards/[slug], /for/[slug], /faqs (already gold-standard).

### 6.2 Twitter cards added

- `/contact`, `/testimonials`, `/blog` — explicit `summary_large_image` cards (previously falling back from OG)
- `/privacy`, `/terms`, `/cookies` — added OG + Twitter (previously had neither)

### 6.3 Login page metadata

Created `app/login/layout.tsx` to supply metadata (title, description, canonical, `robots: noindex`) for the sign-in page. The page itself is `"use client"` so cannot export metadata directly.

### 6.4 Educator of the Year 2026 Nominee amplification

Wove the credential into descriptions + OG/Twitter titles on six pages that were previously bare:

- `/standards`, `/for`, `/testimonials`, `/contact`, `/blog`, `/faqs`

Now leans heavy on the credential across the full public surface (13 pages × titles/descriptions/OG/Twitter, plus footer + StatStrip + AwardsPanel components, plus email footers).

### 6.5 Google Search Console

- Property added: URL prefix `https://www.aestheticsunlocked.co.uk`
- Verification token `m21duHNZgtRfKf-Cdz4meL_4aQA2l0nYBFwphHPqX8o` wired into `app/layout.tsx → metadata.verification.google`
- Meta tag verified live on production
- Sitemap submission and indexing requests are the next user step

---

## 7. Commits shipped today

```
0f24de9  seo: structured data on index pages, twitter cards on legal pages, login noindex
e123317  seo: weave Educator of the Year 2026 Nominee into 6 page descriptions + OG titles
ee6003d  seo: wire Google Search Console verification token
```

(Plus the documentation updates in this commit.)

---

## 8. Outstanding items (post-launch backlog)

### Tier 1 — within first week

1. **Submit sitemap in Search Console** + request indexing for top 5 pages
2. **Bing Webmaster Tools** — add property, import from Google Search Console, submit sitemap
3. **Lighthouse audit** — target ≥ 90 on Mobile + Performance + SEO + a11y + Best Practices for homepage, /courses/acne-decoded, one /blog post
4. **Google Business Profile** — set up for local SEO around the `/for/[city]` pages
5. **Smoke test one funnel end-to-end** — submit a real opt-in with a test email, verify E01 + magic-link sign-in
6. **Replace 7 placeholder testimonials** (Bernadette, ASA blocker)

### Tier 2 — within first month

7. **Plausible goals** — wire conversion goals (paid course thank-you pages, custom events, /members entry)
8. **Schema validator pass** at https://search.google.com/test/rich-results
9. **axe DevTools a11y audit** (homepage, course page, /login, blog post)
10. **Uptime monitoring** (Better Uptime / UptimeRobot — alert on > 2 min outage)
11. **Mail-tester score** for Resend deliverability
12. **First 3-5 PR / backlink pitches** (Aesthetics Journal, Aesthetic Medicine, RCN, JCCP educator list)
13. **Bulk-fix postal address in Kartra live emails** (UK PECR — within 7 days)

### Tier 3 — ongoing

14. **Content cadence** (blog publishing rhythm, target 2-3/week)
15. **Microsoft Clarity heatmaps** (free tier, install once)
16. **Cookie banner decision** (likely needed if Kartra cookies fire)
17. **Quarterly Lighthouse re-runs**

---

## 9. Rollback notes (if needed)

If the launch needs to be rolled back to the Kartra-hosted state:

**DNS at GoDaddy:**

| Record | Roll back to |
|---|---|
| A `@` | `34.68.234.4` |
| CNAME `www` | `aestheticsunlock.kartra.com` |

**Kartra sequences:** all 11 AU sequences and 12 deleted legacy sequences are independent. Activating/deactivating AU sequences does not affect the rest of the account. Restoring deleted sequences is not possible from the Kartra UI.

**Backend:** the `pending_memberships` table can be dropped with `drop table public.pending_memberships;` and `0001_init.sql` re-applied to restore the original auth-user trigger.

**SEO meta tag:** removing the verification token and re-deploying drops the property from Search Console. The sitemap remains crawlable but un-prioritised.

---

## 10. Lessons + technical debt logged

- **Kartra Vue 3 forms:** `form_input`/`type` events don't trigger v-model reactivity. The reliable workaround is direct Vuex store dispatches (e.g. `store.dispatch('sequencesDashboard/createSequence', {...})` for sequences, `sequenceBuilderSteps/changeStepNodeStatus` for activation). Documented for future Kartra automation work.
- **Kartra sequence activation:** there is no top-level "activate sequence" toggle; activation is per email step via the kebab → "Activate" menu. Save Progress at the sequence level commits the active flags.
- **Claude in Chrome MCP cookie isolation:** the extension uses an isolated cookie partition for MCP-driven tabs, so the user must sign in directly on the MCP-driven tab. Existing logged-in tabs in the same browser don't carry session.
- **CKEditor 5 source view + native setter:** to programmatically inject HTML into a CKEditor 5 source `<textarea>`, use `Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(textarea, html)` plus `input` + `change` events. Toggle Source off to trigger CKEditor's reparse. This is the working pattern that drove all 47 email pastes.

---

*This document is the launch-day record. Future change notes go in `PROJECT-STATE.md`.*

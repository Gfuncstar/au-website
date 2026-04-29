# Aesthetics Unlocked — project state

**Last updated:** April 2026 — at commit [`af285b1`](https://github.com/Gfuncstar/au-website/commit/af285b1)

This document is the **state-of-build** snapshot. It documents what's live, what works, what's pending, and where every piece lives. Use it before changing anything.

For Next.js project-context Claude needs, see [`CLAUDE.md`](./CLAUDE.md).
For getting-to-production setup, see [`SETUP.md`](./SETUP.md).
For repo overview + conventions, see [`README.md`](./README.md).

---

## 1. Site URLs

| Surface | URL |
|---|---|
| Holding site (production) | https://au-website-one.vercel.app |
| Repo | https://github.com/Gfuncstar/au-website |
| Vercel project | https://vercel.com/giles-projects-b3d2a63d/au-website |
| Clone authoring source | `~/Dropbox/CLAUDE/01 AESTHETICS UNLOCKED/clone-aesthetics-unlocked/` |

Push to `main` → Vercel auto-deploys in ~90 seconds.

---

## 2. Course catalogue (10 courses)

All 10 courses are **live** on the holding site. Every lesson markdown file is in place. Every landing page returns 200.

| # | Course | Slug | Price | Lessons | Author / Review |
|---|---|---|---|---|---|
| 1 | Acne Decoded | `acne-decoded` | £79 | 11 | ✅ Bernadette-authored |
| 2 | Rosacea Beyond Redness | `rosacea-beyond-redness` | £79 | 12 | ✅ Bernadette-authored |
| 3 | The Skin Specialist™ Programme | `skin-specialist-programme` | £399 | 10 | ⚠️ Claude-drafted |
| 4 | The RAG Pathway *(From Regulation to Reputation™)* | `rag-pathway` | £499 *(placeholder)* | 9 | Module 1 Bernadette / Modules 2-9 Claude |
| 5 | The 5K+ Formula™ | `5k-formula` | £1,199 | 15 | ✅ Bernadette-authored *(HTML→md conversion only)* |
| 6 | Free 3-Day Startup Mini | `free-3-day-startup` | Free | 5 | Welcome + day 4-5 Bernadette / Days 1-3 Claude-expanded |
| 7 | Free 2-Day RAG Mini | `free-2-day-rag` | Free | 5 | ✅ Bernadette-authored |
| 8 | Free Acne Decoded Mini | `free-acne-decoded` | Free | 3 | ⚠️ Claude-drafted |
| 9 | Free Rosacea Beyond Redness Mini | `free-rosacea-beyond-redness` | Free | 3 | ⚠️ Claude-drafted |
| 10 | The Skin Specialist™ Mini | `free-skin-specialist-mini` | Free | 4 | ⚠️ Claude-drafted |

**Total:** 77 lessons across 10 courses. ⚠️ items need Bernadette's clinical review before public launch.

### Funnel pairing

| Free taster | Upsells to |
|---|---|
| `free-3-day-startup` | `5k-formula` |
| `free-2-day-rag` | `rag-pathway` |
| `free-acne-decoded` | `acne-decoded` |
| `free-rosacea-beyond-redness` | `rosacea-beyond-redness` |
| `free-skin-specialist-mini` | `skin-specialist-programme` |

Wired in `lib/courses.ts` via `upsellsTo` + `freeTasterSlug` cross-references.

---

## 3. Page surfaces — what's live

### Public marketing

| Page | URL | Notes |
|---|---|---|
| Homepage | `/` | |
| About Bernadette | `/about` | |
| Contact | `/contact` | |
| Blog | `/blog` | |
| Standards we teach against | `/standards` | |
| Regulation explainer | `/regulation` | |
| FAQs | `/faqs` | |
| Course catalogue | `/courses` | |
| Course landing pages × 10 | `/courses/<slug>` | All 10 verified live |
| Course thank-you pages × 10 | `/courses/<slug>/thanks` | All 10 verified live |
| Privacy / Cookies / Terms | `/privacy`, `/cookies`, `/terms` | |
| Geo pages | `/for/<location>` | If wired |

### Members area (gated)

| Page | URL |
|---|---|
| Sign in | `/login` |
| Dashboard launchpad | `/members` |
| Account | `/members/account` |
| Billing | `/members/billing` |
| Activity | `/members/activity` |
| Course launcher | `/members/courses` |
| Lesson player | `/members/courses/<slug>/<lesson>` |

---

## 4. Backdoor access

Two mechanisms are live in code. Both intentional, both useful.

### Owner email allowlist

**File:** `lib/owner-emails.ts`

```ts
export const OWNER_EMAILS: readonly string[] = [
  "giles@hieb.co.uk",
  "ber.parsons@outlook.com",
];
```

When either email signs in via the standard `/login` flow:

- **Entitlement check is bypassed** in `lib/entitlements.ts` (`checkCourseEntitlement` returns `entitled: true`)
- **Members dashboard** synthesises a full-catalogue membership list in `lib/kartra/client.ts` (`getLeadFromSupabase`) so every course tile is visible

To add an owner: append the lowercase email to `OWNER_EMAILS`, commit, push. Vercel auto-deploys; new owner sees the full catalogue on next page load.

### Preview-link token

**Mechanism:** `middleware.ts` + `lib/entitlements.ts`

Set `AU_PREVIEW_TOKEN` env var in Vercel. Anyone hitting any URL with `?preview=<TOKEN>` is given a 7-day cookie (`au_preview_ok=1`) that bypasses both auth (middleware) and entitlement (page-level).

A securely-generated 256-bit random token was generated this session:
```
c0a4b9034ef8f3c683f3d9414b0d5a1067c43bef670dd84659f8725379ee0e97
```

To activate:
1. Vercel → Project Settings → Environment Variables
2. Add `AU_PREVIEW_TOKEN` with the value above
3. Apply to Production, Preview, Development
4. Redeploy (auto)
5. Share `https://au-website-one.vercel.app/?preview=<TOKEN>` with whoever needs preview access

If unset, the bypass code path returns false and normal auth applies — fully opt-in.

---

## 5. Funnel architecture

```
            ┌────────────────────────────────────────────┐
            │  Free taster sales page (/courses/<slug>)  │
            │  → OptInForm (email + first name)          │
            └────────────────────────────────────────────┘
                              │
                              ▼ POST /api/subscribe
            ┌────────────────────────────────────────────┐
            │  Kartra addLead() — create lead, subscribe │
            │  to optInListName, apply optInTagName      │
            │  (per lib/kartra-mappings.ts)              │
            └────────────────────────────────────────────┘
                              │
                              ▼  Kartra automation fires
            ┌────────────────────────────────────────────┐
            │  Welcome email sequence (7-10 emails)      │
            │  Drips toward paid course CTA              │
            │  ⚠️  Sequences need to be authored in Kartra│
            └────────────────────────────────────────────┘
                              │
                              ▼  Lead clicks course CTA
            ┌────────────────────────────────────────────┐
            │  Paid course sales page (/courses/<slug>)  │
            │  → kartraUrl placeholder                   │
            │  ⚠️  Replace with real Kartra checkout URL │
            └────────────────────────────────────────────┘
                              │
                              ▼  Kartra IPN fires on purchase
            ┌────────────────────────────────────────────┐
            │  /api/kartra/ipn — membership_granted      │
            │  → Supabase memberships row inserted       │
            │  → Plausible course_purchase event         │
            └────────────────────────────────────────────┘
                              │
                              ▼  Member signs in
            ┌────────────────────────────────────────────┐
            │  /members → entitlement check → lesson     │
            │  player serves content                     │
            └────────────────────────────────────────────┘
```

---

## 6. What's working end-to-end

✅ All 10 course landing pages render with full marketing copy, hero, transformations, curriculum, FAQs, schema.org structured data
✅ All 10 thank-you pages render at `/courses/<slug>/thanks`
✅ Course catalogue index at `/courses`
✅ OptInForm captures email + first name + courseSlug, posts to `/api/subscribe`, calls Kartra `addLead()` with list + tag (4 of the 5 free tasters; new Skin Specialist Mini needs Kartra list/tag created)
✅ Magic-link / OTP sign-in flow at `/login` (Supabase Auth)
✅ Supabase IPN webhook at `/api/kartra/ipn` syncs membership_granted / membership_revoked / subscription_cancelled events into the `memberships` table
✅ Members dashboard at `/members` renders course tiles based on memberships
✅ Lesson player at `/members/courses/<slug>/<lesson>` renders markdown with chapter strip, scroll progress, on-this-page nav, audio intro pill, video placeholder, lesson body, up-next card, lesson nav footer, keyboard nav (← / → / M)
✅ Per-course entitlement gating with redirect to public sales page on unentitled access
✅ Owner email allowlist live for Giles + Bernadette
✅ Preview token mechanism wired (env var unset by default)
✅ Plausible analytics: tracking calls placed on opt_in_submit, opt_in_success, sign_in_request, sign_in_success, lesson_view, course_purchase, course_revoke (env var unset → silent no-op)
✅ Resend SMTP config documented in SETUP.md Step 4 + AU-branded magic-link email template at `supabase/email-templates/magic-link.html`
✅ Member-backfill script at `scripts/backfill-memberships.ts` (run via `npm run backfill -- /path/to/csv`)
✅ Footer added to members area layout

---

## 7. What's pending — punch list

### Content

- ⚠️ **Bernadette's clinical review** of 29 Claude-drafted lessons before public launch:
  - rag-pathway modules 2-9 (8 lessons, regulatory content)
  - free-3-day-startup days 1-3 (3 lessons, business mindset)
  - free-acne-decoded (3 lessons, clinical)
  - free-rosacea-beyond-redness (3 lessons, clinical)
  - skin-specialist-programme modules 1-10 (10 lessons, clinical)
  - free-skin-specialist-mini (4 lessons, clinical)
- 🟡 The RAG Pathway price (£499) is a **placeholder** — confirm with Bernadette
- 🟡 5K+ Formula references "Profit Matrix worksheet", "Drivers vs. Drainers worksheet", "Two-Week Lead Nurture Cycle template", "Client Experience Audit worksheet" — these are referenced but don't yet exist as downloadables

### Production media

- ❌ **No video on any lesson** — `<VideoPlaceholder>` component renders. Mux not yet wired.
- ❌ **No audio intros** — `<AudioIntroPill>` component is a placeholder. m4a uploads not yet collected.
- ❌ **Course illustrations** — prompts written for `acne-decoded` only (`public/illustrations/acne-decoded/prompts.md`). PNGs need to be generated by the AU team in Midjourney / DALL-E. Other 9 courses have no prompts yet.
- ❌ **Bernadette signature image** confirmed but not yet styled into every relevant attribution

### Kartra setup

- ⚠️ **4 mappings flagged TODO** in `lib/kartra-mappings.ts` — need verification by Bernadette in her Kartra dashboard:
  - `free-3-day-startup` opt-in list (5K Formula Prelaunch Trigger vs Clarity to Cash)
  - `rag-pathway` waitlist vs purchase list separation (now both available so simpler — verify the active list)
  - `5k-formula` opt-in tag (recommend creating "5K Waitlist Opted In")
- ⚠️ **2 new Kartra lists/tags need creating** for the new Skin Specialist courses:
  - `skin-specialist-programme` — purchase list "Skin Specialist Programme Buyers" + tags
  - `free-skin-specialist-mini` — opt-in list "The Skin Specialist Mini" + tag "Skin Specialist Mini Opted In"
- ⚠️ **Email nurture sequences** for free tasters need to be authored in Kartra (~7-10 emails per free course → paid upsell, 5 total sequences for the 5 free tasters)

### Production infrastructure

- ❌ **SMTP not wired** — Supabase default mailer rate-limits at 3 emails/hour. Resend instructions in SETUP.md Step 4. Until configured, sign-in OTPs will fail under any meaningful load.
- ❌ **`NEXT_PUBLIC_PLAUSIBLE_DOMAIN` env var** not set in Vercel. Until set, all Plausible tracking calls silently no-op. Set to `aestheticsunlocked.co.uk` once domain is signed up.
- ❌ **Member backfill not yet run.** Existing Kartra customers won't have entitlements on first sign-in until `npm run backfill -- /path/to/kartra-export.csv` is run.
- ❌ **Kartra checkout URLs** are still placeholders (`courseKartraPlaceholder("<slug>")` returns a stub URL). Each paid course needs its real Kartra checkout URL pasted into `lib/courses.ts`.
- ❌ **Stripe webhooks** — code references `assignTag()` / `removeTag()` for purchase/refund events but no Stripe → IPN bridge is documented if direct Stripe checkout is added.
- 🟡 **`AU_PREVIEW_TOKEN`** env var not set. Optional — only needed if you want to use the preview-link mechanism.

### Mock-only Kartra methods (LIVE-mode work)

The Kartra client methods `searchLead`, `editLead`, `cancelRecurringSubscription`, `toggleListSubscription` were converted from mock to real API calls (commit 6989c29) — they call `lib/kartra.ts` real Kartra API endpoints when `KARTRA_*` env vars are set. They safely no-op (with console.warn) if Kartra isn't configured.

---

## 8. Key files / where things live

### Catalogue + content

- `lib/courses.ts` — **THE catalogue.** Every course definition: slug, title, summary, body, voiceQuote, modules, price, kartraUrl, tone, category, format, availability, transformations, whyBernadette, includes, faqs.
- `content/courses/<slug>/<NN>-<lesson>.md` — Lesson markdown (deployed copy)
- `clone-aesthetics-unlocked/content/courses/<slug>/<NN>-<lesson>.md` — Lesson markdown (authoring source)
- `lib/courseLessons.ts` — markdown → HTML rendering with custom transforms (callouts, section bands, mobile tables, step heads)

### Auth + access

- `middleware.ts` — protects `/members/*`, handles preview-token grant
- `lib/owner-emails.ts` — platform-owner allowlist
- `lib/entitlements.ts` — per-course access check
- `lib/supabase/server.ts`, `lib/supabase/admin.ts` — Supabase client helpers
- `app/api/auth/login/route.ts`, `verify/route.ts`, `callback/route.ts`, `logout/route.ts` — auth endpoints

### Kartra integration

- `lib/kartra.ts` — server-side API client (real HTTP calls). `addLead`, `getLeadDetail`, `getLeadByEmail`, `assignTag`, `removeTag`, `setListSubscription`, `editLead`, `cancelSubscription`, `leadExists`
- `lib/kartra/client.ts` — dashboard-data abstraction (LIVE = Supabase, MOCK = MOCK_LEAD)
- `lib/kartra/types.ts` — TypeScript types
- `lib/kartra/mock.ts` — fully-populated fictitious member for dev / preview
- `lib/kartra-mappings.ts` — slug → list/tag/membership name lookup
- `app/api/kartra/ipn/route.ts` — IPN webhook (membership_granted, membership_revoked, subscription_cancelled)

### Analytics

- `lib/analytics.ts` — `track()` for browser, `trackServer()` for webhooks
- `components/PlausibleScript.tsx` — script loader (renders nothing if `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` unset)
- `components/members/LessonViewTracker.tsx` — fires `lesson_view` on lesson page render

### Marketing pages

- `app/courses/page.tsx` — catalogue index, MARKS lookup for course tiles
- `app/courses/[slug]/page.tsx` — individual sales pages
- `app/courses/[slug]/thanks/page.tsx` — post opt-in / post-purchase confirmation pages

### Members area

- `app/members/layout.tsx` — shell (nav, footer, content area)
- `app/members/page.tsx` — dashboard launchpad
- `app/members/courses/[slug]/page.tsx` — course overview chapter ledger
- `app/members/courses/[slug]/[lesson]/page.tsx` — lesson player
- `components/members/*` — chrome (CourseChapterStrip, LessonNavFooter, OnThisPageNav, etc.)

### Forms + capture

- `components/OptInForm.tsx` — free-taster email capture, posts to `/api/subscribe`
- `app/api/subscribe/route.ts` — calls Kartra `addLead()` with course-specific list + tag

### Scripts + utilities

- `scripts/backfill-memberships.ts` — one-off Kartra → Supabase migration. Run via `npm run backfill -- /path/to/kartra-export.csv [--dry-run]`. Idempotent, throttled to 1 req/sec.

### Skills (Claude Code)

- `.claude/skills/au-course-illustrations/SKILL.md` — illustration prompt-generator skill (Mode A: AI image-gen prompts; Mode B: animated SVG diagrammatic)

### Email + assets

- `supabase/email-templates/magic-link.html` — AU-branded magic-link email (paste into Supabase Auth → Email Templates)
- `public/illustrations/acne-decoded/prompts.md` — 8 lesson illustration prompts ready for AI image gen
- `public/illustrations/<course>/<lesson>/<NN>-<concept>.png` — illustration drop-in paths (lesson markdown already references these)

---

## 9. Recent commit history (this session)

| Commit | Summary |
|---|---|
| [`af285b1`](https://github.com/Gfuncstar/au-website/commit/af285b1) | Add Skin Specialist Programme + Mini, open RAG + 5K+ for sale (waitlist removed) |
| [`af80974`](https://github.com/Gfuncstar/au-website/commit/af80974) | Owner dashboard: every course visible to Giles + Bernadette |
| [`c113020`](https://github.com/Gfuncstar/au-website/commit/c113020) | 5K+ Formula price set to £1,199 |
| [`d2e4d4a`](https://github.com/Gfuncstar/au-website/commit/d2e4d4a) | Bernadette added to owner allowlist |
| [`ac7a1e8`](https://github.com/Gfuncstar/au-website/commit/ac7a1e8) | Illustration skill pivoted to AI image-gen prompts + 8 acne-decoded prompts |
| [`b733bd4`](https://github.com/Gfuncstar/au-website/commit/b733bd4) | au-course-illustrations skill created |
| [`6989c29`](https://github.com/Gfuncstar/au-website/commit/6989c29) | Lead-magnet funnel: free tasters, Kartra wiring, Plausible analytics, member-backfill, Resend SMTP docs |
| [`69231f8`](https://github.com/Gfuncstar/au-website/commit/69231f8) | Owner email allowlist (Giles only) |
| [`22fde67`](https://github.com/Gfuncstar/au-website/commit/22fde67) | 26 course content files (rag-pathway 8 modules, 5k-formula HTML→md, free-3-day-startup expansion) |

---

## 10. Things to confirm with Bernadette before public launch

1. **Clinical review of 29 Claude-drafted lessons** (see Section 7 — Content). The skin-specialist-programme + minis are draft-quality. Her sign-off is the legal anchor before the new clinical courses launch.
2. **The RAG Pathway price** — confirm £499 or update.
3. **The Skin Specialist Programme topic + curriculum** — Claude's recommendation. Any concerns about scope, sequencing, or naming.
4. **Kartra list/tag naming convention** — verify the 4 TODO mappings + create the 2 new ones for Skin Specialist courses.
5. **Real Kartra checkout URLs** for all 5 paid courses — `kartraUrl` in `lib/courses.ts` is currently a placeholder per course.
6. **Email nurture sequences** for the 5 free tasters — ~35-50 emails total to be authored inside Kartra.
7. **Course illustrations** — generate PNGs for each lesson using the prompts in `public/illustrations/acne-decoded/prompts.md` (acne course only so far). Other 9 courses don't yet have prompts written.
8. **Domain pointing** — the holding URL `au-website-one.vercel.app` will eventually move to `aestheticsunlocked.co.uk` (or similar). Configure DNS + Vercel custom domain.
9. **GSC / SEO verification token** — currently commented out in `app/layout.tsx`. Add Google Search Console verification token once the production domain is pointed.

---

## 11. Future-proofing notes

- **Adding a course:** edit `lib/courses.ts` (one entry), add Kartra mapping in `lib/kartra-mappings.ts`, add MARKS lookup in `app/courses/page.tsx`, drop markdown into `content/courses/<slug>/`. Sync to clone repo. Done — every consumer auto-updates.
- **Adding a lesson:** drop a new `NN-<slug>.md` file with frontmatter. Update `course.json` `parts` array if it should appear under a new editorial divider. Done.
- **Renaming a Kartra list/tag:** update the relevant entry in `lib/kartra-mappings.ts`. Without this, opt-ins silently fail to apply the right Kartra automation.
- **Adding an owner:** append email to `lib/owner-emails.ts`. Vercel auto-deploys; new owner sees full catalogue on next page load.
- **Revoking a preview token:** change `AU_PREVIEW_TOKEN` env var to a new value in Vercel. All existing cookies stop working immediately.

# Aesthetics Unlocked, project state

> **✅ LAUNCHED 2026-05-01.** DNS flipped, SSL provisioned, sequences active, search-engine verified. Site is live at https://www.aestheticsunlocked.co.uk. See [`LAUNCH-COMPLETE.md`](./LAUNCH-COMPLETE.md) for the launch-day record of what shipped, what was cleaned up, and what's outstanding post-launch. This document is the ongoing state-of-build; the launch-complete doc is the historical record.

**Last updated:** 1 May 2026, end of launch day. Latest pushed commit: `ee6003d` (Search Console verification token wired). Today's commits: `0f24de9` (structured data + twitter cards + login noindex), `e123317` (Educator of the Year 2026 amplification across 6 pages), `ee6003d` (Search Console token).

This document is the **state-of-build** snapshot. It documents what's live, what works, what's pending, and where every piece lives. Use it before changing anything.

For Next.js project-context Claude needs, see [`CLAUDE.md`](./CLAUDE.md).
For getting-to-production setup, see [`SETUP.md`](./SETUP.md).
For repo overview + conventions, see [`README.md`](./README.md).
For the launch-day record, see [`LAUNCH-COMPLETE.md`](./LAUNCH-COMPLETE.md).

---

## 1. Site URLs

| Surface | URL |
|---|---|
| Production website | **https://www.aestheticsunlocked.co.uk** ✅ live (DNS flipped 2026-05-01) |
| Apex redirect | https://aestheticsunlocked.co.uk → 307 → www |
| Holding site (Vercel preview) | https://au-website-one.vercel.app (still resolves; same project) |
| Email sender domain | `hello@aunlock.co.uk` ✅ *(verified at Kartra and at Resend; SMTP plumbed through Supabase Auth)* |
| Repo | https://github.com/Gfuncstar/au-website |
| Vercel project | https://vercel.com/giles-projects-b3d2a63d/au-website |
| Clone authoring source | `~/Dropbox/CLAUDE/01 AESTHETICS UNLOCKED/clone-aesthetics-unlocked/` |
| Search Console | https://search.google.com/search-console (URL prefix property, verified 2026-05-01) |

Push to `main` → Vercel auto-deploys in ~90 seconds.

**Two-domain split is intentional:** descriptive website (`aestheticsunlocked.co.uk`), memorable email (`aunlock.co.uk`). Magic-link emails go FROM `aunlock.co.uk` and link TO `aestheticsunlocked.co.uk`. Both domains have clean SPF/DKIM; DMARC alignment is in place for the sender domain.

**DNS records on `aestheticsunlocked.co.uk` (post-flip):**

| Type | Name | Value | Notes |
|---|---|---|---|
| A | @ | 216.150.1.1 | Vercel apex (post-launch) |
| CNAME | www | b6a88a78c36d8840.vercel-dns-017.com | Vercel www (project-specific) |
| TXT | _dmarc | v=DMARC1; p=quarantine; ... | Email auth (preserved) |
| CNAME | k01._domainkey | k01.domainkey.u57021987.wl238.sendgrid.net | Legacy SendGrid DKIM |
| CNAME | k012._domainkey | k012.domainkey.u57021987.wl238.sendgrid.net | Legacy SendGrid DKIM |
| CNAME | sk357781 | u57021987.wl238.sendgrid.net | Legacy SendGrid sender |
| CNAME | _domainconnect | _domainconnect.gd.domaincontrol.com | GoDaddy infrastructure |
| NS | @ | ns63/ns64.domaincontrol.com | Locked GoDaddy nameservers |

The SendGrid records pre-date the Resend migration and can be cleaned in a future hygiene pass; they don't conflict with anything.

**Brand voice hard save (2026-04-30):** zero em-dashes in user-visible copy, zero AI-tell vocabulary. Documented in `CLAUDE.md` and in the user's memory (`feedback_no_ai_slop.md`). Every existing em-dash in `app/`, `components/`, `lib/`, `content/blog/`, `content/courses/` was swept (~1,950 across 151 files, commit [`72aa2b3`](https://github.com/Gfuncstar/au-website/commit/72aa2b3)).

---

## 2. Course catalogue (11 courses)

All 11 courses are **live** on the holding site. Every lesson markdown file is in place. Every landing page returns 200.

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
| 11 | The England Aesthetic Compliance Audit | `free-clinical-audit` | Free | 8 sections, ≈30 min total | ✅ Bernadette-authored *(from her ODT lead-magnet, 2026-04-30)* |

**Total:** 85 lessons / sections across 11 courses. ⚠️ items still need Bernadette's clinical review before public launch.

### Funnel pairing

| Free taster | Upsells to |
|---|---|
| `free-3-day-startup` | `5k-formula` |
| `free-2-day-rag` | `rag-pathway` |
| `free-acne-decoded` | `acne-decoded` |
| `free-rosacea-beyond-redness` | `rosacea-beyond-redness` |
| `free-skin-specialist-mini` | `skin-specialist-programme` |
| `free-clinical-audit` | `rag-pathway` |

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

✅ All 11 course landing pages render with full marketing copy, hero, transformations, curriculum, FAQs, schema.org structured data *(catalogue grew by one on 2026-04-30: `free-clinical-audit`, the England aesthetic compliance audit lead-magnet feeding the RAG Pathway)*
✅ All thank-you pages render at `/courses/<slug>/thanks`
✅ Course catalogue index at `/courses` with Where-to-start panel + 5 tabs (All, Free, Clinical, Regulatory, Business), all visible on mobile
✅ OptInForm captures email + first name + courseSlug, posts to `/api/subscribe`, calls Kartra `addLead()` with list + tag
✅ Magic-link / OTP sign-in flow at `/login` (Supabase Auth)
✅ **Magic-link email is fully on brand and deliverable** *(2026-04-30 dashboard work):*
   - Branded HTML pasted into Supabase Auth → Email Templates → Magic Link
   - Subject set to "Your Aesthetics Unlocked sign-in link"
   - Custom SMTP enabled in Supabase → Auth → SMTP Settings, pointing at Resend
   - `aunlock.co.uk` verified in Resend with DKIM + SPF (record set lives at GoDaddy alongside Kartra's existing records, no conflict)
   - Sender displayed as `Aesthetics Unlocked <hello@aunlock.co.uk>` with no "powered by Supabase" footer
   - OTP length set to 6 digits in Supabase to match the `/login` form
   - End-to-end smoke-tested: sign-in code arrives in <10s, lands in primary inbox, click-through works
✅ Supabase IPN webhook at `/api/kartra/ipn` syncs membership_granted / membership_revoked / subscription_cancelled events into the `memberships` table
✅ Members dashboard at `/members` renders course tiles based on memberships
✅ `/dashboard` marketing page surfaces members-area features to public visitors (charcoal preview cards, "Instant access" framing)
✅ `/testimonials` page groups social proof by course
✅ Lesson player at `/members/courses/<slug>/<lesson>` renders markdown with chapter strip, scroll progress, on-this-page nav, audio intro pill, video placeholder, lesson body, up-next card, lesson nav footer, keyboard nav (← / → / M)
✅ Per-course entitlement gating with redirect to public sales page on unentitled access
✅ Owner email allowlist live for Giles + Bernadette
✅ Preview token mechanism wired (env var unset by default)
✅ Plausible analytics: tracking calls placed on opt_in_submit, opt_in_success, sign_in_request, sign_in_success, lesson_view, course_purchase, course_revoke (env var unset → silent no-op)
✅ Member-backfill script at `scripts/backfill-memberships.ts` (run via `npm run backfill -- /path/to/csv`)
✅ Footer added to members area layout
✅ Footer Courses column auto-populated from `lib/courses.ts` (free-first, ascending price, alphabetical), so adding a course in the catalogue updates the footer link list automatically

### 6.1 SEO surface (2026-04-30 audit + fixes)

✅ Sitemap (`/sitemap.xml`) lists 46 URLs including all courses, standards, locations, blog posts
✅ RSS feed (`/blog/feed.xml`) lists every post newest-first
✅ `robots.txt` allows the public surface, blocks `/members` and `/login`, points at the sitemap
✅ Per-post page metadata (title, description, canonical, Open Graph, Twitter card) generated from blog frontmatter
✅ JSON-LD structured data per blog post: `BlogPosting` + `BreadcrumbList`, with author Person carrying NMC PIN, awards, sameAs to NMC register, and a per-citation `CreativeWork` for each source
✅ Per-route Open Graph image generation: blog posts, courses, regulators, locations all carry their own 1200×630 PNG share card with topic eyebrow / title / byline / read time (no fallback bleed across routes)
✅ Three new blog posts shipped with primary-source verification, full SEO surface (≥3 internal pillar links per post, 9–15 external citations per post, 1,377–1,468 words):
   - [`/blog/vascular-occlusion-hyaluronic-acid-filler-uk`](https://au-website-one.vercel.app/blog/vascular-occlusion-hyaluronic-acid-filler-uk)
   - [`/blog/mhra-botox-advertising-uk-rules`](https://au-website-one.vercel.app/blog/mhra-botox-advertising-uk-rules)
   - [`/blog/nice-acne-guidelines-aesthetic-practitioners`](https://au-website-one.vercel.app/blog/nice-acne-guidelines-aesthetic-practitioners)

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

> **Bernadette directive 2026-04-30:** "Videos and audios are vital to ensure all
> different learners are targeted. Ensure these are scattered through all of
> the courses." Treat the four items below as a single launch-quality gate, not
> independent items, every paid course should ship with at least some video
> AND audio AND illustration coverage before it goes public.

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

- ✅ **SMTP wired and live** *(2026-04-30)*. Resend account created, `aunlock.co.uk` verified with DKIM + SPF, custom SMTP enabled in Supabase, branded magic-link template pasted, OTP length set to 6, end-to-end smoke-tested. The handoff doc at `supabase/email-templates/MAGIC_LINK_HANDOFF.md` is now historical reference; both fixes it described are done.
- ❌ **`NEXT_PUBLIC_PLAUSIBLE_DOMAIN` env var** not set in Vercel. Until set, all Plausible tracking calls silently no-op. Set to `aestheticsunlocked.co.uk` once domain is signed up.
- ❌ **Member backfill not yet run.** Existing Kartra customers won't have entitlements on first sign-in until `npm run backfill -- /path/to/kartra-export.csv` is run. See `BACKFILL-FORMAT.md` for the column-mapping spec.
- ✅ **Kartra checkout URLs (5 of 5 wired, 2026-04-30):**
  Every paid course's Enrol button on the holding site now points at a
  real Kartra checkout: Acne Decoded (£150), Rosacea Beyond Redness
  (£150), The Skin Specialist™ Programme (£399), The RAG Pathway (£499),
  and The 5K+ Formula™ (£799). No paid-course CTA gaps left.
- ❌ **Stripe webhooks**: code references `assignTag()` / `removeTag()` for purchase/refund events but no Stripe → IPN bridge is documented if direct Stripe checkout is added.
- 🟡 **`AU_PREVIEW_TOKEN`** env var not set. Optional, only needed if you want to use the preview-link mechanism.

### Pre-launch redirects (in repo, dormant until DNS flip)

- ✅ `next.config.ts` carries 301s for stale Kartra-era URLs: `/portal`, `/portal/:path*`, `/login-page`, `/sign-in`, `/signin`, `/free-acne-decoded`, `/free-rosacea-beyond-redness`, `/free-skin-specialist-mini`, `/free-2-day-rag`, `/free-3-day-startup`, `/aestetics`, `/aestethics`. These are inert until DNS swings to Vercel, then catch any inbound link from already-sent broadcasts.
- ✅ `npm run preflight` (script at `scripts/preflight.ts`) runs a green/red checklist of every required env var, table existence, and endpoint health. Recommended right before declaring launch complete.

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

## 9. Recent commit history

### 2026-04-30 (this session)

| Commit | Summary |
|---|---|
| [`72aa2b3`](https://github.com/Gfuncstar/au-website/commit/72aa2b3) | Site-wide em-dash sweep + new `/dashboard`, `/testimonials` pages + voice ban hard-saved + free-clinical-audit course added |
| [`3f4f62a`](https://github.com/Gfuncstar/au-website/commit/3f4f62a) | Three new blog posts cross-referenced against primary sources (vascular occlusion HA filler, MHRA Botox advertising, NICE acne NG198) |
| [`650211d`](https://github.com/Gfuncstar/au-website/commit/650211d) | Per-post Open Graph image generator added for the Journal |
| [`c3432da`](https://github.com/Gfuncstar/au-website/commit/c3432da) | Per-route OG image alt-text fix: `generateImageMetadata` filters by `params.slug` instead of returning the full collection |
| [`df77fad`](https://github.com/Gfuncstar/au-website/commit/df77fad) | Magic-link branded-email template + Resend SMTP handoff doc (corrected to use intentional `aunlock.co.uk` sender domain) |
| [`bc1a2cf`](https://github.com/Gfuncstar/au-website/commit/bc1a2cf) | Initial OG params-Promise fix for Next 16 (later corrected, see 2129530) |
| [`2129530`](https://github.com/Gfuncstar/au-website/commit/2129530) | Correct Next 16 OG contract (sync params for `generateImageMetadata`, `Promise<params>` + `Promise<id>` for default Image function) |
| [`45b32ef`](https://github.com/Gfuncstar/au-website/commit/45b32ef) | Drop ★ glyph from every OG image (Satori was 400-ing on the dynamic-font fetch), swap for a 14×14 pink square. Bundled in: launch-runway artefacts (LAUNCH-RUNBOOK.md, BERNADETTE-PREFLIGHT.md, BACKFILL-FORMAT.md, kartra-emails E01–E07 for Acne Decoded, `scripts/preflight.ts`, `next.config.ts` 301 redirects for stale Kartra URLs) |

### 2026-04-30, dashboard-only (no commits, performed in third-party UIs)

| Action | Where |
|---|---|
| Magic-link template pasted into Supabase | Supabase → Authentication → Email Templates → Magic Link |
| Subject line "Your Aesthetics Unlocked sign-in link" set | Same place |
| Resend account created, `aunlock.co.uk` added as sending domain | resend.com → Domains |
| DKIM + SPF DNS records added at GoDaddy alongside existing Kartra records | GoDaddy → aunlock.co.uk → DNS |
| Resend domain verified | Resend dashboard |
| Resend API key minted (scope: Sending only) and pasted into Supabase | Resend → API Keys, then Supabase → Auth → SMTP Settings |
| Custom SMTP enabled in Supabase | Supabase → Auth → SMTP Settings |
| Email OTP length set to 6 (was 8, which broke the 6-digit `/login` form) | Supabase → Authentication → Providers → Email |

### Earlier sessions

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
8. **Domain pointing** — point `aestheticsunlocked.co.uk` apex/www at Vercel; update Supabase Site URL + redirect URLs to match. Email sender stays on `aunlock.co.uk` (already verified, no warm-up needed).
9. **GSC / SEO verification token** — currently commented out in `app/layout.tsx`. Add Google Search Console verification token once the production domain is pointed.

---

## 11. Future-proofing notes

- **Adding a course:** edit `lib/courses.ts` (one entry), add Kartra mapping in `lib/kartra-mappings.ts`, add MARKS lookup in `app/courses/page.tsx`, drop markdown into `content/courses/<slug>/`. Sync to clone repo. Done — every consumer auto-updates.
- **Adding a lesson:** drop a new `NN-<slug>.md` file with frontmatter. Update `course.json` `parts` array if it should appear under a new editorial divider. Done.
- **Renaming a Kartra list/tag:** update the relevant entry in `lib/kartra-mappings.ts`. Without this, opt-ins silently fail to apply the right Kartra automation.
- **Adding an owner:** append email to `lib/owner-emails.ts`. Vercel auto-deploys; new owner sees full catalogue on next page load.
- **Revoking a preview token:** change `AU_PREVIEW_TOKEN` env var to a new value in Vercel. All existing cookies stop working immediately.

---

## 12. Launch path — clean nuke + rebuild *(decided 2026-04-30)*

The 5 nurture sequences in Kartra get rebuilt from scratch in the new AU template — **not** audit-and-fix-in-place. Existing Kartra sequences are backed up to Dropbox then deleted. New sequences are wired to the same opt-in trigger tags so the funnel keeps working without subscriber drop-off.

**Why this path:** the 40-email rebuild was happening regardless. Auditing existing sequences for wrong links would have been duplicate work on top of the rebuild. Clean nuke is only ~2 hours more total active work and produces a sharper brand surface.

**Phases:**

1. **Backup** *(me, solo via Chrome MCP, ~30 min)* — export every Kartra sequence's emails to Dropbox markdown so the historical record exists even after deletion.
2. **Build new** *(hybrid, ~3–4 hrs)* — 40 emails drafted as markdown across 5 funnels. First sequence (Acne Decoded, ~7 emails) built into Kartra as the AU-template proof; remainder paste-in by Bernadette or me.
3. **Wire triggers** *(Bernadette, ~30 min)* — point each opt-in tag's automation at the new sequence. Update Kartra checkout post-purchase redirects to new-site `/courses/<slug>/thanks`.
4. **Migrate mid-sequence leads** *(me, Chrome MCP, ~15 min)* — re-apply trigger tag to anyone currently mid-old-sequence so they re-enrol on email 1 of the new sequence rather than getting silently dropped.
5. **Nuke old** *(me, Chrome MCP, ~45 min)* — delete old sequences (Phase 1 backup is the safety net), replace old Kartra-hosted sales-page content with "we've moved" + JS redirect to new-site equivalent, archive (don't delete) old broadcast templates.

**No sender warm-up** — `aunlock.co.uk` is already verified and engaged-list-warm. Switching SMTP provider from Kartra's mailer to Resend (per SETUP.md Step 4) doesn't reset reputation; it just adds another sender on the same verified domain.

**Calendar to launch:** 3–4 days from greenlight, ~6 hours total active work split across me + Giles + Bernadette.

**Critical-path items still on Bernadette regardless of phasing:**
- Real Kartra checkout URLs for all 5 paid courses (replaces `kartraUrl` placeholders in `lib/courses.ts`)
- Verify the 5 `// TODO: confirm` Kartra mappings in `lib/kartra-mappings.ts`
- Create 2 new Kartra lists/tags: "Skin Specialist Programme Buyers" + "The Skin Specialist Mini"
- Approve the 40 nurture-email drafts before they go into Kartra

**Clinical review of 29 Claude-drafted lessons is OUT of the launch gate** — moved to post-launch with a Claude pre-review pass mitigating risk. Skin Specialist Programme + RAG modules 2–9 are the highest-liability subsets and should get the pre-review pass before going public regardless.

---

## 13. Free-taster delivery model — auto-enrol on opt-in *(decided 2026-04-30)*

When a user opts in to a free taster, the funnel **auto-creates a Supabase shadow account + memberships row** for that free course, and the welcome email contains a Supabase-generated magic-link that drops them straight into Lesson 1 of the members area. Free-taster content lives at `/members/courses/free-<slug>/<lesson>` — the same surface paid courses use.

**Why Option B (auto-enrol) over Option A (email-only delivery):**
- Members area is the brand surface we've built; free-taster is the bridge
- Site analytics (Plausible `lesson_view` events) capture engagement
- Free → paid upsell happens naturally inside the dashboard, not via "click another email"
- Simpler mental model: every course (free or paid) has the same access pattern

**Code changes required (~1.5 hrs):**

| File | Change |
|---|---|
| `app/api/subscribe/route.ts` | After `addLead()`, use Supabase admin client to: createUser(email, email_confirm:true); upsert membership row {course_slug, active:true}; generateLink({type:'magiclink', redirectTo:`/members/courses/<slug>/<first-lesson>`}); pass the link URL to Kartra as a custom field on the lead |
| `lib/kartra.ts` `addLead()` | Add optional `customFields` parameter so the magic-link URL can be attached to the Kartra lead |
| Kartra welcome email (E1 of each sequence) | Reference `{custom_field_magic_link_url}` token in the CTA |
| Supabase project settings | Extend magic-link expiry to 24 hours (sit-in-inbox tolerance) |
| `OptInForm.tsx` success copy | Update *"Check your inbox"* to reference the immediate-access framing |

**Magic-link defaults (load-bearing):**
- Redirects to **lesson 1 of the free taster**, not /members dashboard (drop them straight into content)
- **24-hour expiry** (default 1h is too short for "I'll read this tonight")
- Falls back to `/login` with email pre-filled if expired

**Paid course flow is unchanged.** Auto-enrol only fires on free-taster opt-ins. Paid-course access still flows via Kartra checkout → IPN → memberships row → magic-link sign-in. The pending_memberships gap (IPN fires before user has signed in) is a separate fix.

**Security note:** auto-creating a Supabase user without email-ownership confirmation is safe because the magic-link in the welcome email IS the email-ownership proof — no one but the real owner can sign in. Honeypot in OptInForm catches obvious bots; rate-limiting can be added later if abuse appears.

### 13.1 In-dashboard free-course enrolment *(decided 2026-04-30)*

Existing signed-in members must be able to start a free taster from inside the dashboard *without* breaking the Kartra nurture loop. If they click a free-course tile and bypass the public-side OptInForm, they bypass `/api/subscribe`, which means no Kartra list/tag application, which means no nurture sequence, which means the upsell never fires.

**Fix:** the public OptInForm needs an authenticated equivalent invoked from inside `/members`.

```
/members dashboard → click "Start free course" on tile
  ↓
POST /api/members/enrol-free  { courseSlug }
  ↓
1. Read user's email + first_name from current Supabase session
2. Kartra: addLead() with the SAME optInListName + optInTagName
   the public form uses → SAME nurture sequence fires
3. Supabase: upsert memberships row {course_slug, active:true}
4. Redirect to /members/courses/free-<slug>/<first-lesson>
```

**Critical property:** same Kartra tag, same automation. Public-form opt-in and in-dashboard "Start" are functionally identical from Kartra's perspective. Upsell behaviour is identical.

**Dashboard tile states:**
- Paid owned → "Continue" (unchanged)
- Free already-enrolled → "Continue" (unchanged)
- **Free not yet enrolled → "Start free course" button** (new)
- Paid not-owned → "Buy" → Kartra checkout (unchanged)

**Effort:** ~1 hour on top of the §13 Option B work. New `/api/members/enrol-free` route (~30 min) + dashboard tile component update (~30 min). Reuses existing `addLead` and `getKartraMapping` helpers.

**Email cadence consideration:** a member who starts multiple free tasters back-to-back ends up on multiple parallel nurture sequences. Not a launch blocker — Bernadette can add a Kartra-side global send-rate cap if email-fatigue complaints surface. Ship without cap, watch the data.

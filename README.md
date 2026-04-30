# Aesthetics Unlocked, au-website

The members platform for **Aesthetics Unlocked**, the UK aesthetics-education brand built by Bernadette Tobin RN MSc, Educator of the Year 2026 Nominee.

This Next.js 16 app powers:

- The public marketing site (`/`, `/courses`, `/about`, `/blog`, `/dashboard`, `/testimonials`)
- 11 course landing pages with structured-data SEO and per-course Open Graph share cards
- The Aesthetics Unlocked Journal at `/blog`, with per-post Open Graph cards, JSON-LD structured data including author Person + per-citation CreativeWork, sitemap and RSS feed
- Email opt-in capture for free tasters with Kartra automation
- Magic-link / OTP sign-in for paid members (Supabase Auth, branded template, custom SMTP via Resend on the `aunlock.co.uk` sender domain)
- The native course-lesson player at `/members/courses/<slug>/<lesson>`
- Per-course entitlement gating with two backdoor mechanisms (owner allowlist + preview token)
- Privacy-friendly conversion tracking via Plausible

**Live holding site:** https://au-website-one.vercel.app
**Repo:** https://github.com/Gfuncstar/au-website (auto-deploys main on push)

---

## Quick start

```bash
cd au-website
npm install
npm run dev
# open http://localhost:3000
```

Without env vars set, the dashboard runs in **MOCK mode** against `lib/kartra/mock.ts` (a realistic fixture for a UK aesthetic practitioner). The moment you set the Supabase + Kartra env vars (see [SETUP.md](./SETUP.md)), the app flips to LIVE mode.

---

## Course catalogue

Currently on the platform, all live, all rendering at `/courses/<slug>`:

| Course | Slug | Price | Status |
|---|---|---|---|
| Acne Decoded | `acne-decoded` | £79 | Available |
| Rosacea Beyond Redness | `rosacea-beyond-redness` | £79 | Available |
| The Skin Specialist™ Programme | `skin-specialist-programme` | £399 | Available |
| The RAG Pathway (From Regulation to Reputation™) | `rag-pathway` | £499 *(placeholder)* | Available |
| The 5K+ Formula™ | `5k-formula` | £1,199 | Available |
| Free 3-Day Startup Mini *(5K+ taster)* | `free-3-day-startup` | Free | Available |
| Free 2-Day RAG Mini *(RAG taster)* | `free-2-day-rag` | Free | Available |
| Free Acne Decoded Mini | `free-acne-decoded` | Free | Available |
| Free Rosacea Beyond Redness Mini | `free-rosacea-beyond-redness` | Free | Available |
| The Skin Specialist™ Mini | `free-skin-specialist-mini` | Free | Available |
| The England Aesthetic Compliance Audit *(RAG Pathway taster)* | `free-clinical-audit` | Free | Available |

The single source of truth is `lib/courses.ts`. Adding a course means adding one entry to the `COURSES` array and dropping markdown into `content/courses/<slug>/`. Every consumer (catalogue, individual sales page, sitemap, schema, OG image, members launchpad) updates automatically.

---

## Where the lesson content lives

Two sources, kept in sync:

1. `au-website/content/courses/<slug>/NN-<lesson-slug>.md` — what the deployed site reads
2. `clone-aesthetics-unlocked/content/courses/<slug>/NN-<lesson-slug>.md` — the authoring source-of-truth (sibling repo)

Edits should be made in the clone repo first, then synced into au-website. The lesson player reads the .md frontmatter for title / order / icon / duration / summary and renders the body through `remark` + custom transforms in `lib/courseLessons.ts`.

---

## Owner access (backdoor mechanisms)

**Owner email allowlist** — `lib/owner-emails.ts` lists `giles@hieb.co.uk` and `ber.parsons@outlook.com`. When either signs in, they:

- Bypass the per-course entitlement check (read any lesson)
- Get a synthesised full-catalogue membership list on the dashboard (every course tile visible)

**Preview-link token** — set `AU_PREVIEW_TOKEN` in Vercel env. Anyone with `?preview=<TOKEN>` on a URL gets a 7-day cookie that bypasses both auth and entitlement. Used to share previews with reviewers who don't have accounts.

See [PROJECT-STATE.md](./PROJECT-STATE.md) for the full story on access mechanisms.

---

## Going to production

See [SETUP.md](./SETUP.md) for the full launch sequence — Supabase setup, Kartra credentials + IPN webhook, SMTP via Resend, member backfill, and Plausible analytics.

---

## Key conventions

- **No em-dashes in user-visible copy. Ever.** Hard save, project-wide. Replace with comma, period, "and", or colon. Em-dashes are an AI-cadence tell and Giles has banned them site-wide. Includes JSX strings, `lib/courses.ts`, `lib/faqs.ts`, `lib/locations.ts`, `content/blog/*.md`, `content/courses/**/*.md`, page metadata, OG titles, alt text. Code comments and JSDoc are exempt.
- **Never abbreviate Aesthetics Unlocked to AU** in user-facing copy or comments
- **No rounded-full corners anywhere**, max `rounded-[5px]`
- **Lesson hero is always dark mode** (charcoal poster with white type)
- **No drop caps in lesson body**
- **Lato body, Spectral italic for pull quotes**, but never Spectral italic on white inside the course player
- **No gradients, drop shadows, or glassmorphism** in any component or illustration
- **Pink #e697b7 is the brand accent**, used sparingly, never as background

These conventions are documented in `clone-aesthetics-unlocked/brand.md`, in `CLAUDE.md`, and in the user's memory (`feedback_no_ai_slop.md`, `feedback_aesthetics_unlocked_naming.md`, etc.). Apply them to every new component, page, or piece of copy.

---

## Repository structure

```
au-website/
├── app/                          # Next.js App Router
│   ├── courses/
│   │   ├── [slug]/page.tsx       # Course sales/landing pages
│   │   └── [slug]/thanks/page.tsx# Post opt-in / post purchase confirmation
│   ├── members/
│   │   ├── layout.tsx            # Members area shell (nav + footer)
│   │   ├── page.tsx              # Dashboard launchpad
│   │   └── courses/[slug]/[lesson]/page.tsx  # Lesson player
│   ├── api/
│   │   ├── subscribe/route.ts    # Free-taster opt-in → Kartra addLead
│   │   ├── auth/                 # Supabase OTP login + verify
│   │   └── kartra/ipn/route.ts   # Kartra IPN webhook
│   ├── login/page.tsx
│   └── layout.tsx                # Root layout + PlausibleScript
├── components/
│   ├── OptInForm.tsx             # Email capture for free tasters
│   ├── PlausibleScript.tsx       # Analytics script loader
│   ├── members/                  # Members-area chrome
│   └── ...
├── content/
│   └── courses/<slug>/NN-*.md   # Lesson markdown
├── lib/
│   ├── courses.ts                # COURSES catalogue (source of truth)
│   ├── courseLessons.ts          # Markdown → HTML rendering
│   ├── kartra.ts                 # Server-side Kartra API client
│   ├── kartra/                   # Lead/membership types + mock fixture
│   ├── kartra-mappings.ts        # Course slug → Kartra list/tag names
│   ├── owner-emails.ts           # Platform-owner allowlist
│   ├── entitlements.ts           # Per-course access check
│   ├── analytics.ts              # Plausible track() + trackServer()
│   └── supabase/                 # Auth + admin client helpers
├── middleware.ts                 # Auth gate + preview-token mechanism
├── public/
│   └── illustrations/            # Course illustrations + prompts.md
├── scripts/
│   └── backfill-memberships.ts   # One-off Kartra → Supabase migration
├── supabase/
│   ├── migrations/0001_init.sql  # Schema (members, memberships, lesson_progress)
│   └── email-templates/magic-link.html  # AU-branded magic-link email
├── .claude/
│   └── skills/au-course-illustrations/SKILL.md  # Illustration prompt skill
├── PROJECT-STATE.md              # Full state-of-build documentation
├── SETUP.md                      # Production launch instructions
├── README.md                     # This file
├── AGENTS.md                     # Next.js 16 quirks for agents
└── CLAUDE.md                     # Claude Code project context
```

For the full state of every course, every backdoor, every pending task, see [PROJECT-STATE.md](./PROJECT-STATE.md).

@AGENTS.md

# Aesthetics Unlocked — project context for Claude

## What this project is

Members platform + marketing site for **Aesthetics Unlocked**, a UK aesthetics-education brand by **Bernadette Tobin RN MSc** (Educator of the Year 2026 Nominee). Repo deploys to Vercel on push: https://au-website-one.vercel.app — backed by GitHub `Gfuncstar/au-website`.

## Where to look first

- **Catalogue + course copy:** `lib/courses.ts` is the single source of truth. Every page, sitemap entry, schema.org payload, OG image, and members launchpad reads from this file.
- **Lesson markdown:** `content/courses/<slug>/NN-<lesson>.md`. The deployed site reads from here. The authoring source-of-truth is the sibling `clone-aesthetics-unlocked` repo — keep both in sync.
- **Lesson rendering pipeline:** `lib/courseLessons.ts` (markdown → HTML with custom transforms for callouts, section bands, mobile-friendly tables).
- **Kartra integration:** `lib/kartra.ts` is the real API client; `lib/kartra/client.ts` is the dashboard-data abstraction; `lib/kartra-mappings.ts` is the slug → list/tag name lookup.
- **Auth + access:** `middleware.ts` protects `/members/*`, `lib/entitlements.ts` is the per-course gate, `lib/owner-emails.ts` is the platform-owner allowlist.
- **Brand voice + style:** `clone-aesthetics-unlocked/brand.md` (full audit). Quick rules in the README of this repo.

## Current course catalogue (10 courses)

| Slug | Type | Price | Status |
|---|---|---|---|
| `acne-decoded` | Paid clinical | £79 | Available |
| `rosacea-beyond-redness` | Paid clinical | £79 | Available |
| `skin-specialist-programme` | Paid clinical (premium) | £399 | Available |
| `rag-pathway` | Paid regulatory | £499 *(placeholder — confirm with Bernadette)* | Available |
| `5k-formula` | Paid business | £1,199 | Available |
| `free-3-day-startup` | Free taster → 5K+ | Free | Available |
| `free-2-day-rag` | Free taster → RAG | Free | Available |
| `free-acne-decoded` | Free taster → Acne | Free | Available |
| `free-rosacea-beyond-redness` | Free taster → Rosacea | Free | Available |
| `free-skin-specialist-mini` | Free taster → Skin Specialist | Free | Available |

Free tasters use `upsellsTo` + paid courses use `freeTasterSlug` to express the funnel pairing.

## Modes

- **MOCK mode** — Supabase env vars unset. Dashboard renders against `lib/kartra/mock.ts` (a fully-populated fictitious member). Useful for dev / preview.
- **LIVE mode** — Supabase configured. Auth enforced at `/members/*`, entitlement gate runs in lesson player.

## Backdoor access

1. **Owner email allowlist** (`lib/owner-emails.ts`): `giles@hieb.co.uk` + `ber.parsons@outlook.com`. Bypasses entitlement + sees full catalogue on dashboard.
2. **Preview token**: set `AU_PREVIEW_TOKEN` env var. Hit any URL with `?preview=<token>` → 7-day cookie bypasses auth + entitlement.

## Hard constraints

- **No em-dashes (—) in user-visible copy. Ever.** Hard save, project-wide. Replace with comma, period, "and", or colon. Em-dashes are an AI-cadence tell and Giles has banned them site-wide. Includes JSX strings, `lib/courses.ts`, `lib/faqs.ts`, `lib/locations.ts`, `content/blog/*.md`, `content/courses/**/*.md`, page metadata, OG titles, alt text. Code comments and JSDoc are exempt (developer-facing). See `feedback_no_ai_slop.md` in the user's memory for the full ban list (also covers "not just X, Y" formulas, hedge words, ChatGPT-default vocabulary).
- **Never abbreviate "Aesthetics Unlocked"** to "AU" in user-visible content (lessons, captions, copy, marketing). Full name everywhere. (Per `feedback_aesthetics_unlocked_naming.md` in the user's memory.)
- **No rounded-full corners anywhere.** Max `rounded-[5px]`.
- **Lesson hero is always dark mode.** Charcoal poster, white type, pink accents.
- **No drop caps in lesson body.**
- **No Spectral italic on white inside the course player.** Lato only.
- **Course CTAs are always square.** `rounded-[5px]`, never pill.
- **Pink `#e697b7` is the brand accent.** Used sparingly, never as background.
- **No gradients, drop shadows, glassmorphism.** Anywhere.

## Naming conventions

- Course slugs: kebab-case, no abbreviations (`free-acne-decoded`, not `free-acne`)
- Lesson files: `NN-<slug>.md` where NN is a 2-digit order (`01-introduction.md`)
- Trademarks: ™ on first mention per page (`The 5K+ Formula™`, `From Regulation to Reputation™`, `UNLOCK PROFIT™`, `The Skin Specialist™`)

## Voice

Two distinct registers, both Bernadette's:

- **Marketing voice** (sales pages, broadcasts, social): calm, direct, short sentence pairs. Never hype. Examples: *"Compliance gets you open. Reputation keeps you in business."*
- **Course-content voice** (inside lessons): warmer, mentor-tutor, confessional openers. Same authority, different temperature.

When writing new copy, match the surface: marketing pages get marketing voice; lesson body gets course voice.

**Voice ban list (hard save).** Never use em-dashes, "not just X but Y" formulas, hedge words ("arguably", "perhaps"), or ChatGPT-default vocabulary (delve, tapestry, harness, robust, vibrant, cutting-edge, elevate, streamline, leverage, synergies, dynamic, seamlessly, innovative, navigate as a metaphor, unlock potential, embark on a journey, in today's fast-paced world, ever-evolving landscape). If a draft contains any of these, treat it as unfinished and rewrite before showing Giles. Full rationale in `feedback_no_ai_slop.md` in the user's memory.

## What's not yet done (pending tasks)

See `PROJECT-STATE.md` for the full punch list. Major items:

- Bernadette has not reviewed any of the lessons authored by Claude in recent sessions (rag-pathway 8 modules, free-acne-decoded 3, free-rosacea 3, free-3-day-startup days 1-3, skin-specialist-programme 10, skin-specialist-mini 4 — total 29 lessons authored, 0 clinically reviewed)
- No video on any lesson (placeholder component renders)
- No audio intros (placeholder component renders)
- Course illustrations: prompts written for acne-decoded only; PNG generation by AU team in Midjourney / DALL-E
- Kartra list/tag names need verification against the live Kartra dashboard
- SMTP provider not yet wired (Resend recommended; instructions in SETUP.md Step 4)
- Plausible domain env var not set
- Member backfill script not yet run

## When the user asks for changes

Default to:
1. **Edit `lib/courses.ts`** for catalogue / pricing / availability changes — never touch sales-page templates directly
2. **Edit lesson markdown in BOTH locations** (au-website + clone-aesthetics-unlocked)
3. **Verify with `npx tsc --noEmit`** before committing
4. **Commit with a clear message** referencing the user's intent
5. **Push to main** — Vercel auto-deploys in ~90 seconds
6. **Confirm the URL renders** with curl or WebFetch before declaring done

For larger features, use `TodoWrite` to track the work.

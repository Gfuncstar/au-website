# SETUP — going live

This site has all the auth + entitlement code in place. Until you
do the steps below, it runs in **MOCK mode** (renders against
`MOCK_LEAD`, no real sign-in or paywall). The moment you set the
env vars in step 2, it flips to **LIVE mode** automatically.

Estimated total time: **30–45 minutes**.

For the **full state of every course, every backdoor, every pending
task**, see [`PROJECT-STATE.md`](./PROJECT-STATE.md).
For repo overview + conventions, see [`README.md`](./README.md).
For Claude project context, see [`CLAUDE.md`](./CLAUDE.md).

---

## Current course catalogue (10 courses)

All 10 are live on the holding site, all rendering at `/courses/<slug>`:

| Course | Price | Status |
|---|---|---|
| Acne Decoded | £79 | ✅ Available |
| Rosacea Beyond Redness | £79 | ✅ Available |
| The Skin Specialist™ Programme | £399 | ✅ Available |
| The RAG Pathway | £499 *(placeholder)* | ✅ Available |
| The 5K+ Formula™ | £1,199 | ✅ Available |
| 5 free tasters (one per paid course) | Free | ✅ All available |

The catalogue is data-driven from `lib/courses.ts` — adding a course is one entry there + lesson markdown in `content/courses/<slug>/`.

## Required env vars (full list)

| Variable | Required for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | LIVE auth | Step 3 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | LIVE auth | Step 3 |
| `SUPABASE_SERVICE_ROLE_KEY` | IPN webhook + backfill | Step 3 |
| `KARTRA_APP_ID` | Kartra API | Step 5 |
| `KARTRA_API_KEY` | Kartra API | Step 5 |
| `KARTRA_API_PASSWORD` | Kartra API | Step 5 |
| `KARTRA_IPN_SECRET` | IPN webhook | Step 5 |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Conversion tracking | Step 7 (optional) |
| `AU_PREVIEW_TOKEN` | Preview-link backdoor | Optional — see PROJECT-STATE.md §4 |

---

---

## Step 1 — create a Supabase project (5 min)

1. Go to https://supabase.com/dashboard, sign in / sign up
2. **New project** → name it `aesthetics-unlocked`, pick the EU (Ireland)
   region (closest to UK members), set a strong database password
   (save it in 1Password — you'll need it once if you ever debug
   the database directly)
3. Wait ~2 minutes for the project to provision

## Step 2 — run the migration (3 min)

1. In your new Supabase project, open the **SQL Editor** in the
   left sidebar
2. Click **New query**
3. Paste the entire contents of
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
4. Click **Run**

You should see "Success. No rows returned." Three tables are now
created — `members`, `memberships`, `lesson_progress` — with RLS
policies and an auto-create trigger on `auth.users`.

## Step 3 — copy the Supabase env vars into Vercel (5 min)

In Supabase dashboard → **Project Settings → API**, copy:

- **Project URL** → goes into `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → goes into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role secret** key → goes into `SUPABASE_SERVICE_ROLE_KEY`
  *(this one is secret — never commit it; never put it in a
  `NEXT_PUBLIC_*` var)*

Then in Vercel:

```bash
cd au-website
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

When prompted, paste the value and apply to **all three** environments
(Production, Preview, Development).

Or use the Vercel dashboard → Project → Settings → Environment
Variables and add them via the UI.

After this step, the next deploy will run in LIVE mode.

## Step 4 — configure Supabase Auth (5 min)

In Supabase dashboard → **Authentication → URL Configuration**:

- **Site URL**: `https://aestheticsunlocked.co.uk`
  *(production target. Until DNS is pointed at Vercel, temporarily use
  `https://au-website-one.vercel.app`.)*
- **Redirect URLs** (add all three):
  - `https://aestheticsunlocked.co.uk/api/auth/callback`
  - `https://au-website-one.vercel.app/api/auth/callback`
  - `http://localhost:3000/api/auth/callback`

In **Authentication → Providers → Email**:

- Enable **Email** (already on by default)
- Disable **"Confirm email"** *(magic link is the confirmation —
  the second email step is friction)*
- **Magic link expiry**: 900 seconds (15 minutes) — matches the UI copy

In **Authentication → Email Templates → Magic Link**:

- Replace Supabase's default template with the AU-branded version
  in [`supabase/email-templates/magic-link.html`](supabase/email-templates/magic-link.html)
  — short, dark-poster aesthetic, single CTA. Copy-paste into the
  Supabase template editor.
- Set **Subject heading** to `Your Aesthetics Unlocked sign-in link`

### SMTP — REQUIRED before launch

Supabase's built-in mailer rate-limits at **3 emails/hour** — fine
for setup, but a single launch broadcast or a busy day of opt-ins
will blow through it instantly. Wire a real SMTP provider before
the doors open.

**Recommended: Resend.** Cleanest DX for Next.js + Vercel projects,
3,000 emails/month free, then ~£15/mo for 50k. UK-friendly, fast
deliverability, and the API surface Supabase Auth speaks to is just
SMTP credentials — no app code changes required.

1. Sign up at [resend.com](https://resend.com) and verify the
   `aunlock.co.uk` sending domain. **Important:** the website lives on
   `aestheticsunlocked.co.uk` but Bernadette sends email from
   `hello@aunlock.co.uk` (shorter, easier to say). The `aunlock.co.uk`
   domain is **already verified and sending from Kartra**, so you're
   adding Resend's DKIM selector + SPF include alongside Kartra's
   existing records, not setting up cold. Multiple SPF includes in one
   TXT record are valid; DKIM uses different selectors so Kartra and
   Resend coexist. Takes ~10 minutes including propagation. No sender
   warm-up window required.
2. In Resend → **API Keys → Create API Key**, name it
   `supabase-auth-smtp`. Copy the key (starts `re_...`).
3. In Supabase dashboard → **Project Settings → Auth → SMTP Settings**,
   toggle **Enable Custom SMTP** and enter:

   ```
   Sender email:   hello@aunlock.co.uk
   Sender name:    Aesthetics Unlocked
   Host:           smtp.resend.com
   Port:           587
   Username:       resend
   Password:       <your re_... API key>
   Minimum interval: 60 seconds (default is fine)
   ```

   The two-domain split is intentional: descriptive website
   (`aestheticsunlocked.co.uk`), memorable email (`aunlock.co.uk`).
   See PROJECT-STATE.md §1.

4. Click **Save**. Send yourself a magic-link sign-in to confirm
   delivery in under 10 seconds.

**Alternatives:** Postmark (£10/mo, best deliverability for
transactional, slower onboarding) or Mailgun (cheapest at scale,
clunkier dashboard). Resend is the lowest-friction choice — switch
later if you outgrow it.

## Step 5 — Kartra credentials + IPN webhook (10 min)

In **Kartra → Settings → Integrations → My API**:

1. Click **Create New App**, name it "Aesthetics Unlocked Members Site"
2. Copy the three credentials Kartra generates:
   - `app_id` → `KARTRA_APP_ID` env var
   - `api_key` → `KARTRA_API_KEY` env var
   - `api_password` → `KARTRA_API_PASSWORD` env var
3. Add them to Vercel via `vercel env add` or the dashboard

In **Kartra → Settings → Integrations → My API → Outbound API**:

1. Click **Add new IPN URL**
2. Pick a strong random secret (e.g. paste 32 random characters)
   and add it as `KARTRA_IPN_SECRET` in Vercel
3. Set the URL to:
   `https://au-website-one.vercel.app/api/kartra/ipn?key=<KARTRA_IPN_SECRET>`
4. Subscribe to these events (others can stay disabled at v1):
   - `membership_granted`
   - `membership_revoked`
   - `subscription_cancelled`
5. Save

Test the webhook by manually granting yourself a membership in
Kartra → check the Vercel function logs at
`https://vercel.com/giles-projects-b3d2a63d/au-website/_logs` and
confirm a 200 response. Cross-check the Supabase `memberships`
table — your row should be there with `active = true`.

## Step 6 — backfill existing members (one-off, 5 min)

If Bernadette has existing paying members in Kartra, the IPN
webhook only catches *future* events. To populate `memberships`
with existing entitlements, run the backfill script:

1. In Kartra, export the customer list (any list with `email` column
   works) to CSV, save anywhere readable.
2. Make sure `.env.local` in `au-website/` has all of:
   `KARTRA_APP_ID`, `KARTRA_API_KEY`, `KARTRA_API_PASSWORD`,
   `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
3. Dry-run first (no writes):

   ```bash
   cd au-website
   npm install        # picks up tsx if not already installed
   npm run backfill -- ~/Downloads/kartra-leads.csv --dry-run
   ```

4. Review the output. If it looks right, drop `--dry-run`:

   ```bash
   npm run backfill -- ~/Downloads/kartra-leads.csv
   ```

The script throttles to 1 request/sec (well under Kartra's 60/min
cap), is idempotent (safe to re-run), and skips members who
haven't yet signed in via Supabase Auth — those land via the
trigger on first sign-in.

## Step 7 — analytics (5 min, optional but strongly recommended)

Conversion tracking is wired into Plausible. Without it set up, the
funnel stages (opt-in submit, opt-in success, sign-in, lesson
view, course purchase, course revoke) all silently no-op — the
code is there, just dormant.

1. Sign up at [plausible.io](https://plausible.io) (~£9/mo flat,
   UK-friendly, no cookie banner needed). Add your domain
   (`aestheticsunlocked.co.uk`).
2. In Vercel → Project Settings → Environment Variables, add:

   ```
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=aestheticsunlocked.co.uk
   ```

3. Redeploy. Plausible's script auto-loads, custom events start
   firing on the next user interaction.
4. In the Plausible dashboard, set up custom-event goals for:
   `opt_in_submit`, `opt_in_success`, `sign_in_success`,
   `lesson_view`, `course_purchase`. The funnel breakdown then
   surfaces conversion rates between each stage.

If you'd rather use PostHog or Google Analytics, the call sites
already exist (search `track(` or `trackServer(`) — swap the
implementation in `lib/analytics.ts` and you're done.

## Step 7 — first end-to-end test

1. In Supabase Auth → Users → **Add user** → enter your own email
2. Manually insert a membership row via the SQL editor:

   ```sql
   insert into public.memberships (member_id, course_slug, level_name, active)
   select id, 'acne-decoded', 'Lifetime', true
   from public.members where email = 'your.email@here';
   ```

3. Visit https://au-website-one.vercel.app/login → enter your email
4. Check inbox → click magic link → land on /members
5. Click into Acne Decoded → should reach the lesson player
6. Visit `/members/courses/rosacea-beyond-redness` directly →
   should bounce to `/courses/rosacea-beyond-redness` (entitlement
   gate working)

## What's NOT live at v1 (intentional)

- **Lesson progress** is localStorage-only. Per-device, not per-account.
  v2 migrates to the `lesson_progress` Supabase table once the
  authed-write path is wired into the React hook.
- **Account edits** (`/members/account`) save to Supabase only —
  not pushed back to Kartra. v2 wires `kartra.editLead` to mirror
  changes. Until then, profile edits are dashboard-local.
- **Billing** (`/members/billing`) is read-only against `MOCK_LEAD`.
  v2 wires real Kartra `get_recurring_subscriptions` +
  `cancel_recurring_subscription`.
- **Activity** (`/members/activity`) is mock-only. v2 syncs
  Kartra's transactions / sequences buckets.
- **Audio intros** (lesson player) show "Coming soon" — v2 wires
  Bernadette's m4a uploads.
- **Video** is a placeholder frame — v2 swaps in Mux.

The lesson player itself is fully functional in LIVE mode: members
sign in, the entitlement gate runs, and they can read every lesson
they own. That's the v1 launch surface.

---

## Troubleshooting

**"Sign in isn't fully configured yet"** — env vars missing or wrong.
Check `vercel env ls` shows all three Supabase vars.

**Magic link arrives but lands on /login?error=link_expired** — the
Site URL in Supabase Auth doesn't match where Vercel served the
page. Re-do step 4.

**IPN endpoint returns 401** — `KARTRA_IPN_SECRET` doesn't match the
`?key=` in the URL Kartra is calling. Re-do step 5.

**Member can sign in but every course bounces them to the sales page**
— Their email isn't in `public.members` and/or no row in
`public.memberships`. Either (a) Kartra hasn't fired an IPN for them
yet (manually grant + revoke + grant in Kartra to fire one), or
(b) backfill not done — see step 6.

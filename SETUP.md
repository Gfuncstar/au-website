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

## Step 4 — configure Supabase Auth ✅ DONE (2026-04-30)

This step is complete. Both the URL configuration and the SMTP wiring
are live. The detail below stays as a reference for future setup work
or for re-doing this on a fresh Supabase project.

> ⚠️ **2026-05-02 — known deliverability issue with Resend → Outlook/Hotmail.**
> A Hotmail member's first-ever sign-in code took ~20 minutes to land
> (classic Microsoft greylisting of new senders). Resend → Microsoft is
> reliable for repeat recipients but unreliable for first-touch on the
> world's most popular consumer mailbox. Migration runbook to fix this
> below in **Step 4b** — keep Resend for marketing, switch auth-only
> emails to Postmark.

## Step 4b — migrate auth-only email to Postmark (recommended, ~30 min + ~£12/mo)

**Why split providers:** marketing emails and transactional (sign-in /
receipt) emails are different jobs. Marketing has higher spam-complaint
and bounce rates, which damages sender reputation. If both flow through
one provider on one sender domain, the marketing reputation drags down
the auth reputation and sign-in codes start hitting spam. The
industry-standard fix is to isolate: Postmark for auth-only,
Resend stays for everything else.

**Why Postmark specifically:** purpose-built for transactional. Their
Outlook/Hotmail deliverability is the best in the industry — sub-10
second delivery to Microsoft mailboxes in 99% of cases.

### 1. Sign up at Postmark (5 min)

1. Go to [postmarkapp.com](https://postmarkapp.com), create an account.
2. Pick the **10k Emails / month, $15** plan. Auth volume is well below
   this — overhead for receipts + the occasional re-send.
3. Inside the new account, the default server is fine. Rename it to
   `aunlock-auth` so it's obvious in dashboards.

### 2. Verify the `aunlock.co.uk` sending domain at Postmark (10 min)

Postmark's domain verification adds DKIM + Return-Path records. These
sit alongside the Resend records already on `aunlock.co.uk` — different
DKIM selectors mean both providers coexist cleanly without touching
Kartra's existing records.

1. **Postmark → Sending Domains → Add Domain** → enter `aunlock.co.uk`.
2. Postmark shows **DKIM** + **Return-Path** records to add at GoDaddy.
3. At GoDaddy DNS, **only ADD records, never replace existing ones**:
   - DKIM TXT on the selector Postmark provides (typically
     `<selector>._domainkey.aunlock.co.uk`)
   - Return-Path CNAME on `pm-bounces.aunlock.co.uk` (or whatever
     subdomain Postmark suggests)
   - Do **NOT** touch the existing Resend DKIM, Kartra DKIM, or apex MX
     — they stay exactly as they are.
4. Back in Postmark → **Verify** until both records show green.
   DNS propagation: usually under 5 minutes at GoDaddy.

### 3. Create a Postmark Server API Token (1 min)

1. Postmark → **Servers → aunlock-auth → API Tokens → Create Token**.
2. Name it `supabase-auth-smtp`, scope it Send-only.
3. Copy the token value (starts `<long string>`). Save somewhere safe —
   you only see it once.

### 4. Update Supabase Auth → SMTP Settings (3 min)

Supabase dashboard → **Project Settings → Auth → SMTP Settings**.
Replace the existing Resend SMTP values with Postmark's:

```
Sender email:   hello@aunlock.co.uk
Sender name:    Aesthetics Unlocked
Host:           smtp.postmarkapp.com
Port:           587
Username:       <your Postmark Server API Token>
Password:       <same — Postmark uses the token as both username and password>
Minimum interval: 60 seconds
```

Click **Save**. The change is live the moment Supabase accepts it.

### 5. Smoke-test (2 min)

1. Open an incognito browser, go to `/login`.
2. Enter a Hotmail or Outlook address you control.
3. Email should land in Primary inbox within 10 seconds. Code works as
   before.
4. Send to a Gmail address too — should land equally fast.

### 6. Keep Resend for everything else

Don't delete Resend or change anything else. Resend continues serving:
- All Kartra-driven nurture sequences
- Broadcast emails Bernadette sends
- Any future transactional volume that isn't auth (e.g. course-update
  notifications)

The split is intentional and is the long-term setup.

### 7. Update Resend's role in this doc

After migration, edit "What's live in Supabase right now" further down
to read **smtp.postmarkapp.com** instead of `smtp.resend.com`.

## Step 4c — extend session lifetime so members rarely re-auth (5 min)

By default Supabase issues a short-lived access token (1 hr) and a
long-lived refresh token. The refresh token's expiry is what actually
controls how often a member sees the OTP screen — set it generously
so a successful first sign-in keeps them in for ~3 months.

1. Supabase dashboard → **Authentication → Sessions** (or
   **Project Settings → Auth → Sessions** depending on UI version).
2. Set:
   - **Inactivity timeout**: `0` (never expire from inactivity), or
     `90 days` if you prefer a hard ceiling.
   - **Time-based session timeout**: `90 days` (or `0` = never).
3. **JWT expiry** can stay at default (3600s / 1 hr) — the access
   token auto-refreshes, members never see the 1-hr boundary.
4. Save.

Combined with the Postmark migration above, the front-door experience
becomes: a new member hits sign-in once, gets the code in <10 seconds,
and then doesn't see the OTP again for ~3 months.

### What's live in Supabase right now

In **Authentication → URL Configuration**:

- **Site URL**: `https://aestheticsunlocked.co.uk` *(stays correct after the
  DNS flip; while DNS is still pointed at Kartra, Supabase tolerates the
  mismatch because the redirect URLs list also covers the holding host)*
- **Redirect URLs** include all three:
  - `https://aestheticsunlocked.co.uk/api/auth/callback`
  - `https://au-website-one.vercel.app/api/auth/callback`
  - `http://localhost:3000/api/auth/callback`

In **Authentication → Providers → Email**:

- **Email** provider enabled
- **Confirm email** disabled (magic-link itself is the confirmation)
- **Magic link expiry**: 900 seconds (15 minutes), matching the `/login` UI
- **Email OTP length**: 6 digits, matching the `/login` form

In **Authentication → Email Templates → Magic Link**:

- AU-branded template from `supabase/email-templates/magic-link.html`
  pasted in
- Subject: `Your Aesthetics Unlocked sign-in link`

In **Project Settings → Auth → SMTP Settings**:

- Custom SMTP enabled
- Sender: `Aesthetics Unlocked <hello@aunlock.co.uk>`
- Host: `smtp.resend.com`, port 587, username `resend`, password is the
  Resend API key minted with Sending-only scope
- `aunlock.co.uk` is verified at Resend with DKIM + SPF alongside Kartra's
  existing records (Kartra's records were not touched, both services
  coexist via different DKIM selectors)

End-to-end smoke-tested 2026-04-30: sign-in code arrives in under 10
seconds, lands in Primary inbox, from-line reads
`Aesthetics Unlocked <hello@aunlock.co.uk>`, no "powered by Supabase"
footer, click-through and OTP entry both work.

### Reference: the original setup steps

Kept here in case the SMTP needs re-doing on a fresh Supabase project, or
if Resend credentials get rotated.

**Why a real SMTP provider:** Supabase's built-in mailer rate-limits at
**3 emails/hour**. Fine for setup but blows through that ceiling in any
real launch. The default mailer also sends from `noreply@mail.app.supabase.io`
with a "powered by Supabase" footer, which destroys deliverability and
reads as spammy.

**Recommended: Resend.** 3,000 emails/month free, ~£15/mo for 50k after
that. UK-friendly, fast deliverability, integrates with Supabase Auth via
plain SMTP credentials.

1. Sign up at [resend.com](https://resend.com) and verify the
   `aunlock.co.uk` sending domain. The website lives on
   `aestheticsunlocked.co.uk` but Bernadette sends email from
   `hello@aunlock.co.uk` (shorter, easier to say). The `aunlock.co.uk`
   domain is already verified at Kartra, so this is appending Resend's
   DKIM selector + SPF include alongside Kartra's existing records, not
   setting up cold. Multiple SPF includes in one TXT record are valid;
   DKIM uses different selectors so Kartra and Resend coexist. Takes
   about 10 minutes including DNS propagation. No sender warm-up window
   required.

   At GoDaddy DNS, **only ADD records, never replace existing ones**.
   The three to add are: a DKIM TXT on `resend._domainkey`, an MX on
   `send` for bounce routing (priority 10, `feedback-smtp.eu-west-1.amazonses.com`),
   and an SPF TXT on `send` (`v=spf1 include:amazonses.com ~all`).
   The optional fourth inbound-MX record from Resend should be skipped,
   since touching the apex MX would break Bernadette's existing inbound
   mail.

2. In Resend → **API Keys → Create API Key**, name it
   `supabase-auth-smtp`, scope it to **Sending access only**. Copy the key
   (starts `re_...`).
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
   delivery in under 10 seconds. Check Gmail's "Show original" view to
   confirm SPF, DKIM and DMARC all PASS.

**Alternatives:** Postmark (£10/mo, best deliverability for transactional,
slower onboarding) or Mailgun (cheapest at scale, clunkier dashboard).
Resend won on lowest setup friction.

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

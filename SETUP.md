# SETUP — going live

This site has all the auth + entitlement code in place. Until you
do the steps below, it runs in **MOCK mode** (renders against
`MOCK_LEAD`, no real sign-in or paywall). The moment you set the
env vars in step 2, it flips to **LIVE mode** automatically.

Estimated total time: **30–45 minutes**.

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

- **Site URL**: `https://au-website-one.vercel.app`
  *(or your custom domain when you point one at the Vercel project)*
- **Redirect URLs** (add both):
  - `https://au-website-one.vercel.app/api/auth/callback`
  - `http://localhost:3000/api/auth/callback`

In **Authentication → Providers → Email**:

- Enable **Email** (already on by default)
- Disable **"Confirm email"** *(magic link is the confirmation —
  the second email step is friction)*
- **Magic link expiry**: 900 seconds (15 minutes) — matches the UI copy

In **Authentication → Email Templates → Magic Link**:

- Replace Supabase's default template with the AU-branded version
  *(I can write you the HTML if you want — it should be short and
  match the dashboard's dark-poster aesthetic)*
- **From**: decide between `noreply@aestheticsunlocked.co.uk` and
  `hello@aunlock.co.uk`. Then in Supabase → Project Settings → SMTP
  point Supabase at your sending provider (Postmark / SendGrid /
  Mailgun — Supabase's default sender is fine for first 3 emails/hr
  but rate-limits hard, so you'll want a real SMTP provider before
  launch).

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
with existing entitlements, run a one-off backfill script.

I'll write that script when you're ready — it iterates Kartra's
`get_lead` for each member email and fires synthetic
`membership_granted` events into the IPN endpoint. Tell me when
you want it.

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

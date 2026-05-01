# Launch runbook — Aesthetics Unlocked

> **✅ EXECUTED 2026-05-01.** Site is live at https://www.aestheticsunlocked.co.uk. All 11 Kartra sequences are active, DNS flipped, SSL provisioned, Supabase migration applied, Plausible wired, Search Console verified. See [`LAUNCH-COMPLETE.md`](./LAUNCH-COMPLETE.md) for the canonical record of what shipped. This runbook is preserved as the original plan and rollback reference.

**Purpose:** the single document for launch day. Every step has the exact value to paste, the expected response, and a rollback. Aim is ~90 minutes start to finish, paste-and-press.

**Last updated:** 2026-05-01 (banner added on launch completion; runbook body is the 2026-04-30 plan)

**Pre-launch state confirmed by automated probe:**
- ✅ Site live at `https://au-website-one.vercel.app` (200 on /, /courses, /login)
- ✅ /members route gated (307 → /login)
- ✅ Kartra credentials valid (probe lead `probe@example.com` created successfully)
- ✅ IPN endpoint hardened (`KARTRA_IPN_SECRET` set in Vercel)
- ✅ `aunlock.co.uk` MX → Microsoft 365 (Bernadette's existing inbox stays untouched)
- ✅ `aestheticsunlocked.co.uk` currently DNS-pointed at Kartra hosting (will be repointed at Vercel during this runbook)
- ✅ Phase 2 (SMTP + email deliverability) **already complete as of 2026-04-30**, see Phase 2 below for the historical record. Sign-in emails currently go out from `Aesthetics Unlocked <hello@aunlock.co.uk>` via Resend. Step 2.1 to 2.3 do not need re-running on launch day.
- ⚠️ Latest commit on `origin/main`: [`45b32ef`](https://github.com/Gfuncstar/au-website/commit/45b32ef) (per-route OG fix + ★ glyph swap + bundled launch artefacts). Vercel auto-deploys.

---

## Phase 0 — pre-flight (~10 min, anytime before launch)

These can run any time. None affect production.

### 0.1 Apply migration 0002 to Supabase

In Supabase dashboard → **SQL Editor → New query** → paste the contents of [`supabase/migrations/0002_pending_memberships.sql`](supabase/migrations/0002_pending_memberships.sql) → Run.

Expected: *"Success. No rows returned."*

Verify: in **Table Editor**, `pending_memberships` exists with columns `id, email, course_slug, level_name, granted_at, active, kartra_membership_id, kartra_level_id`.

Rollback: `drop table public.pending_memberships;` then re-apply 0001 to restore the original trigger.

### 0.2 Set Supabase magic-link expiry to 24h

**Authentication → Email Templates → Magic Link → Expires in:** `86400` (seconds).

Default is 3600 (1 hour). 24h gives tolerance for "I'll read this tonight" opens. Welcome emails will still work even if the lead doesn't click for a day.

### 0.3 Create Kartra `magic_link_url` lead custom field

In Kartra → **Settings → Lead Custom Fields → New custom field**:

- **Name:** `Magic link URL`
- **Internal name:** `magic_link_url` *(case-sensitive, must match exactly)*
- **Type:** Text (long)
- **Visible to lead:** No

Without this, the auto-enrol code at `app/api/subscribe/route.ts` will store the magic-link on the lead and Kartra will silently ignore it.

### 0.4 Push the local commit (only step that touches production)

```bash
cd "01 AESTHETICS UNLOCKED/au-website"
git push origin main
```

Vercel auto-deploys in ~90s. Verify at <https://vercel.com/giles-projects-b3d2a63d/au-website> → most recent deployment is `c5563d8` *(or whatever HEAD is)* and status is **Ready**.

The new code is forward-compatible: until §0.3 is done, the magic-link generation runs but Kartra ignores the unknown custom field. No regression.

---

## Phase 1 — DNS flip (~15 min, the actual launch moment)

This is the moment the domain goes live. Everything before it is preparation; everything after is verification.

### 1.1 `aestheticsunlocked.co.uk` — point at Vercel

In Vercel → **Project Settings → Domains → Add** → enter `aestheticsunlocked.co.uk`. Vercel shows two records to add at the registrar.

In GoDaddy → **My Products → aestheticsunlocked.co.uk → DNS → Manage Zones**:

| Action | Type | Name | Current value | New value |
|---|---|---|---|---|
| **REPLACE** | A | `@` | `34.68.234.4` | `76.76.21.21` *(Vercel apex)* |
| **REPLACE** | CNAME | `www` | `aestheticsunlock.kartra.com` | `cname.vercel-dns.com` |
| **ADD** | TXT | *(per Vercel UI)* | — | *(per Vercel UI — domain-verification token)* |

Save changes. DNS propagation: 1–10 minutes typical (TTL 600s on existing records). Vercel's domain panel auto-detects.

**Verify:**

```bash
dig +short A aestheticsunlocked.co.uk            # expect: 76.76.21.21
dig +short CNAME www.aestheticsunlocked.co.uk    # expect: cname.vercel-dns.com.
curl -sI https://aestheticsunlocked.co.uk/ | head -1  # expect: HTTP/2 200
```

**Rollback if anything's wrong:** restore the apex A to `34.68.234.4` and the www CNAME to `aestheticsunlock.kartra.com` — site reverts to Kartra hosting in 1–10 minutes.

### 1.2 Update Supabase Auth Site URL + redirect URLs

In Supabase → **Authentication → URL Configuration**:

- **Site URL:** `https://aestheticsunlocked.co.uk`
- **Redirect URLs** (add all three, leave existing entries):
  - `https://aestheticsunlocked.co.uk/api/auth/callback`
  - `https://au-website-one.vercel.app/api/auth/callback` *(keep as fallback)*
  - `http://localhost:3000/api/auth/callback`

This makes magic-links generated after this point land on the production domain.

---

## Phase 2 — SMTP + email deliverability ✅ DONE (2026-04-30, ~30 min)

This phase is complete. Detail kept here as a historical record and as a
re-run script if Resend credentials ever rotate.

`aunlock.co.uk` is verified for sending across multiple providers (Microsoft
365 inbound, Kartra/SendGrid outbound, and now Resend outbound). Records
were added by appending, never replacing, so each provider keeps its own
DKIM selector and SPF include. Verified in Resend dashboard within ~17
minutes of save.

### 2.1 Sign up at Resend

<https://resend.com> → sign up → **Domains → Add Domain → `aunlock.co.uk`**.

Resend shows ~3 records to add. Below is the spec — verify against what the Resend UI actually shows on the day (their selectors can change).

### 2.2 Add Resend records to `aunlock.co.uk` (GoDaddy DNS)

**CRITICAL: ADD only. Never replace existing records on this domain — that would break Bernadette's inbound Outlook mail and existing Kartra/SendGrid sending.**

| Action | Type | Name | Value | Why |
|---|---|---|---|---|
| **ADD** | TXT | `resend._domainkey` | *(Resend's DKIM public key, one long string)* | DKIM signing for Resend |
| **ADD** | TXT | `send` *(or per Resend UI)* | `v=TXT1; ...` *(per Resend UI)* | Bounce-handling subdomain |
| **UPDATE** | TXT | `@` | `v=spf1 include:secureserver.net include:sendgrid.net include:spf.protection.outlook.com include:_spf.resend.net ~all` | Add Resend's SPF include alongside existing |

Current SPF (verified by `dig +short TXT aunlock.co.uk` 2026-04-30):
```
"v=spf1 include:secureserver.net include:sendgrid.net include:spf.protection.outlook.com ~all"
```

The change is exactly: insert `include:_spf.resend.net` before `~all`. Don't remove anything.

**Do NOT touch:**
- The `NETORG20083222.onmicrosoft.com` TXT (Microsoft 365 verification)
- The MX record `aunlock-co-uk.mail.protection.outlook.com` (Bernadette's inbound)
- The DMARC at `_dmarc.aunlock.co.uk` (`v=DMARC1; p=quarantine; ...`)

**Verify after propagation (~5 min):**

```bash
dig +short TXT aunlock.co.uk | grep resend       # expect: SPF including _spf.resend.net
dig +short TXT resend._domainkey.aunlock.co.uk   # expect: DKIM public key
```

In Resend → Domains → `aunlock.co.uk` → status should flip from "Pending" to **"Verified"**.

### 2.3 Wire Supabase Auth SMTP

In Supabase → **Project Settings → Auth → SMTP Settings → Enable Custom SMTP**:

```
Sender email:     hello@aunlock.co.uk
Sender name:      Aesthetics Unlocked
Host:             smtp.resend.com
Port:             587
Username:         resend
Password:         <re_... API key from Resend dashboard>
Minimum interval: 60 seconds
```

Save. Send yourself a magic-link from `https://aestheticsunlocked.co.uk/login` — should arrive within 10 seconds, sender showing "Aesthetics Unlocked <hello@aunlock.co.uk>".

---

## Phase 3 — Kartra final wire-up (~30 min, mostly Bernadette)

See [`BERNADETTE-PREFLIGHT.md`](BERNADETTE-PREFLIGHT.md) for the human-readable version of these. This section is the engineering view.

### 3.1 Kartra → 5 real checkout URLs

Bernadette pastes 5 URLs into [`lib/courses.ts`](lib/courses.ts) (one per paid course's `kartraUrl` field):

- `acne-decoded`
- `rosacea-beyond-redness`
- `skin-specialist-programme`
- `rag-pathway`
- `5k-formula`

Each is the URL of the Kartra checkout page she's already configured for that product.

After paste: `git commit -m "launch: real Kartra checkout URLs for paid courses"` → push.

### 3.2 Verify Kartra mappings

[`lib/kartra-mappings.ts`](lib/kartra-mappings.ts) currently has 5 `// TODO: confirm` entries. The probe lead I created (`probe@example.com`) has `Free 2-Day Taster` list + `Taster 2Day Opted In` tag, confirming the `free-2-day-rag` mapping is correct against live Kartra. The 5 TODO mappings need Bernadette's eye in her Kartra dashboard. Detailed list in BERNADETTE-PREFLIGHT.md §B.

### 3.3 Build the 5 nurture sequences in Kartra

40 emails total, drafted as markdown in `kartra-emails/`. Build flow:

1. Acne sequence (~7 emails) is the voice prototype — Bernadette reads, gives notes
2. Apply notes to remaining 4 sequences in batch
3. For each sequence: Kartra → Sequences → New → clone the AU master template → paste subject + preheader + body per email → set delays → wire trigger to opt-in tag

Trigger wiring: each sequence's `start trigger` = "tag applied: \<opt-in tag name\>". When `/api/subscribe` applies the tag, Kartra fires the sequence.

**Critical: each E1 (welcome email) must reference `{magic_link_url}` in its CTA.** This is what makes auto-enrol work. Without it, the magic-link is generated but never delivered to the user. See `kartra-emails/_master/welcome-email-template.md`.

### 3.4 Migrate any leads currently mid-old-sequence

Two existing Kartra automations were discovered on the probe lead:
- `REGULATION - MINI COURSE` (step 1, status: active)
- `2-Day Taster - Nurture` (step 2, status: active)

These are running and will keep sending to whoever is mid-sequence. Before deleting them in §3.5:
1. Export both sequences' email content to `kartra-emails/_old-backup/` (Phase 1 backup, see §3.5.1)
2. For each lead currently mid-old-sequence, re-apply their opt-in tag → they re-enrol on email 1 of the new sequence
3. Then delete

### 3.5 Phase 1 backup → nuke old → wire new

Per the clean-nuke decision in PROJECT-STATE.md §12:

1. **Backup** every existing Kartra sequence to `kartra-emails/_old-backup/` as markdown (one file per email). Includes the two confirmed-active sequences above plus any others I didn't see on the probe lead.
2. **Build** the new 5 sequences (§3.3 above)
3. **Wire** triggers (§3.3)
4. **Migrate** mid-sequence leads (§3.4)
5. **Delete** the old sequences from Kartra
6. **Replace** any old Kartra-hosted page content with redirects (the `aestheticsunlocked.co.uk/page/...` URLs that may be linked from already-sent emails)

---

## Phase 4 — Existing-customer backfill (~15 min)

Run once to seed entitlements for paid customers who bought before the IPN webhook existed.

### 4.1 Export from Kartra

Kartra → **Communications → Leads → Export** → CSV with columns: `email, first_name, last_name`. Save to `~/Downloads/kartra-leads-<DATE>.csv`.

See [`BACKFILL-FORMAT.md`](BACKFILL-FORMAT.md) for the column-mapping spec.

### 4.2 Dry-run

```bash
cd "01 AESTHETICS UNLOCKED/au-website"
npm run backfill -- ~/Downloads/kartra-leads-<DATE>.csv --dry-run
```

Outputs what would be inserted. Review the output for sanity (count of entitlements, course slugs, etc.).

### 4.3 Real run

```bash
npm run backfill -- ~/Downloads/kartra-leads-<DATE>.csv
```

Throttled to 1 req/sec (well under Kartra's 60/min cap). Idempotent — safe to re-run if interrupted.

---

## Phase 5 — Final smoke test (~10 min)

End-to-end happy path on the live domain.

### 5.1 Free-taster path

1. Visit `https://aestheticsunlocked.co.uk/courses/free-acne-decoded` in a fresh browser (incognito)
2. Submit OptInForm with a test email (use a real inbox you control, not example.com — those are blacklisted by Kartra's anti-spam)
3. Within ~30 seconds, welcome email arrives from `hello@aunlock.co.uk`
4. Click the magic-link → lands on `https://aestheticsunlocked.co.uk/members/courses/free-acne-decoded`
5. ✅ Confirmed: signed in, can read lesson 1

### 5.2 In-dashboard "Start free course" path

1. Already signed in from §5.1, navigate to `/members`
2. Scroll to "Courses you might like" — three free tasters render
3. Click "Start free course →" on `Rosacea Beyond Redness, The Mini`
4. ✅ Confirmed: navigates to `/members/courses/free-rosacea-beyond-redness`, lesson accessible
5. Verify in Kartra: lead has `Rosacea Mini Opted In` tag applied (or whatever the verified mapping resolves to)

### 5.3 Paid-course path *(optional, requires test purchase)*

1. Visit a paid course sales page, click the CTA → goes to real Kartra checkout
2. Complete a test purchase (refund yourself after)
3. Within seconds, IPN fires → check Vercel function logs for `200` response on `/api/kartra/ipn`
4. Sign in at `/login` with the buyer email
5. ✅ Confirmed: dashboard shows the purchased course as "Continue", lesson player loads

### 5.4 Preflight script

```bash
cd "01 AESTHETICS UNLOCKED/au-website"
npm run preflight
```

See `scripts/preflight.ts`. Prints a green/red checklist of every required env var, table existence, and endpoint health. Run before declaring launch complete.

---

## Phase 6 — Post-launch (within 24h)

### 6.1 Plausible

Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=aestheticsunlocked.co.uk` in Vercel → redeploy. Conversion events (`opt_in_submit`, `lesson_view`, `course_purchase`) start firing.

### 6.2 GSC

Add Google Search Console property for `aestheticsunlocked.co.uk` → uncomment the verification token in [`app/layout.tsx`](app/layout.tsx) → push.

### 6.3 Rotate the GoDaddy API key

If the key was used during launch, rotate it at <https://developer.godaddy.com/keys>.

---

## Rollback summary (one-page emergency procedure)

If launch goes wrong, in order of severity:

| Symptom | Rollback |
|---|---|
| Site down on `aestheticsunlocked.co.uk` | Restore GoDaddy DNS: apex A → `34.68.234.4`, www CNAME → `aestheticsunlock.kartra.com`. Site reverts to old Kartra in 1–10 min. |
| Magic-links not arriving | In Supabase → Auth → SMTP, toggle Custom SMTP **off**. Falls back to Supabase default mailer (3/hr cap, but functional). Then debug Resend separately. |
| Auto-enrol throwing 500s | The new code degrades gracefully (try/catch around the auto-enrol block; Kartra-only path still runs). If errors persist, revert commit `c5563d8` and redeploy. |
| Pending memberships rows piling up | Check `pending_memberships` table — if non-empty after a few sign-ins, the trigger isn't firing. Re-apply migration 0002. |
| Members signing in but bouncing | Backfill not run, OR the entitlement check is hitting a memberships row mismatch. Run backfill, then check `select * from memberships where member_id = '<UUID>'` in Supabase SQL Editor. |

All of these are reversible within minutes. None require data loss.

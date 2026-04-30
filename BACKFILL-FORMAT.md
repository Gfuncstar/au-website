# Backfill CSV format spec

The one-off backfill at [`scripts/backfill-memberships.ts`](scripts/backfill-memberships.ts) seeds Supabase entitlements for paying customers who bought before the IPN webhook existed. Without it, those customers can sign in but bounce off every lesson page.

This document is the spec for the CSV file Bernadette exports from Kartra.

---

## Required columns

The script keys on **email**. Everything else is optional and overridden by what Kartra returns when the script looks up each lead via the API.

| Column | Required? | Notes |
|---|---|---|
| `email` | **Yes** | Lower-cased before matching. One row per email. |
| `first_name` | No | Used only if Kartra's record doesn't have one. |
| `last_name` | No | Same. |

Other columns can be present in the CSV — they're ignored.

## How to export from Kartra

1. **Communications → Leads → Filter to "All customers"** (or any segment that includes everyone with a paid product)
2. Click **Export** → choose CSV
3. Save to `~/Dropbox/CLAUDE/01 AESTHETICS UNLOCKED/AU/kartra-leads-export-<DATE>.csv`

**Including non-Kartra purchasers:** if Bernadette has Stripe customers who aren't in Kartra (rare, but check), append them to the same CSV with their email + name. The script will create Supabase auth users for them too on first sign-in via the trigger.

## Sanity-check the file before running

```bash
# Quick column inspection
head -1 ~/Dropbox/CLAUDE/01\ AESTHETICS\ UNLOCKED/AU/kartra-leads-export-*.csv

# Count rows (subtract 1 for header)
wc -l ~/Dropbox/CLAUDE/01\ AESTHETICS\ UNLOCKED/AU/kartra-leads-export-*.csv
```

Look for: `email` header in column 1, no duplicate emails, no obviously broken rows (commas inside emails, empty rows, etc.).

## Run the script

**Dry run first** — prints what would be inserted, writes nothing:

```bash
cd "01 AESTHETICS UNLOCKED/au-website"
npm run backfill -- ~/Dropbox/CLAUDE/01\ AESTHETICS\ UNLOCKED/AU/kartra-leads-export-<DATE>.csv --dry-run
```

Review the output. Look for:
- Reasonable count of memberships per email (most customers will have 1–3)
- Course slugs that match `lib/courses.ts` (no "unknown membership" warnings)
- No errors with HTTP status codes from Kartra (would indicate rate limit hits)

**Real run:**

```bash
npm run backfill -- ~/Dropbox/CLAUDE/01\ AESTHETICS\ UNLOCKED/AU/kartra-leads-export-<DATE>.csv
```

Throttled to 1 req/sec (Kartra cap is 60/min, we use ~1/sec to be polite). For 200 customers this takes ~3.5 minutes.

## Idempotent — safe to re-run

Re-running the script:
- Updates `first_name` / `last_name` if Kartra now has different values
- Adds memberships granted since the last run
- Marks memberships inactive if Kartra now reports them as inactive

It does **not** delete or downgrade memberships that exist in Supabase but not in the CSV. (Manual intervention if needed.)

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Unknown membership name "X"` warnings | Add the missing mapping to `getCourseByMembershipName` in `lib/courses.ts`. Re-run. |
| `429 Too Many Requests` from Kartra | Sleep is too short. Edit the script's throttle to 1500ms. Re-run. |
| Buyer signs in, sees no entitlement | Check `select * from memberships where member_id = (select id from members where email='X')`. If empty, re-run backfill for just that email. |
| `pending_memberships` rows piling up | Means buyers ARE coming in via IPN but haven't signed in. Backfill won't help here — they need to receive the magic-link email. Check Resend deliverability. |

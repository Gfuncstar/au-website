# Bernadette pre-flight checklist

This is everything that needs your eyes, your account, or your sign-off before launch. Designed to take **about 60 minutes total**, in any order. Most items are paste, click, or yes/no.

If anything is unclear, ping Giles. Don't guess on Kartra naming — wrong names break automation silently.

---

## A. Five real Kartra checkout URLs *(10 min)*

For each of the five paid courses below, paste the actual Kartra checkout page URL into Giles. He drops them into the codebase and pushes.

| Course | Slug | Price | Status |
|---|---|---|---|
| Acne Decoded | `acne-decoded` | £150 | ✅ wired 2026-04-30 |
| Rosacea Beyond Redness | `rosacea-beyond-redness` | £150 | ✅ wired 2026-04-30 |
| The Skin Specialist™ Programme | `skin-specialist-programme` | £399 | ✅ wired 2026-04-30 |
| The RAG Pathway *(From Regulation to Reputation™)* | `rag-pathway` | £499 | ✅ wired 2026-04-30 |
| The 5K+ Formula™ | `5k-formula` | £799 | ✅ wired 2026-04-30 |

**Section A is fully closed.** Every paid course's Enrol button on the holding site now points at its real Kartra checkout. No further action on URLs.

---

## B + C. Kartra mappings ✅ DONE (2026-04-30)

All eight `// TODO: confirm` blocks closed. Bernadette created the missing lists and tags in her Kartra dashboard and confirmed the existing names. The 5K Formula waitlist now has its own dedicated `5K Waitlist Opted In` tag, separate from the 3-Day Mini's `5K_Prelaunch_Start`, so the two funnels can fire their own nurture sequences without colliding.

Final mapping state (synced into `lib/kartra-mappings.ts`):

| Course | Opt-in list | Opt-in tag | Purchase list | Purchase tag |
|---|---|---|---|---|
| `free-2-day-rag` | Free 2-Day Taster | Taster 2Day Opted In | — | — |
| `free-3-day-startup` | 5K Formula Prelaunch Trigger | 5K_Prelaunch_Start | — | — |
| `free-acne-decoded` | Acne Decoded Mini | Acne Mini Opted In | — | — |
| `free-rosacea-beyond-redness` | Rosacea Beyond Redness Mini | Rosacea Mini Opted In | — | — |
| `free-clinical-audit` | England Aesthetic Compliance Audit | Compliance Audit Opted In | — | — |
| `free-skin-specialist-mini` | The Skin Specialist Mini | Skin Specialist Mini Opted In | — | — |
| `acne-decoded` | — | — | ACNE DECODED | Acne Decoded Purchased |
| `rosacea-beyond-redness` | — | — | Rosacea Beyond Redness Buyers | Rosacea Purchased |
| `skin-specialist-programme` | — | — | Skin Specialist Programme Buyers | Skin Specialist Purchased |
| `rag-pathway` | From Regulation to Reputation™ Waitlist | RAG Pathway Opted In | RAG Pathway | RAG Pathway Purchased |
| `5k-formula` | The 5K Formula Waitlist | 5K Waitlist Opted In | 12-Week Business Program | 12 Week Purchased |

Section closed. No further action.

---

## D. Create one new Kartra Lead Custom Field *(2 min)*

This is the magic-link bridge. Without it, free-taster opt-ins capture the user but don't deliver a one-click sign-in.

In Kartra → **Settings → Lead Custom Fields → New custom field**:

| Field | Value |
|---|---|
| **Name** | Magic link URL |
| **Internal name** | `magic_link_url` *(case-sensitive — must match exactly)* |
| **Type** | Text (long) |
| **Visible to lead** | No |

That's it. Save. The site is already wired to populate this field whenever someone opts in.

---

## E. Decide on the "we've moved" treatment for old Kartra-hosted pages *(5 min)*

Background: Some of your existing emails already-sent to the inboxes of past leads contain links to Kartra-hosted sales pages on `aestheticsunlocked.co.uk` (which currently routes to Kartra). Once the domain is repointed at the new site, those Kartra-hosted pages will no longer be reachable at the old URL — they'll show the new site instead.

For most cases this is fine: the new site has the same course landing pages at the same paths (`/courses/acne-decoded` etc.). For the few that differ, we have two choices:

1. **301 redirect** (recommended): old URL silently redirects to closest equivalent on the new site
2. **"We've moved" splash**: old URL shows a small page saying "this content has moved, click here for the new version"

Which do you prefer for the user experience? Default is option 1 (silent, faster) unless you want option 2 (more visible, slightly slower).

If there are any Kartra-hosted URLs you remember being heavily linked from broadcasts, list them here and we'll add specific redirect rules:

- (your list)

---

## F. Approve nurture-email drafts *(60–90 min, but only after Giles drafts them)*

Giles is drafting 40 emails across the 5 free-taster funnels. They land as markdown files in `kartra-emails/<funnel>/`. Each one is:
- Subject line
- Preheader (the small grey text that shows in inbox previews)
- Body in your voice (warm in early emails, more direct toward the close)
- CTA link
- Send delay from previous email

Process:

1. Read each markdown file. Edit anything that doesn't sound like you (line-comment your changes inline)
2. Mark approved ones with `# APPROVED` at the top
3. For ones needing rework, just say what feels off (Giles's job to rewrite, not yours)
4. Once approved, Giles or I paste them into Kartra Sequences and wire the triggers

You're approving voice + accuracy, not authoring. The drafts are starting points.

The first sequence (Acne Decoded, ~7 emails) will be the voice prototype — read those first, give notes, and the rest get drafted with your notes baked in.

---

## G. Existing customer CSV export *(5 min)*

For backfill: existing paying customers need their Supabase entitlement records seeded so they can sign in to the new site.

Kartra → **Communications → Leads → Export** → CSV. Three columns we need: `email`, `first_name`, `last_name`. Drop the file in Dropbox at:

```
~/Dropbox/CLAUDE/01 AESTHETICS UNLOCKED/AU/kartra-leads-export-<DATE>.csv
```

Giles runs the backfill script against it (idempotent, throttled, dry-run-friendly).

If you have existing customers who paid via Stripe directly (not through Kartra checkout), include them in the CSV too. The script keys on email; whatever's in Kartra gets entitlements.

---

## H. Confirm BAAPS / Educator of the Year wording *(2 min)*

The site shows "Educator of the Year 2026 Nominee" in several places. Confirm:

1. The awarding body is **BAAPS** (British Association of Aesthetic Plastic Surgeons), or another body? The brand audit flagged this as needing verification.
2. Status is currently "Nominee" — has that progressed to anything else? Final ceremony date?

---

## Summary — what blocks launch vs. what doesn't

**Blocks launch:**
- A (5 checkout URLs) — without these, the buy buttons don't work
- D (custom field creation) — without this, magic-links don't reach users
- B (verify mappings) and C (create new lists) — without these, opt-ins go to wrong/missing automation

**Doesn't block but quality-affects:**
- E (we've moved redirects) — site works either way; better UX with redirects
- F (email approval) — sequences can be added post-launch if needed
- G (backfill) — only matters for existing paying customers; new customers work fine without it
- H (BAAPS wording) — cosmetic, fix anytime

**My ask back to you:**

Reply with:
1. A: 5 URLs pasted
2. B.1–B.5: ✅ or corrected names for each
3. C: ✅ once you've created the new lists/tags
4. D: ✅ once the custom field is created
5. E: option 1 or 2
6. F: notes on the drafts when they land
7. G: filename of the CSV when uploaded
8. H: awarding body + status

That's it. Take your time on any of it. Nothing is irreversible. Most of the launch heaviness is on Giles's side — your slice is verification and authorisation.

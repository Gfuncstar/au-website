# Bernadette pre-flight checklist

This is everything that needs your eyes, your account, or your sign-off before launch. Designed to take **about 60 minutes total**, in any order. Most items are paste, click, or yes/no.

If anything is unclear, ping Giles. Don't guess on Kartra naming — wrong names break automation silently.

---

## A. Five real Kartra checkout URLs *(10 min)*

For each of the five paid courses below, paste the actual Kartra checkout page URL into Giles. He drops them into the codebase and pushes.

| Course | Slug | Price | Need: paste the Kartra checkout URL |
|---|---|---|---|
| Acne Decoded | `acne-decoded` | £79 | |
| Rosacea Beyond Redness | `rosacea-beyond-redness` | £79 | |
| The Skin Specialist™ Programme | `skin-specialist-programme` | £399 | |
| The RAG Pathway *(From Regulation to Reputation™)* | `rag-pathway` | £499 *(confirm price)* | |
| The 5K+ Formula™ | `5k-formula` | £1,199 | |

**Where to find each URL:** Kartra → Products → \<product name\> → Checkout pages → copy the public link. Use the FINAL checkout URL, not a draft.

Also confirm: is the RAG Pathway price still £499, or has it changed since last conversation?

---

## B. Verify five Kartra mappings *(15 min)*

The site maps each course slug to a list NAME and a tag NAME inside Kartra (the API uses names, not numeric IDs). Five entries currently have a `// TODO: confirm` flag because the original dashboard listing was ambiguous. For each, log into Kartra and confirm the exact name, **letter-for-letter**, that exists in your account.

Reply with either ✅ (correct as written) or the exact corrected name.

### B.1 `free-3-day-startup`
Currently mapped to:
- List: **`5K Formula Prelaunch Trigger`**
- Tag: **`5K_Prelaunch_Start`**

Question: should the 3-Day Mini opt-in feed the prelaunch sequence, or the standalone "Clarity to Cash" funnel? Whatever the active path is, give us its exact list and tag names.

### B.2 `free-acne-decoded`
Currently planned as:
- List: **`Acne Decoded Mini`**
- Tag: **`Acne Mini Opted In`**

Does this list/tag exist in Kartra? If yes, confirm. If no, it needs creating before launch.

### B.3 `free-rosacea-beyond-redness`
Currently planned as:
- List: **`Rosacea Beyond Redness Mini`**
- Tag: **`Rosacea Mini Opted In`**

Same question — exists, or needs creating?

### B.4 `rag-pathway`
Currently mapped to:
- Opt-in list: **`From Regulation to Reputation™ Waitlist`**
- Opt-in tag: **`RAG Pathway Opted In`**
- Purchase list: **`RAG Pathway`**
- Purchase tag: **`RAG Pathway Purchased`**

Confirm the opt-in list — is the trademark symbol present in the actual Kartra name, or just text "Waitlist"?

### B.5 `5k-formula`
Currently mapped to:
- Opt-in list: **`The 5K Formula Waitlist`**
- Opt-in tag: **`5K_Prelaunch_Start`** *(reused from B.1, no dedicated waitlist tag exists yet)*
- Purchase list: **`12-Week Business Program`**
- Purchase tag: **`12 Week Purchased`**

Recommendation: create a dedicated **`5K Waitlist Opted In`** tag in Kartra so the waitlist sequence isn't sharing a tag with the prelaunch one. Worth doing? If yes, create it and we'll point B.5 at the new tag.

---

## C. Create two new Kartra lists/tags *(10 min)*

Two paid courses are new since the last Kartra audit and don't have lists/tags yet. Create them in Kartra → Communications → Lists / Tags.

### C.1 The Skin Specialist™ Programme

Create:
- List: **`Skin Specialist Programme Buyers`** *(paid customers)*
- Tag: **`Skin Specialist Purchased`** *(applied on payment)*
- Tag: **`Skin Specialist Abandoned Cart`** *(applied to abandoned-checkout)*
- Tag: **`Skin Specialist Enrolled`** *(applied when they sign in)*
- Tag: **`Skin Specialist Complete`** *(applied on course completion — manual or by sequence)*

### C.2 The Skin Specialist™ Mini *(free taster)*

Create:
- List: **`The Skin Specialist Mini`** *(free leads)*
- Tag: **`Skin Specialist Mini Opted In`** *(applied on opt-in via the form)*
- Tag: **`Skin Specialist Mini Complete`** *(applied on completion)*

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

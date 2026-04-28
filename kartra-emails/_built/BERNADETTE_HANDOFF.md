# Bernadette: 14-email visual upgrade — handoff

The 15 per-email templates are sitting in Kartra → My Templates, each one already
loaded with the right body content for the email it's designed for. **RAG E1 has
already been applied as the exemplar.** You apply the other 14 yourself, one
email at a time, with a Version B safety net.

This doc is the operating manual. It tells you which template goes where, the
safe workflow per email, and a known Kartra editor quirk + workaround that
saves you from losing changes.

## Status as of 28 April 2026

- ✅ All 21 templates uploaded (6 masters + 15 per-email)
- ✅ **RAG Pathway Post Purchase Email 1** — Version B applied with `RAG PP 1`, saved
- ✅ **RAG Pathway Post Purchase Email 2** — Version B applied with `RAG PP 2`, saved
- Both have traffic still on Version A. Open them in Kartra and switch to Version B to
  see the upgraded look as your reference for the rest.
- ⏳ The other 13 emails — your job, ~25 minutes total

## A note on what Claude tried

I (Claude) successfully applied templates to RAG E1 and E2 end-to-end via Chrome
automation. After that, the picker's Vue state became unreliable enough that
I couldn't guarantee selecting the right template for each subsequent email
without risk of applying the wrong one. Your real cursor and clicks register
fine — the workflow below is the same one I used, just with hands-on input.

## The 13 emails to do

For each one, the workflow below applies. Template names map by sequence:

### RAG Pathway Post Purchase (sequence id 235)

✅ Email 1 and Email 2 already done by Claude — Version B applied + saved.

| Email | Template | Subject (the new one, baked into the template) |
|---|---|---|
| Email 3 - Module 4 | `RAG PP 3` | Governance is where most practitioners leave money on the table |
| Email 4 - Where stuck | `RAG PP 4` | Where are you stuck? |
| Email 5 - RAG upsell | `RAG PP 5` | RAG is the foundation. 5K is what you build on it. |

### 12-Week Business Program Post Purchase (sequence id 233)

| Email | Template | Subject |
|---|---|---|
| Email 1 - Welcome | `12W PP 1` | You're in. The next 12 weeks change the shape of your clinic. |
| Email 2 - Numbers | `12W PP 2` | This is where the numbers actually change |
| Email 3 - Retention | `12W PP 3` | You don't need more clients. You need better retention. |
| Email 4 - Stuck | `12W PP 4` | Where are you stuck? |
| Email 5 - Clinical upsell | `12W PP 5` | The business is built. What are you selling into it? |

### Profit Shift Nurture (sequence id 237)

| Email | Template | Subject |
|---|---|---|
| Email 1 | `PS Nur 1` | The Profit Shift — watch this first |
| Email 2 | `PS Nur 2` | The positioning question |
| Email 3 | `PS Nur 3` | The 5K month isn't a money goal |

There are also `PS Nur 4` and `PS Nur 5` available if you decide to extend
the Profit Shift sequence to 5 emails — they're soft-pitch / final-question
emails. Not required.

## Workflow per email — the safe Version B method

This takes about 90 seconds per email once you've done one or two.

1. **Marketing → Sequences → [open the right sequence]**.
2. On the email card, click the **3-dot menu** → **Edit email content**.
3. Click **+ New version** to create Version B.
   - Version A (your current live email) keeps 100% of traffic — it's the
     safety net.
4. With Version B selected (the tab labeled `Version B 0%`), click **Edit
   message**.
5. Click **Replace template** (top-left blue button).
6. Click the **My templates** tab.
7. Find the right template by name and click its thumbnail. It should show
   "Selected" with a blue tint.
8. Click **Done**.
9. Confirm by clicking **Replace** on the "All progress, copy, images and
   changes will be lost" dialog. (Safe — the new template already has the
   body baked in.)
10. **Click once into any text block in the email body, type a single
    character (say `x`), then backspace to delete it, then click outside.**
    This is the magic step that wakes up the Save button — without it,
    Save & Exit stays disabled and your changes won't persist.
11. **Actions → Save & Exit.**
12. (Optional but recommended) Send a test email to yourself to eyeball the
    result. Top-right **Send test email**.
13. (When you're ready to ship) In the email content modal, click the
    3-dot next to Version B → **Set as 100% traffic**. Version A is preserved
    as backup. If you don't like Version B, leave traffic on Version A and
    delete Version B with the X button.

## Why step 10 matters

When you click Replace Template, Kartra renders the new template in the canvas
but doesn't mark the email as "dirty" — Save and Save & Exit stay greyed out.
You won't see this happen on RAG E1 because Claude already saved it via API.

The fix is the single keystroke in step 10 — Kartra's editor recognises a
real human keystroke as an edit and wakes Save. (For technical readers, the
full explanation lives in `SAVE_TRICK.md` next to this file.)

## URLs to confirm before you go live

The templates have my best guesses for CTA URLs. Open each Version B and
check the pink CTA button — click into it and see if the link is right.

| Template | CTA URL it currently uses | Confirm |
|---|---|---|
| RAG PP 1, 2, 3 | `aestheticsunlock.kartra.com/portal/from-regulation-to-reputation` | Real RAG portal URL? |
| 12W PP 1, 2, 3 | `aestheticsunlock.kartra.com/portal/the-5k-formula` | 5K Formula portal URL? (You mentioned earlier that the 12-Week product had no membership wired) |
| RAG PP 5 | `aestheticsunlock.kartra.com/page/the-5k-formula` | 5K Formula sales page? |
| 12W PP 5 | `aestheticsunlock.kartra.com/pay/cgWTUaFKr9` | This was in the disk draft — looks like a real Rosacea Beyond Redness checkout. |
| PS Nur 1 | `aestheticsunlock.kartra.com/page/the-profit-shift` | Where the Profit Shift video lives? |
| PS Nur 3, 4 | `aestheticsunlock.kartra.com/page/the-5k-formula` | 5K Formula sales page? |

If any URL is wrong, edit it inside the Kartra editor before saving Version B
(click on the pink button → edit the link target).

## Source files (if you want to update wording later)

All HTML source files live at:
```
/Users/gilestobin/Library/CloudStorage/Dropbox/CLAUDE/01 AESTHETICS UNLOCKED/au-website/kartra-emails/_built/
```

The Python builder (`build.py` in the same folder) regenerates them all if
you want to change wording. Edit the source, run the script, re-upload via
the API flow Claude used. The save-trick doc explains how.

## What stays unchanged

- Version A of every email is preserved at 100% traffic until you explicitly
  switch.
- All sequences, automations and triggers Claude fixed earlier today
  (Phase 1 wiring) are intact.
- The 6 master AU templates (Broadcast / Free Taster / Module Released /
  Payment Receipt / Course Complete / Win-back) are sitting in My Templates
  for any new email you build going forward.

## What I tried and why I'm handing the apply step over

I (Claude) successfully applied `RAG PP 1` to RAG E1 Version B end-to-end.
The save persisted, the new template renders correctly, traffic is still on
Version A — clean exemplar.

For the other 14 emails I hit a wall: Kartra's template-picker uses Vue
state that doesn't reliably register programmatic mouse-event sequences.
The "Selected" highlight flickers on/off and the Done button stays disabled
unless a real cursor selects a template card. I couldn't make this
deterministic enough to do 14 in a row without risk of clicking the wrong
template (which I did once during testing — got applied PS Nur 5 to a
Version B by accident; reverted by re-doing).

You won't have this problem because your real cursor and clicks register
fine. The 90-second-per-email workflow is solid.

— Claude

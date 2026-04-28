# Bernadette: 15-email visual upgrade — handoff

You now have 15 per-email templates sitting in Kartra → My Templates, each one already loaded with the right body content for the email it's designed for. All you do is apply them, one email at a time, with a safety net.

## What's in My Templates

### Master shells (the 6 you already have access to from any future email)

| Template | Use it for |
|---|---|
| AU Broadcast | One-off sends, nurture broadcasts |
| AU Free Taster | Step 1 of free taster opt-in |
| AU Module Released | Module-unlock drip emails |
| AU Payment Receipt | Stripe-paid enrolment receipts |
| AU Course Complete | Course completion (`*Complete` tag) |
| AU Win-back | 30-day silent re-engagement |

### Per-email templates (the 15 already pre-loaded with body copy)

**RAG Pathway Post Purchase** (sequence id 235, 5 emails)

| Template | Apply to email | Subject |
|---|---|---|
| RAG PP 1 | Email 1 - Welcome | You're in. Here's how to start. |
| RAG PP 2 | Email 2 - Module 3 | This is where the reputation work actually starts |
| RAG PP 3 | Email 3 - Module 4 | Governance is where most practitioners leave money on the table |
| RAG PP 4 | Email 4 - Where are you stuck | Where are you stuck? |
| RAG PP 5 | Email 5 - RAG upsell | RAG is the foundation. 5K is what you build on it. |

**12-Week Business Program Post Purchase** (sequence id 233, 5 emails)

| Template | Apply to email | Subject |
|---|---|---|
| 12W PP 1 | Email 1 - Welcome | You're in. The next 12 weeks change the shape of your clinic. |
| 12W PP 2 | Email 2 - Numbers | This is where the numbers actually change |
| 12W PP 3 | Email 3 - Retention | You don't need more clients. You need better retention. |
| 12W PP 4 | Email 4 - Stuck | Where are you stuck? |
| 12W PP 5 | Email 5 - Clinical upsell | The business is built. What are you selling into it? |

**Profit Shift Nurture** (sequence id 237, currently 3 emails — more can be added)

| Template | Apply to email | Subject |
|---|---|---|
| PS Nur 1 | Email 1 (welcome / video delivery) | The Profit Shift — watch this first |
| PS Nur 2 | Email 2 (reflection 1) | The positioning question |
| PS Nur 3 | Email 3 (reflection 2) | The 5K month isn't a money goal |
| PS Nur 4 | (new — add as Email 4 if you want soft pitch) | If the video landed, here's the full build |
| PS Nur 5 | (new — add as Email 5 if you want close) | Where do you want to be in 12 months? |

## How to apply each one (safe workflow — Version B safety net)

Per email, this takes about 90 seconds:

1. Open the sequence in Kartra (e.g. **Marketing → Sequences → RAG Pathway Post Purchase**).
2. Click the **3-dot menu** on the email card → **Edit email content**.
3. Click **+ New version** to create Version B (the original Version A keeps 100% of traffic, totally safe).
4. With Version B selected, click **Edit message**.
5. Click **Replace template** (top-left, blue button).
6. Click the **My templates** tab.
7. Search for the template name (e.g. `RAG PP 2`) and click it. Click **Done**.
8. Confirm **Replace** when Kartra warns about wiping the body — that's expected, the body is already in the new template.
9. **Click once into any text block in the email body** (this is the step that wakes up the Save button — without it, Save & Exit stays greyed out and your changes won't persist).
10. Click **Actions → Save & Exit**.
11. Send a test email to yourself (top-right, **Send test email**) to eyeball it.
12. If you like it, in the email content modal click the **3-dot next to Version B → set as 100% traffic**. Version A is preserved as backup. If you don't like it, leave it at 0% and try again.

## URLs you'll want to fix in the body before going live

Each template uses what I think is the right URL for the CTA, but please confirm:

| Template | CTA points to | Confirm |
|---|---|---|
| RAG PP 1, 2, 3 | `https://aestheticsunlock.kartra.com/portal/from-regulation-to-reputation` | Is that the actual portal URL for RAG members? |
| 12W PP 1, 2, 3 | `https://aestheticsunlock.kartra.com/portal/the-5k-formula` | Is the 5K Formula portal URL set up yet? You mentioned the 12-Week product had no membership wired earlier. |
| RAG PP 5 → 5K cross-sell | `https://aestheticsunlock.kartra.com/page/the-5k-formula` | 5K Formula sales page URL? |
| 12W PP 5 → Rosacea cross-sell | `https://aestheticsunlock.kartra.com/pay/cgWTUaFKr9` | This was in the disk draft, looks like a real Rosacea Beyond Redness checkout URL. Confirm. |
| PS Nur 1 | `https://aestheticsunlock.kartra.com/page/the-profit-shift` | Is that where the Profit Shift video lives? |
| PS Nur 3, 4, 5 → 12W cross-sell | `https://aestheticsunlock.kartra.com/page/the-5k-formula` | Same as above. |

If any URL is wrong, just edit it in the Kartra editor before saving Version B (click into the pink CTA button → edit the link target).

## Source files (if you need to update later)

All HTML source files live at:
```
/Users/gilestobin/Library/CloudStorage/Dropbox/CLAUDE/01 AESTHETICS UNLOCKED/au-website/kartra-emails/_built/
```

The Python builder (`build.py` in the same folder) regenerates them all if you want to change wording. Edit the source, run the script, re-upload via the same API flow Claude used.

## What stays unchanged

- Version A of every email is preserved at 100% traffic until you explicitly switch.
- All sequences, automations and triggers I fixed earlier today are intact.
- The 6 master AU templates (Broadcast / Free Taster / Module Released / Payment Receipt / Course Complete / Win-back) are sitting in My Templates for any new email you build going forward.

— Claude

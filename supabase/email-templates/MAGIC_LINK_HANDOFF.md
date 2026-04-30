# Magic-link email: get it on brand

**Status (2026-04-30): COMPLETE.** Both fixes below are now live. Recipients receive an
on-brand, deliverable sign-in email from `Aesthetics Unlocked <hello@aunlock.co.uk>`.

This document is kept as a historical record of the work, and as a reference
for any future agent who needs to re-do the setup (for example, on a new
Supabase project or if Resend credentials are rotated).

## The two-domain split, before anything else

This is intentional and worth knowing up front, because it shapes both fixes
below.

- **Website domain:** `aestheticsunlocked.co.uk`. Descriptive, what visitors
  type, what the new Vercel deploy will eventually serve.
- **Email sender domain:** `aunlock.co.uk`. Memorable, easier to speak on a
  podcast or write on a card. Verified at Kartra (existing infrastructure)
  and at Resend (added 2026-04-30 alongside Kartra's records).

Magic-link emails go FROM `aunlock.co.uk` and link TO
`aestheticsunlocked.co.uk`. Both domains have clean SPF and DKIM. DMARC
alignment is in place for the sender domain. See `PROJECT-STATE.md` §1 for
the canonical record of this choice.

## What was wrong before today

1. The template was Supabase's default ("Magic Link / Follow this link to
   login: / Log In / powered by Supabase"). The Aesthetics Unlocked branded
   HTML was sitting in this folder but had not been pasted into the
   dashboard.
2. Mail was being sent from `noreply@mail.app.supabase.io`. Gmail and
   Outlook flagged it as suspicious because the from-domain did not match
   `aunlock.co.uk` (or any AU-owned domain) and there was no DKIM aligned
   to it.

## Fix 1: Branded template pasted into Supabase ✅ DONE

**Performed 2026-04-30 by Giles, dashboard work in Supabase.**

1. Open the Supabase dashboard, go to **Authentication → Email Templates**,
   choose **Magic Link**.
2. Set the subject line to: `Your Aesthetics Unlocked sign-in link`
3. Open `supabase/email-templates/magic-link.html` in this repo, copy the
   entire file.
4. Paste it into the **Message body (HTML)** field, replacing whatever was
   there.
5. Save.

The template uses Supabase's standard substitutions: `{{ .Token }}` becomes
the 6-digit one-time code, `{{ .ConfirmationURL }}` becomes the one-click
sign-in link. Both are wired so a recipient can either copy the code or
click the button.

> **Gotcha that bit us:** the OTP length was set to 8 digits in Supabase by
> default but the `/login` form is built for 6. Result was that recipients
> got an 8-digit code but the form would only accept 6 of them. Fixed by
> setting **Authentication → Providers → Email → Email OTP Length** to 6.

## Fix 2: Resend SMTP for the sender domain ✅ DONE

**Performed 2026-04-30 by Giles, dashboard work split across Resend, GoDaddy
DNS, and Supabase.**

After this, the email arrives from `Aesthetics Unlocked <hello@aunlock.co.uk>`,
the "powered by Supabase" footer is gone, and Gmail / Outlook see SPF + DKIM
+ DMARC pass on the sender domain.

### A. Sender domain set up in Resend

1. Created a Resend account (signed in with GitHub).
2. Added `aunlock.co.uk` as a sending domain, region Dublin (eu-west-1).
3. Resend issued three DNS records (DKIM TXT on `resend._domainkey`, MX on
   `send` for bounce routing, SPF TXT on `send`). The optional fourth
   inbound-MX record was deliberately skipped to keep Bernadette's existing
   inbound mail intact.

### B. DNS records added at GoDaddy

Three records added alongside Kartra's existing records on `aunlock.co.uk`.
Kartra's records were not touched. Both services use different DKIM
selectors so they coexist without conflict. Verified by Resend within 17
minutes of save (DNS propagation took about 15 of those).

### C. API key minted and plugged into Supabase

1. Resend → API Keys → created a key named `supabase-auth-smtp`, scoped to
   Sending access only.
2. Supabase → Project Settings → Auth → SMTP Settings → enabled Custom
   SMTP, entered:

   ```
   Sender email:   hello@aunlock.co.uk
   Sender name:    Aesthetics Unlocked
   Host:           smtp.resend.com
   Port:           587
   Username:       resend
   Password:       <re_... API key>
   Minimum interval: 60 seconds
   ```

3. Saved. Smoke-tested by signing in at `/login`, confirmed the email
   arrives in <10s with the correct from-line, branded body, no Supabase
   footer.

## What's deployed end-to-end now

- ✅ From: `Aesthetics Unlocked <hello@aunlock.co.uk>`
- ✅ Subject: "Your Aesthetics Unlocked sign-in link"
- ✅ Branded charcoal/cream/pink body with OTP block + sign-in button
- ✅ 6-digit OTP that the `/login` form accepts
- ✅ One-click sign-in button that lands the user in the members area
- ✅ No "powered by Supabase" footer
- ✅ SPF + DKIM + DMARC aligned to `aunlock.co.uk`
- ✅ Realistic inbox-placement rate of about 98 to 99% on the Primary tab

## Optional polish, not yet done

- Bring DMARC policy on `aunlock.co.uk` up from `p=none` to `p=quarantine`
  after 30 days of clean send volume. Resend's DMARC dashboard tracks this
  per domain.
- Use the same Resend account as the SMTP for any future broadcast or
  marketing email (currently Kartra still owns that traffic). Keeps the
  DMARC story clean if AU ever moves all email to one provider.
- Confirm `hello@aunlock.co.uk` resolves to a real mailbox or forward so
  replies from recipients reach a human.

## Why this template, in short

- Charcoal header, pink accent rule, single sign-in button, monospaced OTP
  block. The visual language matches the rest of the site, so the email
  reads as a continuation of the brand.
- Copy speaks to the recipient, not the editorial process. No "this is a
  transactional email", no "please do not reply".
- Brand name written in full per the Aesthetics Unlocked house rule.
- 5px corners, no pills, no gradients, in line with the site's hard-save
  design rules.

If anything in the dashboard ever drifts from what this doc describes,
ping Giles and we patch the doc rather than guess.

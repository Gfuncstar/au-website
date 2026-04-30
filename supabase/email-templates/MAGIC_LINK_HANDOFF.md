# Magic-link email: get it on brand

The current Supabase magic-link looks spammy because two switches have
not yet been flipped. Both live in the Supabase dashboard.

## The two-domain split, before anything else

This is intentional and worth knowing up front, because it shapes
both fixes below.

- **Website domain:** `aestheticsunlocked.co.uk`. Descriptive, what
  visitors type, what the new Vercel deploy will eventually serve.
- **Email sender domain:** `aunlock.co.uk`. Memorable, easier to
  speak on a podcast or write on a card. Already verified in the
  current sending stack (Kartra) with SPF, DKIM and DMARC.

Magic-link emails go FROM `aunlock.co.uk` and link TO
`aestheticsunlocked.co.uk`. Both domains need clean SPF and DKIM;
DMARC alignment only matters for the sender domain. See
`PROJECT-STATE.md` §1 for the canonical record of this choice.

## What's wrong right now

1. The template is Supabase's default ("Magic Link / Follow this link
   to login: / Log In / powered by Supabase"). The Aesthetics Unlocked
   branded HTML is ready in this folder but has not been pasted into
   the dashboard.
2. Mail is being sent from `noreply@mail.app.supabase.io`. Gmail and
   Outlook flag this as suspicious because the from-domain does not
   match `aunlock.co.uk` (or any AU-owned domain) and there is no
   DKIM aligned to it. That is the single biggest reason the email
   reads as spammy.

Fix one without the other and it still looks off. Do both and the
email lands cleanly in the inbox with the brand on it.

## Fix 1: Paste the branded template into Supabase (5 minutes)

1. Open the Supabase dashboard, go to **Authentication → Email
   Templates**, choose **Magic Link**.
2. Set the subject line to: `Your Aesthetics Unlocked sign-in link`
3. Open `supabase/email-templates/magic-link.html` in this repo,
   copy the entire file.
4. Paste it into the **Message body (HTML)** field, replacing
   whatever is there.
5. Hit **Save**.

The template uses Supabase's standard substitutions: `{{ .Token }}`
becomes the 6-digit one-time code, `{{ .ConfirmationURL }}` becomes
the one-click sign-in link. Both are wired so a recipient can either
copy the code or click the button.

## Fix 2: Switch to a real sending domain via Resend (10 minutes)

This is the change that kills the spammy feel. After this, the email
arrives from `Aesthetics Unlocked <hello@aunlock.co.uk>`, with the
"powered by Supabase" footer gone, signed by the sender domain that
is already in use across the brand.

### A. Set up the sender domain in Resend

`aunlock.co.uk` is already verified at Kartra, but Resend needs its
own DNS records to sign mail it sends. The Kartra records can stay,
they don't conflict.

1. Open [resend.com](https://resend.com), create an account.
2. Go to **Domains → Add Domain**, enter `aunlock.co.uk`.
3. Resend gives three DNS records to add at your registrar (a Resend
   SPF include, a Resend DKIM TXT, and a DMARC record if one isn't
   already in place). Add them to the `aunlock.co.uk` zone alongside
   whatever Kartra already published. Allow up to 10 minutes for
   propagation.
4. Hit **Verify**. Wait for the green tick.

### B. Mint an API key for Supabase

1. In Resend, go to **API Keys → Create API Key**.
2. Name it `supabase-auth-smtp`, scope it to **Sending access only**.
3. Copy the key. It starts `re_...`.

### C. Plug Resend into Supabase Auth

1. In Supabase dashboard, go to **Project Settings → Auth → SMTP
   Settings**.
2. Toggle **Enable Custom SMTP** on.
3. Enter exactly:

   ```
   Sender email:   hello@aunlock.co.uk
   Sender name:    Aesthetics Unlocked
   Host:           smtp.resend.com
   Port:           587
   Username:       resend
   Password:       <paste your re_... key here>
   Minimum interval: 60 seconds
   ```

4. **Save**. Then immediately send yourself a magic-link from
   `/login` and confirm:
   - The from line reads `Aesthetics Unlocked <hello@aunlock.co.uk>`
   - The subject reads `Your Aesthetics Unlocked sign-in link`
   - The body shows the charcoal poster, the OTP code block, and the
     pink sign-in button
   - The "powered by Supabase" footer is gone
   - In Gmail, click the three-dot menu → "Show original" and
     verify SPF, DKIM and DMARC all pass

## Optional polish once both fixes are live

- Confirm `hello@aunlock.co.uk` resolves to a mailbox or forward so
  replies from recipients reach a real human. The template footer
  points recipients there for help.
- Use the same Resend account as the SMTP for any future broadcast
  or marketing email so the whole brand sends from one verified
  sender domain. Keeps the DMARC story clean.
- After 30 days at clean send volume, bring the DMARC policy up from
  `p=none` to `p=quarantine`. Resend's DMARC dashboard tracks this
  per domain.

## Why this template, in short

- Charcoal header, pink accent rule, single sign-in button,
  monospaced OTP block. The visual language is the same one used
  across the site, so the email feels like a continuation of the
  brand, not a hand-off to a third party.
- Copy speaks to the recipient, not the editorial process. No
  "this is a transactional email", no "please do not reply".
- Brand name written in full per the Aesthetics Unlocked house rule.
- 5px corners, no pills, no gradients, in line with the site's
  hard-save design rules.

If anything in the dashboard looks different from what this doc
describes, ping Giles and we'll patch the doc rather than guess.

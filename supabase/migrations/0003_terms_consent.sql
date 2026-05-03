-- ============================================================
-- 0003_terms_consent.sql — record T&C consent on members table
--
-- Captures the legal-evidence trail for a member's "I agree to the
-- Terms and Privacy Policy" tick on /set-password. Two columns:
--
--   - terms_accepted_at : when the member ticked the box
--   - terms_version     : which version of the T&Cs they accepted
--                         (matches CURRENT_TERMS_VERSION in lib/terms.ts)
--
-- If the T&Cs change, bump CURRENT_TERMS_VERSION in lib/terms.ts and
-- a future consent-gate modal will re-prompt any member whose stored
-- terms_version is stale.
-- ============================================================

alter table public.members
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists terms_version text;

comment on column public.members.terms_accepted_at is
  'When the member ticked the I-agree-to-Terms box on /set-password. Null = consent not yet captured.';

comment on column public.members.terms_version is
  'Version of the Terms the member accepted. Format: YYYY-MM-DD. Bump CURRENT_TERMS_VERSION in lib/terms.ts when Terms or Privacy change so existing members are re-prompted.';

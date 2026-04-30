-- ============================================================
-- 0002_pending_memberships.sql — buy-before-sign-in safety net
--
-- Problem this solves:
--   The Kartra IPN webhook fires on `membership_granted` regardless of
--   whether the buyer has ever signed in to our site. Without this
--   table, the IPN handler at /api/kartra/ipn silently dropped the
--   grant when no `members` row existed for that email yet, so the
--   buyer would later sign in and find no entitlement.
--
-- Mechanic:
--   IPN with no existing member  → upsert into `pending_memberships`
--   First sign-in (auth.users insert) → trigger drains pending rows
--   into `memberships` keyed to the new auth user, then deletes them.
--
--   If a revoke/cancel arrives while still pending, we upsert with
--   active=false so the drain produces an inactive row (effectively
--   no-op for entitlement, but preserves the trail).
--
-- Apply this in the Supabase SQL Editor after 0001_init.sql.
-- ============================================================

create table if not exists public.pending_memberships (
  id            uuid primary key default uuid_generate_v4(),
  email         text not null,
  course_slug   text not null,
  level_name    text,
  granted_at    timestamptz not null default now(),
  active        boolean not null default true,
  kartra_membership_id text,
  kartra_level_id      text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique(email, course_slug)
);

create index if not exists pending_memberships_email_idx
  on public.pending_memberships(email);

-- RLS: locked to service-role writes only. No public access — the
-- dashboard never reads from this table; it's invisible to members.
alter table public.pending_memberships enable row level security;

-- ------------------------------------------------------------
-- Replace the auth-user trigger to also drain pending grants.
--
-- After creating the `members` row, copy any pending_memberships rows
-- for this email into `memberships` keyed to the new auth user, then
-- delete the drained rows.
-- ------------------------------------------------------------
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.members (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;

  insert into public.memberships (
    member_id, course_slug, level_name,
    kartra_membership_id, kartra_level_id, granted_at, active
  )
  select
    new.id,
    p.course_slug,
    p.level_name,
    p.kartra_membership_id,
    p.kartra_level_id,
    p.granted_at,
    p.active
  from public.pending_memberships p
  where lower(p.email) = lower(new.email)
  on conflict (member_id, course_slug) do update set
    active               = excluded.active,
    level_name           = excluded.level_name,
    kartra_membership_id = excluded.kartra_membership_id,
    kartra_level_id      = excluded.kartra_level_id,
    granted_at           = excluded.granted_at;

  delete from public.pending_memberships
  where lower(email) = lower(new.email);

  return new;
end;
$$;

-- Trigger already exists (created in 0001_init.sql), pointing at the
-- same function. Re-creating the function above replaces its body in
-- place, so no DDL change to the trigger itself is needed.

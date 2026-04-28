-- ============================================================
-- 0001_init.sql — Aesthetics Unlocked members area schema (v1)
--
-- Three tables:
--   - members           : profile cache (one row per Supabase auth user)
--   - memberships       : per-course entitlements, mirrored from Kartra
--                         via the IPN webhook
--   - lesson_progress   : per-lesson completion timestamps
--
-- Row-level security:
--   - Members can read/write their OWN rows only.
--   - The Kartra IPN endpoint uses the service-role key (bypasses RLS)
--     to insert/update members + memberships when Kartra fires events.
--
-- Apply this once in the Supabase SQL Editor (or via `supabase db push`
-- if you wire the CLI).
-- ============================================================

-- Enable required extensions (uuid generation)
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- members — one row per signed-in user, keyed to auth.users
-- ------------------------------------------------------------
create table if not exists public.members (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text unique not null,
  first_name    text,
  last_name     text,
  -- Kartra's identifier for this lead (matches lead.lead_id in the
  -- Kartra API response). Optional — gets filled by the IPN webhook
  -- the first time we hear about this email from Kartra.
  kartra_lead_id text unique,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ------------------------------------------------------------
-- memberships — per-course entitlements
-- ------------------------------------------------------------
create table if not exists public.memberships (
  id            uuid primary key default uuid_generate_v4(),
  member_id     uuid not null references public.members(id) on delete cascade,
  -- The slug from lib/courses.ts (e.g. "acne-decoded"). The IPN
  -- webhook resolves Kartra's membership_name → slug via the
  -- kartraMembershipName field in lib/courses.ts.
  course_slug   text not null,
  level_name    text,                        -- "Lifetime", "Free", etc.
  granted_at    timestamptz not null default now(),
  active        boolean not null default true,
  -- Original Kartra IDs so we can update/revoke from IPN events
  kartra_membership_id text,
  kartra_level_id      text,
  unique(member_id, course_slug)
);

create index if not exists memberships_member_id_idx
  on public.memberships(member_id);
create index if not exists memberships_active_idx
  on public.memberships(member_id, active) where active = true;

-- ------------------------------------------------------------
-- lesson_progress — per-lesson completion
-- ------------------------------------------------------------
create table if not exists public.lesson_progress (
  member_id     uuid not null references public.members(id) on delete cascade,
  course_slug   text not null,
  lesson_slug   text not null,
  completed_at  timestamptz not null default now(),
  primary key (member_id, course_slug, lesson_slug)
);

create index if not exists lesson_progress_member_course_idx
  on public.lesson_progress(member_id, course_slug);

-- ------------------------------------------------------------
-- Row-level security
-- ------------------------------------------------------------
alter table public.members enable row level security;
alter table public.memberships enable row level security;
alter table public.lesson_progress enable row level security;

-- members: a signed-in user can read + update their own row only.
drop policy if exists "members read self" on public.members;
create policy "members read self" on public.members
  for select using (auth.uid() = id);

drop policy if exists "members update self" on public.members;
create policy "members update self" on public.members
  for update using (auth.uid() = id);

-- memberships: a signed-in user can read their own active memberships.
-- (Writes are service-role only — done by the Kartra IPN webhook.)
drop policy if exists "memberships read self" on public.memberships;
create policy "memberships read self" on public.memberships
  for select using (auth.uid() = member_id);

-- lesson_progress: full self-access.
drop policy if exists "lesson_progress all self" on public.lesson_progress;
create policy "lesson_progress all self" on public.lesson_progress
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

-- ------------------------------------------------------------
-- Auto-create a `members` row when a new auth user signs up via
-- magic link. Keeps `members` in sync with `auth.users` without
-- needing an extra round-trip from the app.
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
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

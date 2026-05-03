-- ============================================================
-- 0004_lesson_ratings.sql — per-lesson star ratings
--
-- Members can rate any lesson 1–5 stars and optionally leave a short
-- comment. The rating is per-member, per-lesson — submitting again
-- updates the existing row rather than creating a duplicate.
--
-- Privacy: members can only read and write their own ratings. We do
-- not surface a public "average rating" anywhere yet, so RLS is the
-- simple "own rows only" policy. If a future feature wants to show
-- aggregate ratings, it should compute them via a SECURITY DEFINER
-- function rather than relaxing this RLS.
-- ============================================================

create table if not exists public.lesson_ratings (
  member_id    uuid not null references public.members(id) on delete cascade,
  course_slug  text not null,
  lesson_slug  text not null,
  rating       smallint not null check (rating between 1 and 5),
  comment      text,
  submitted_at timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  primary key (member_id, course_slug, lesson_slug)
);

create index if not exists lesson_ratings_course_lesson_idx
  on public.lesson_ratings(course_slug, lesson_slug);

alter table public.lesson_ratings enable row level security;

drop policy if exists "lesson_ratings own rows" on public.lesson_ratings;
create policy "lesson_ratings own rows" on public.lesson_ratings
  for all
  using (member_id = auth.uid())
  with check (member_id = auth.uid());

-- Auto-bump updated_at on row update.
create or replace function public.lesson_ratings_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists lesson_ratings_touch on public.lesson_ratings;
create trigger lesson_ratings_touch
  before update on public.lesson_ratings
  for each row execute function public.lesson_ratings_touch_updated_at();

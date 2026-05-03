-- ============================================================
-- 0005_lesson_notes.sql — per-lesson member notes
--
-- Lets a member jot a private note against any lesson — a clinical
-- observation, a question to follow up, a flag to revisit. One note
-- per (member, course, lesson); re-saving updates the existing row
-- rather than stacking. Notes are private to the member only — we
-- never surface them publicly or to other members.
-- ============================================================

create table if not exists public.lesson_notes (
  member_id    uuid not null references public.members(id) on delete cascade,
  course_slug  text not null,
  lesson_slug  text not null,
  content      text not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  primary key (member_id, course_slug, lesson_slug)
);

create index if not exists lesson_notes_member_idx
  on public.lesson_notes(member_id, updated_at desc);

alter table public.lesson_notes enable row level security;

drop policy if exists "lesson_notes own rows" on public.lesson_notes;
create policy "lesson_notes own rows" on public.lesson_notes
  for all
  using (member_id = auth.uid())
  with check (member_id = auth.uid());

create or replace function public.lesson_notes_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists lesson_notes_touch on public.lesson_notes;
create trigger lesson_notes_touch
  before update on public.lesson_notes
  for each row execute function public.lesson_notes_touch_updated_at();

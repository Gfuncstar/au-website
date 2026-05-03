/**
 * lib/lessonProgress.server.ts (server-only).
 *
 * Server-side counterpart to the client-side `useCourseProgress` hook
 * in lib/lessonProgress.ts. Used by /members and /members/courses to
 * pre-render the global progress totals on the status strip without
 * a client-side fetch round-trip.
 *
 * MOCK mode (Supabase not configured, or no signed-in session) just
 * returns empty results — the dashboard then renders zeros, which is
 * the right thing for the preview/dev surface.
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ProgressRow = {
  courseSlug: string;
  lessonSlug: string;
  completedAt: string;
};

export async function getMemberLessonProgress(): Promise<ProgressRow[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("course_slug, lesson_slug, completed_at")
    .eq("member_id", user.id)
    .order("completed_at", { ascending: false });
  if (error || !data) return [];

  return data.map((r) => ({
    courseSlug: r.course_slug as string,
    lessonSlug: r.lesson_slug as string,
    completedAt: r.completed_at as string,
  }));
}

/**
 * Resume target across all courses a member owns. Returns the lesson
 * the member should land on when they tap "Continue learning":
 * the lesson immediately after the most recently completed one in
 * that course's order. Falls back to the most recently completed
 * lesson itself when the member has finished the whole course.
 *
 * Returns null when the member has no completion history yet — in
 * that case the caller should route them to the courses launchpad.
 */
export type ResumeTarget = {
  courseSlug: string;
  lessonSlug: string;
  completedAt: string;
};

export function findResumeTarget(
  rows: ProgressRow[],
  ownedCourseLessonsInOrder: { slug: string; lessonSlugs: readonly string[] }[],
): ResumeTarget | null {
  if (rows.length === 0) return null;
  const mostRecent = rows[0];
  const course = ownedCourseLessonsInOrder.find(
    (c) => c.slug === mostRecent.courseSlug,
  );
  if (!course) {
    return mostRecent;
  }
  const idx = course.lessonSlugs.indexOf(mostRecent.lessonSlug);
  if (idx === -1 || idx === course.lessonSlugs.length - 1) {
    return mostRecent;
  }
  return {
    courseSlug: course.slug,
    lessonSlug: course.lessonSlugs[idx + 1],
    completedAt: mostRecent.completedAt,
  };
}

/** Number of lessons completed in the last 7 days. */
export function countLessonsThisWeek(rows: ProgressRow[]): number {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return rows.filter(
    (r) => new Date(r.completedAt).getTime() >= sevenDaysAgo,
  ).length;
}

export type CourseWithLessons = {
  slug: string;
  lessonSlugs: readonly string[];
};

export type ProgressTotals = {
  chaptersCompleted: number;
  chaptersTotal: number;
  coursesCompleted: number;
  coursesTotal: number;
};

/**
 * Aggregate raw progress rows against the member's owned-course
 * catalogue. Only counts lessons / courses the member actually owns,
 * so a stray progress row from a course they no longer have access
 * to never inflates the totals.
 */
export function aggregateProgress(
  rows: ProgressRow[],
  ownedCourses: CourseWithLessons[],
): ProgressTotals {
  const completed = new Set(rows.map((r) => `${r.courseSlug}:${r.lessonSlug}`));

  let chaptersCompleted = 0;
  let chaptersTotal = 0;
  let coursesCompleted = 0;
  let coursesWithLessons = 0;

  for (const c of ownedCourses) {
    if (c.lessonSlugs.length === 0) continue;
    coursesWithLessons += 1;
    chaptersTotal += c.lessonSlugs.length;

    let allDone = true;
    for (const slug of c.lessonSlugs) {
      if (completed.has(`${c.slug}:${slug}`)) {
        chaptersCompleted += 1;
      } else {
        allDone = false;
      }
    }
    if (allDone) coursesCompleted += 1;
  }

  return {
    chaptersCompleted,
    chaptersTotal,
    coursesCompleted,
    coursesTotal: coursesWithLessons,
  };
}

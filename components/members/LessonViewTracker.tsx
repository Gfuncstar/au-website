/**
 * components/members/LessonViewTracker.tsx
 *
 * Client-side stub that fires a single `lesson_view` analytics event
 * when a lesson page renders, then renders nothing. Co-located in
 * the members folder because it's only ever used inside the lesson
 * player.
 *
 * Why a component instead of inlining `track()` in the lesson page:
 * the lesson page is a Server Component (it reads markdown from disk
 * and renders MD-to-HTML at build time). `track()` only works in the
 * browser. A tiny client component is the cleanest bridge.
 */

"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

type Props = {
  courseSlug: string;
  lessonSlug: string;
};

export function LessonViewTracker({ courseSlug, lessonSlug }: Props) {
  useEffect(() => {
    track("lesson_view", { course: courseSlug, lesson: lessonSlug });
    // Fire-once-per-page-load — the dependency array is empty
    // intentionally, the same lesson re-rendering shouldn't double-count.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

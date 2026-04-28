/**
 * lib/lessonProgress.ts
 *
 * v1 progress tracking — localStorage only. Stores a flat map of
 * `${courseSlug}:${lessonSlug}` → ISO completion timestamp. v2 will
 * promote this to the Supabase `lesson_progress` table once the auth
 * layer lands; the hook signature is intentionally narrow so the
 * component code doesn't change when the source moves.
 */

"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "au:lesson-progress:v1";

type ProgressMap = Record<string, string>;

function readProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function writeProgress(map: ProgressMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Quota or privacy mode — silently ignore. Progress will simply
    // not persist this session, which is acceptable for v1.
  }
}

function key(courseSlug: string, lessonSlug: string): string {
  return `${courseSlug}:${lessonSlug}`;
}

export function useCourseProgress(courseSlug: string, lessonSlugs: string[]) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  // Reduce the array to a primitive string for the effect dep — without
  // this, callers that build the slug array inline (`lessons.map(...)`)
  // would pass a new reference every render, the effect would re-run,
  // setCompleted would render, and we'd loop forever.
  const slugsKey = lessonSlugs.join("|");

  // Hydrate from localStorage after mount to avoid SSR mismatch.
  useEffect(() => {
    const slugs = slugsKey ? slugsKey.split("|") : [];
    const map = readProgress();
    const next = new Set<string>();
    for (const slug of slugs) {
      if (map[key(courseSlug, slug)]) next.add(slug);
    }
    setCompleted(next);
  }, [courseSlug, slugsKey]);

  const markComplete = useCallback(
    (lessonSlug: string) => {
      const map = readProgress();
      map[key(courseSlug, lessonSlug)] = new Date().toISOString();
      writeProgress(map);
      setCompleted((prev) => new Set(prev).add(lessonSlug));
    },
    [courseSlug],
  );

  const markIncomplete = useCallback(
    (lessonSlug: string) => {
      const map = readProgress();
      delete map[key(courseSlug, lessonSlug)];
      writeProgress(map);
      setCompleted((prev) => {
        const next = new Set(prev);
        next.delete(lessonSlug);
        return next;
      });
    },
    [courseSlug],
  );

  const isComplete = useCallback(
    (lessonSlug: string) => completed.has(lessonSlug),
    [completed],
  );

  return { completed, markComplete, markIncomplete, isComplete };
}

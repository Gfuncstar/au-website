/**
 * lib/lessonProgress.ts
 *
 * Two modes — same as the rest of the auth-aware stack:
 *
 *   - LIVE : Supabase configured AND a session exists. Reads the
 *            user's `lesson_progress` rows for this course on mount,
 *            and writes back via Supabase on every toggle. RLS
 *            enforces "own rows only" server-side.
 *
 *   - MOCK : Supabase missing OR no session. Falls back to localStorage
 *            (per-device). Progress carries forward into LIVE mode the
 *            first time the user signs in: the hook detects it has
 *            local rows that aren't in Supabase yet and fires a
 *            best-effort upsert to migrate them. Local copy is then
 *            wiped so the source of truth becomes Supabase.
 *
 * Hook signature is unchanged so call sites don't move.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const STORAGE_KEY = "au:lesson-progress:v1";

type ProgressMap = Record<string, string>;

/* ------------------------------------------------------------
   localStorage helpers (MOCK mode)
   ------------------------------------------------------------ */

function readLocal(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function writeLocal(map: ProgressMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Quota / privacy-mode — silently no-op.
  }
}

function clearLocal() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function key(courseSlug: string, lessonSlug: string): string {
  return `${courseSlug}:${lessonSlug}`;
}

export function useCourseProgress(courseSlug: string, lessonSlugs: string[]) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  // Track which mode the hook is operating in (set after first effect).
  const modeRef = useRef<"mock" | "live" | null>(null);
  const memberIdRef = useRef<string | null>(null);

  // Reduce slugs array to a primitive string so the effect dep is
  // stable — otherwise inline `lessons.map(...)` callers would loop.
  const slugsKey = lessonSlugs.join("|");

  // Hydrate on mount: try Supabase first, fall back to localStorage.
  useEffect(() => {
    let cancelled = false;
    const slugs = slugsKey ? slugsKey.split("|") : [];

    (async () => {
      const supabase = createSupabaseBrowserClient();
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // LIVE mode — pull this course's rows and use them as the
          // source of truth. Also: if there are local rows hanging
          // around from before the user signed in, migrate them up.
          modeRef.current = "live";
          memberIdRef.current = user.id;

          const local = readLocal();
          const localSlugs = Object.keys(local)
            .filter((k) => k.startsWith(`${courseSlug}:`))
            .map((k) => k.slice(courseSlug.length + 1));

          if (localSlugs.length > 0) {
            // Best-effort migration. RLS will block unauthorised inserts.
            await supabase.from("lesson_progress").upsert(
              localSlugs.map((s) => ({
                member_id: user.id,
                course_slug: courseSlug,
                lesson_slug: s,
                completed_at: local[`${courseSlug}:${s}`],
              })),
              { onConflict: "member_id,course_slug,lesson_slug" },
            );
            // Clear local so future writes don't double-up.
            clearLocal();
          }

          const { data: rows } = await supabase
            .from("lesson_progress")
            .select("lesson_slug")
            .eq("member_id", user.id)
            .eq("course_slug", courseSlug);

          if (cancelled) return;
          const next = new Set<string>(
            (rows ?? [])
              .map((r) => r.lesson_slug as string)
              .filter((s) => slugs.includes(s)),
          );
          setCompleted(next);
          return;
        }
      }

      // MOCK mode — localStorage.
      modeRef.current = "mock";
      memberIdRef.current = null;
      const map = readLocal();
      const next = new Set<string>();
      for (const slug of slugs) {
        if (map[key(courseSlug, slug)]) next.add(slug);
      }
      if (cancelled) return;
      setCompleted(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [courseSlug, slugsKey]);

  const markComplete = useCallback(
    async (lessonSlug: string) => {
      // Optimistic local state update first.
      setCompleted((prev) => new Set(prev).add(lessonSlug));

      if (modeRef.current === "live" && memberIdRef.current) {
        const supabase = createSupabaseBrowserClient();
        if (supabase) {
          await supabase.from("lesson_progress").upsert(
            {
              member_id: memberIdRef.current,
              course_slug: courseSlug,
              lesson_slug: lessonSlug,
              completed_at: new Date().toISOString(),
            },
            { onConflict: "member_id,course_slug,lesson_slug" },
          );
          return;
        }
      }
      // MOCK
      const map = readLocal();
      map[key(courseSlug, lessonSlug)] = new Date().toISOString();
      writeLocal(map);
    },
    [courseSlug],
  );

  const markIncomplete = useCallback(
    async (lessonSlug: string) => {
      setCompleted((prev) => {
        const next = new Set(prev);
        next.delete(lessonSlug);
        return next;
      });

      if (modeRef.current === "live" && memberIdRef.current) {
        const supabase = createSupabaseBrowserClient();
        if (supabase) {
          await supabase
            .from("lesson_progress")
            .delete()
            .eq("member_id", memberIdRef.current)
            .eq("course_slug", courseSlug)
            .eq("lesson_slug", lessonSlug);
          return;
        }
      }
      // MOCK
      const map = readLocal();
      delete map[key(courseSlug, lessonSlug)];
      writeLocal(map);
    },
    [courseSlug],
  );

  const isComplete = useCallback(
    (lessonSlug: string) => completed.has(lessonSlug),
    [completed],
  );

  return { completed, markComplete, markIncomplete, isComplete };
}

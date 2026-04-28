/**
 * LessonKeyboardNav — listens for arrow-key + M keypresses on the
 * lesson page so course-platform muscle memory works:
 *
 *   ←  / J  → previous lesson
 *   →  / L  → next lesson
 *   M       → toggle mark-complete on the current lesson
 *
 * Renders nothing visible — it's a behaviour-only client component.
 * The keypresses are ignored when an input/textarea/contenteditable
 * has focus, when a modifier (cmd/ctrl/alt) is held, or when the
 * default would otherwise scroll the page.
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCourseProgress } from "@/lib/lessonProgress";

interface Props {
  courseSlug: string;
  lessonSlugs: string[];
  currentSlug: string;
  prevHref: string | null;
  nextHref: string | null;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if (target.isContentEditable) return true;
  return false;
}

export function LessonKeyboardNav({
  courseSlug,
  lessonSlugs,
  currentSlug,
  prevHref,
  nextHref,
}: Props) {
  const router = useRouter();
  const { isComplete, markComplete, markIncomplete } = useCourseProgress(
    courseSlug,
    lessonSlugs,
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      if (isTypingTarget(e.target)) return;

      switch (e.key) {
        case "ArrowLeft":
        case "j":
        case "J": {
          if (prevHref) {
            e.preventDefault();
            router.push(prevHref);
          }
          break;
        }
        case "ArrowRight":
        case "l":
        case "L": {
          if (nextHref) {
            e.preventDefault();
            router.push(nextHref);
          }
          break;
        }
        case "m":
        case "M": {
          e.preventDefault();
          if (isComplete(currentSlug)) markIncomplete(currentSlug);
          else markComplete(currentSlug);
          break;
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    router,
    prevHref,
    nextHref,
    currentSlug,
    isComplete,
    markComplete,
    markIncomplete,
  ]);

  return null;
}

/**
 * StartFreeCourseButton — in-dashboard equivalent of the public
 * OptInForm. Posts to /api/members/enrol-free, then navigates to the
 * course on success.
 *
 * Behaviour:
 *   idle      → "Start free course →"
 *   submitting → "Starting…" (disabled)
 *   success   → router.push(redirectTo) — usually /members/courses/<slug>
 *   error     → small error line under the button, retryable
 *
 * Same Kartra list/tag the public form uses, so the nurture sequence
 * fires identically. See PROJECT-STATE.md §13.1.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  courseSlug: string;
  /** Optional className to harmonise with surrounding tile typography. */
  className?: string;
};

export function StartFreeCourseButton({ courseSlug, className }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/members/enrol-free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        redirectTo?: string;
      };
      if (!res.ok || !data.ok) {
        setSubmitting(false);
        setError(data.error ?? "Couldn't start the course. Try again.");
        return;
      }
      router.push(data.redirectTo ?? `/members/courses/${courseSlug}`);
      router.refresh();
    } catch {
      setSubmitting(false);
      setError("Network hiccup. Try again.");
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={submitting}
        className={
          className ??
          "font-section font-semibold uppercase tracking-[0.1em] text-[0.6875rem] text-au-pink hover:text-au-charcoal transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        }
      >
        {submitting ? "Starting…" : "Start free course →"}
      </button>
      {error && (
        <span
          role="alert"
          className="font-section uppercase tracking-[0.1em] text-[0.625rem] text-au-mid"
        >
          {error}
        </span>
      )}
    </span>
  );
}

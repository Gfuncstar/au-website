/**
 * LessonRating — five-star rating widget at the foot of every lesson.
 *
 * Members rate the lesson 1–5 and optionally leave a short comment.
 * Submission posts to /api/members/rate-lesson which upserts the row,
 * so re-rating updates the existing entry rather than stacking.
 *
 * MOCK mode (no Supabase / no session) keeps the widget visible but
 * shows a calm "sign in to rate" hint instead of a working form.
 */

"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface Props {
  courseSlug: string;
  lessonSlug: string;
}

export function LessonRating({ courseSlug, lessonSlug }: Props) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  // On mount: try to read the member's existing rating for this lesson.
  // If they're not signed in (MOCK mode), skip the fetch and show the
  // sign-in hint variant instead.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        if (!cancelled) setSignedIn(false);
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setSignedIn(false);
        return;
      }
      if (!cancelled) setSignedIn(true);
      const { data } = await supabase
        .from("lesson_ratings")
        .select("rating, comment")
        .eq("member_id", user.id)
        .eq("course_slug", courseSlug)
        .eq("lesson_slug", lessonSlug)
        .maybeSingle();
      if (cancelled || !data) return;
      setRating(data.rating ?? 0);
      setComment((data.comment as string) ?? "");
    })();
    return () => {
      cancelled = true;
    };
  }, [courseSlug, lessonSlug]);

  async function submit(nextRating: number, nextComment: string) {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/members/rate-lesson", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          lessonSlug,
          rating: nextRating,
          comment: nextComment,
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        if (json.error === "no_session") {
          setSignedIn(false);
        } else {
          setError(
            "Couldn't save your rating. Try again in a moment.",
          );
        }
        return;
      }
      setSavedAt(Date.now());
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function pickStar(value: number) {
    setRating(value);
    setSavedAt(null);
    submit(value, comment);
  }

  function handleCommentBlur() {
    if (rating === 0) return;
    submit(rating, comment);
  }

  // Signed-out / MOCK-mode variant: keep the prompt visible so the
  // feature is discoverable, but render an inert placeholder rather
  // than a dead form. Preview-link viewers and dev-mode previewers
  // both land here.
  if (signedIn === false) {
    return (
      <section
        aria-label="Rate this lesson"
        className="not-prose mt-12 pt-8 border-t border-au-charcoal/10 max-w-3xl"
      >
        <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.7rem] text-au-mid mb-2">
          How was this lesson?
        </p>
        <p className="text-[0.9375rem] text-au-charcoal/85 leading-relaxed">
          Sign in to save your rating and feedback. Your input helps
          Bernadette tighten the curriculum.
        </p>
      </section>
    );
  }

  const display = hover > 0 ? hover : rating;

  return (
    <section
      aria-label="Rate this lesson"
      className="not-prose mt-12 pt-8 border-t border-au-charcoal/10 max-w-3xl"
    >
      <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.7rem] text-au-mid mb-2">
        How was this lesson?
      </p>
      <p className="text-[0.9375rem] text-au-charcoal/85 mb-4 leading-relaxed">
        Tap a star. Your feedback helps Bernadette tighten the curriculum.
      </p>

      <div
        role="radiogroup"
        aria-label="Lesson rating"
        className="flex items-center gap-1.5"
      >
        {[1, 2, 3, 4, 5].map((value) => {
          const filled = value <= display;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={value === rating}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              disabled={submitting}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(0)}
              onFocus={() => setHover(value)}
              onBlur={() => setHover(0)}
              onClick={() => pickStar(value)}
              className="p-1 -m-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-au-pink rounded-[3px]"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7"
                aria-hidden="true"
                style={{
                  fill: filled ? "var(--color-au-pink)" : "transparent",
                  stroke: filled ? "var(--color-au-pink)" : "currentColor",
                  strokeWidth: filled ? 1.5 : 1.5,
                  color: "var(--color-au-charcoal)",
                  opacity: filled ? 1 : 0.45,
                  transition: "opacity 0.2s, fill 0.15s, stroke 0.15s",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3l2.6 5.6 6.1.5-4.7 4 1.5 6.1L12 16l-5.5 3.2 1.5-6.1-4.7-4 6.1-.5L12 3z"
                />
              </svg>
            </button>
          );
        })}
      </div>

      {rating > 0 && (
        <div className="mt-5">
          <label
            htmlFor="lesson-rating-comment"
            className="block font-section font-semibold uppercase tracking-[0.12em] text-[0.7rem] text-au-mid mb-2"
          >
            One thing you'd flag (optional)
          </label>
          <textarea
            id="lesson-rating-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 1000))}
            onBlur={handleCommentBlur}
            placeholder="What worked, what didn't, what was missing."
            rows={3}
            disabled={submitting}
            className="w-full bg-transparent border border-au-charcoal/20 focus:border-au-pink focus:outline-none rounded-[3px] px-3 py-2.5 text-[0.9375rem] text-au-charcoal placeholder:text-au-charcoal/40 transition-colors"
          />
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="mt-3 font-section font-semibold uppercase tracking-[0.1em] text-[0.7rem] text-[#FF1F8F]"
        >
          {error}
        </p>
      )}
      {savedAt && !error && !submitting && (
        <p className="mt-3 font-section font-semibold uppercase tracking-[0.1em] text-[0.7rem] text-au-pink">
          Saved. Thank you.
        </p>
      )}
    </section>
  );
}

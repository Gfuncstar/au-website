/**
 * StickyEnrolBar — mobile-only bottom-pinned bar shown on every
 * course detail page. Keeps the price + Enrol CTA visible no matter
 * how deep the visitor has scrolled into the curriculum / FAQs / etc.
 *
 * Hidden on md+ (the desktop hero CTA stays in eyeline naturally).
 * Hidden until the visitor has scrolled past the hero — otherwise it
 * doubles up with the hero CTA. Resurfaces with a subtle slide.
 *
 * For free tasters the bar links to the in-page #opt-in anchor; for
 * paid + waitlist courses it links to course.kartraUrl (same destination
 * as the hero Button).
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Props = {
  /** Short title shown on the bar — usually the course title. */
  title: string;
  /** GBP price; undefined for free tasters. */
  price?: number;
  /** Where the enrol CTA points. For free tasters typically "#opt-in". */
  href: string;
  /** "Enrol now" / "Get instant access" / "Join the waitlist" — same
   *  string the hero Button uses, kept in sync at the call site. */
  ctaText: string;
  /** Whether the course is on a waitlist. */
  isWaitlist: boolean;
  /** Course slug — required for the signed-in free-taster shortcut so
   *  the bar can call /api/members/enrol-free directly. Without it the
   *  bar falls back to the normal Link behaviour. */
  courseSlug?: string;
};

export function StickyEnrolBar({
  title,
  price,
  href,
  ctaText,
  isWaitlist,
  courseSlug,
}: Props) {
  const [visible, setVisible] = useState(false);

  // Auth-aware shortcut. When a signed-in member sees a free taster
  // they don't own, the bar fires /api/members/enrol-free directly
  // instead of jumping them to the opt-in form (which would just ask
  // for an email we already have). For paid + waitlist courses we
  // never apply this shortcut — those flows still go through Kartra.
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolError, setEnrolError] = useState(false);

  const isFreeCourse = !isWaitlist && price === undefined;
  const useEnrolShortcut = signedIn === true && isFreeCourse && Boolean(courseSlug);

  useEffect(() => {
    if (!isFreeCourse) return; // No need to check auth for paid courses.
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setSignedIn(false);
      return;
    }
    let cancelled = false;
    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) setSignedIn(Boolean(data.user));
    });
    return () => {
      cancelled = true;
    };
  }, [isFreeCourse]);

  async function handleEnrol() {
    if (!courseSlug) return;
    setEnrolling(true);
    setEnrolError(false);
    try {
      const res = await fetch("/api/members/enrol-free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        redirectTo?: string;
      };
      if (!res.ok || !data.ok) {
        setEnrolling(false);
        setEnrolError(true);
        return;
      }
      window.location.href = data.redirectTo ?? `/members/courses/${courseSlug}`;
    } catch {
      setEnrolling(false);
      setEnrolError(true);
    }
  }

  // Show after the visitor has scrolled ~80% of the first viewport
  // height — far enough that the hero CTA is gone, close enough that
  // the bar feels native to the page rather than a delayed pop-up.
  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerHeight * 0.85;
      setVisible(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const priceLabel =
    isWaitlist
      ? "Waitlist"
      : price === undefined
        ? "Free"
        : `£${price.toLocaleString("en-GB")}`;

  return (
    <div
      role="region"
      aria-label="Enrol on this course"
      className={[
        "md:hidden fixed inset-x-0 bottom-0 z-40",
        "bg-au-charcoal/95 backdrop-blur supports-[backdrop-filter]:bg-au-charcoal/85",
        "border-t border-au-white/10",
        "transition-transform duration-300 ease-out",
        visible
          ? "translate-y-0"
          : "translate-y-full pointer-events-none",
      ].join(" ")}
    >
      <div className="px-4 sm:px-[35px] py-3 flex items-center gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <p
            className="font-display font-bold text-au-white text-[0.8125rem] sm:text-[0.875rem] leading-tight line-clamp-2"
            style={{ letterSpacing: "var(--tracking-tight-display)" }}
          >
            {title}
          </p>
          <p
            className="font-display font-black leading-none mt-1"
            style={{
              fontSize: "0.8125rem",
              color: "var(--color-au-pink)",
              letterSpacing: "var(--tracking-tight-display)",
            }}
          >
            {useEnrolShortcut ? "Free, signed in" : priceLabel}
          </p>
        </div>
        {useEnrolShortcut ? (
          <button
            type="button"
            onClick={handleEnrol}
            disabled={enrolling}
            className="shrink-0 inline-flex items-center gap-1 sm:gap-1.5 bg-[var(--color-au-pink)] hover:bg-au-white text-au-charcoal font-display font-bold uppercase tracking-[0.05em] rounded-[5px] px-3 sm:px-4 py-3 min-h-[44px] text-[0.75rem] sm:text-[0.8125rem] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label={`Add ${title} to your dashboard`}
          >
            <span>
              {enrolling
                ? "Adding…"
                : enrolError
                  ? "Try again"
                  : "Add to dashboard"}
            </span>
            {!enrolling && <span aria-hidden="true">→</span>}
          </button>
        ) : (
          <Link
            href={href}
            className="shrink-0 inline-flex items-center gap-1 sm:gap-1.5 bg-[var(--color-au-pink)] hover:bg-au-white text-au-charcoal font-display font-bold uppercase tracking-[0.05em] rounded-[5px] px-3 sm:px-4 py-3 min-h-[44px] text-[0.75rem] sm:text-[0.8125rem] transition-colors"
          >
            <span>{ctaText}</span>
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </div>
  );
}

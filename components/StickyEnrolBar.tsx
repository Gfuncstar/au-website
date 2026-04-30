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
};

export function StickyEnrolBar({
  title,
  price,
  href,
  ctaText,
  isWaitlist,
}: Props) {
  const [visible, setVisible] = useState(false);

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
      <div className="px-[35px] py-3 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p
            className="font-display font-bold text-au-white text-[0.875rem] leading-tight truncate"
            style={{ letterSpacing: "var(--tracking-tight-display)" }}
          >
            {title}
          </p>
          <p
            className="font-display font-black leading-none mt-0.5"
            style={{
              fontSize: "0.9375rem",
              color: "var(--color-au-pink)",
              letterSpacing: "var(--tracking-tight-display)",
            }}
          >
            {priceLabel}
          </p>
        </div>
        <Link
          href={href}
          className="shrink-0 inline-flex items-center gap-1.5 bg-[var(--color-au-pink)] hover:bg-au-white text-au-charcoal font-display font-bold uppercase tracking-[0.05em] rounded-[5px] px-4 py-3 min-h-[44px] text-[0.8125rem] transition-colors"
        >
          <span>{ctaText}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

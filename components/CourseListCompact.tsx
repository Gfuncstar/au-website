/**
 * CourseListCompact — homepage course list, professional and tight.
 *
 * Built per Giles' "this part of the home page is too big and too salesy
 * for a landing page. Maybe just a list of the courses in a professional
 * aesthetic look that will link through to the bigger courses" call.
 *
 * Each row: category eyebrow + title + short summary + price/format +
 * arrow. Click anywhere on the row to go to the full course page where
 * the marketing depth lives.
 *
 * The big image-backed CourseCard grid is now reserved for /courses
 * (the dedicated index page where it belongs).
 */

"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { COURSES } from "@/lib/courses";
import { CourseIllustrationFor } from "@/components/CourseIllustration";
import { FreeBadge } from "@/components/FreeBadge";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const rowVariants: Variants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function CourseListCompact() {
  return (
    <motion.ul
      className="flex flex-col"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {COURSES.map((c) => {
        const isFree = c.price === undefined;
        const priceLabel =
          c.price === undefined ? null : `£${c.price.toLocaleString("en-GB")}`;

        return (
          <motion.li
            key={c.slug}
            variants={rowVariants}
            className="border-b border-au-charcoal/15 first:border-t"
          >
            <Link
              href={`/courses/${c.slug}`}
              className="group block py-7 sm:py-8 px-5 -mx-5 grid grid-cols-[1fr_auto_auto] gap-x-4 sm:gap-x-7 items-start transition-colors hover:bg-au-charcoal"
            >
              {/* Left column — eyebrow + title + summary. Text flips
                  white when the row hovers on AU charcoal. */}
              <div className="min-w-0">
                <p
                  className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] sm:text-[0.75rem] mb-2"
                  style={{ color: "var(--color-au-pink)" }}
                >
                  {c.category} · {c.format}
                  {c.availability === "waitlist" && " · Waitlist"}
                </p>
                <h3
                  className="font-display font-black leading-tight text-au-charcoal group-hover:text-au-white mb-2 transition-colors"
                  style={{
                    fontSize: "clamp(1.25rem, 3vw, 1.625rem)",
                    letterSpacing: "var(--tracking-tight-display)",
                  }}
                >
                  {c.title}
                </h3>
                <p
                  className="text-au-charcoal/70 group-hover:text-au-white/75 transition-colors leading-relaxed max-w-2xl"
                  style={{ fontSize: "clamp(0.9375rem, 2vw, 1.0625rem)" }}
                >
                  {c.summary}
                </p>
              </div>

              {/* Middle column — FREE stamp for free courses, animated
                  thematic course illustration otherwise. They never both
                  render, so the column stays visually balanced. */}
              {isFree ? (
                <FreeBadge className="block w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24" />
              ) : (
                <CourseIllustrationFor
                  slug={c.slug}
                  className="block w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24"
                />
              )}

              {/* Right column — price (paid only) + arrow. */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                {priceLabel && (
                  <span
                    className="font-display font-black leading-none whitespace-nowrap"
                    style={{
                      fontSize: "clamp(1rem, 2.4vw, 1.25rem)",
                      color: "var(--color-au-pink)",
                      letterSpacing: "var(--tracking-tight-display)",
                    }}
                  >
                    {priceLabel}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className="font-display font-black text-au-charcoal/40 group-hover:text-[var(--color-au-pink)] group-hover:translate-x-0.5 transition-all leading-none"
                  style={{ fontSize: "1.5rem" }}
                >
                  →
                </span>
              </div>
            </Link>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

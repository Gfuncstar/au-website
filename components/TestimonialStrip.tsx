/**
 * TestimonialStrip — 3-up grid of student-voice quotes.
 *
 * Sits on the homepage (between courses + standards) and on each
 * course detail page (filtered to that course's testimonials, with
 * homepage as fallback if there are none yet).
 *
 * Visual treatment matches the rest of the AU brand language:
 *   - Pink quotation-mark mark in the upper-left of each card
 *   - Quote in serif italic (Spectral) for the editorial-poster feel
 *   - Cite line at the bottom (name · role · location) in Oswald caps
 *
 * Placeholder annotation: when an entry has `placeholder: true`, a
 * small "SAMPLE" badge appears in the upper-right corner of the card
 * — visible enough to remind whoever's reviewing the staging site
 * that real testimonials are still pending, subtle enough that it
 * doesn't ruin the visual rhythm during demo.
 */

"use client";

import { motion, type Variants } from "framer-motion";
import type { Testimonial } from "@/lib/testimonials";
import { Eyebrow } from "./Eyebrow";

type Props = {
  /** Quotes to render. Pre-filter at the call site if you need a subset. */
  testimonials: readonly Testimonial[];
  /** Eyebrow label above the headline. */
  eyebrow?: string;
  /** Big headline above the grid. */
  headline?: React.ReactNode;
  /** Tone — drives the surface colours so the strip can sit on cream / white / black. */
  tone?: "cream" | "white" | "black";
  /** Maximum testimonials to show. Default 3. */
  max?: number;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function TestimonialStrip({
  testimonials,
  eyebrow = "From the cohort",
  headline,
  tone = "white",
  max = 3,
}: Props) {
  const items = testimonials.slice(0, max);
  if (items.length === 0) return null;

  const isDark = tone === "black";
  const headlineColour = isDark ? "text-au-white" : "text-au-charcoal";
  const cardBg = isDark
    ? "bg-au-white/5 border-au-white/15"
    : "bg-au-white border-au-charcoal/15";
  const quoteColour = isDark ? "text-au-white/90" : "text-au-charcoal/90";
  const citeNameColour = isDark ? "text-au-white" : "text-au-charcoal";
  const citeMetaColour = isDark ? "text-au-white/60" : "text-au-charcoal/60";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="max-w-6xl"
    >
      <div className="max-w-3xl mb-10 sm:mb-12">
        <motion.div variants={itemVariants}>
          <Eyebrow color={isDark ? "pink" : "pink"} className="mb-6">
            {eyebrow}
          </Eyebrow>
        </motion.div>
        {headline && (
          <motion.h2
            variants={itemVariants}
            className={`font-display font-black ${headlineColour}`}
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              lineHeight: 1.05,
              letterSpacing: "var(--tracking-tight-display)",
            }}
          >
            {headline}
          </motion.h2>
        )}
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {items.map((t) => (
          <motion.li
            key={t.id}
            variants={itemVariants}
            className={`relative border rounded-[5px] p-6 sm:p-7 flex flex-col ${cardBg}`}
          >
            {/* Big pink quote mark */}
            <span
              aria-hidden="true"
              className="font-display font-black leading-none mb-4"
              style={{
                fontSize: "3.5rem",
                color: "var(--color-au-pink)",
              }}
            >
              &ldquo;
            </span>

            {/* Placeholder badge — visible reminder during staging */}
            {t.placeholder && (
              <span
                className="absolute top-4 right-4 inline-block px-2 py-1 font-section font-semibold uppercase tracking-[0.18em] text-[0.5625rem] border rounded-[3px]"
                style={{
                  borderColor: "var(--color-au-pink)",
                  color: "var(--color-au-pink)",
                }}
                title="Placeholder — real testimonial pending consent"
              >
                Sample
              </span>
            )}

            <blockquote
              className={`${quoteColour} font-serif italic leading-relaxed mb-6 flex-1`}
              style={{
                fontFamily: "var(--font-spectral), serif",
                fontSize: "clamp(0.9375rem, 2vw, 1.0625rem)",
              }}
            >
              {t.quote}
            </blockquote>

            <cite className="not-italic flex flex-col gap-0.5">
              <span
                className={`font-display font-bold ${citeNameColour}`}
                style={{
                  fontSize: "0.9375rem",
                  letterSpacing: "var(--tracking-tight-display)",
                }}
              >
                {t.name}
              </span>
              <span
                className={`font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] ${citeMetaColour}`}
              >
                {t.role} · {t.location}
              </span>
            </cite>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

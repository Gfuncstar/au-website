/**
 * TestimonialQuote — a single big pull-quote from a student.
 *
 * Different from TestimonialStrip — this is for moments where ONE
 * voice carries the section (e.g. mid-page on /regulation, where a
 * single anchored testimonial reads stronger than a 3-up grid).
 *
 * Visual language matches QuotePoster (Bernadette pull-quotes) but
 * with a "from the cohort" eyebrow + cite line in student form.
 */

"use client";

import { motion, type Variants } from "framer-motion";
import type { Testimonial } from "@/lib/testimonials";
import { Eyebrow } from "./Eyebrow";

type Props = {
  testimonial: Testimonial;
  /** Eyebrow above the quote. */
  eyebrow?: string;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function TestimonialQuote({
  testimonial,
  eyebrow = "From a student",
}: Props) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="max-w-3xl mx-auto text-center"
    >
      <motion.div variants={itemVariants}>
        <Eyebrow className="mb-8 justify-center">{eyebrow}</Eyebrow>
      </motion.div>

      {/* Pink quote mark */}
      <motion.span
        variants={itemVariants}
        aria-hidden="true"
        className="block font-display font-black leading-none mx-auto"
        style={{
          fontSize: "5rem",
          color: "var(--color-au-pink)",
          marginBottom: "0.75rem",
        }}
      >
        &ldquo;
      </motion.span>

      <motion.blockquote
        variants={itemVariants}
        className="font-serif italic text-au-charcoal leading-snug"
        style={{
          fontFamily: "var(--font-spectral), serif",
          fontSize: "clamp(1.25rem, 3.6vw, 2rem)",
        }}
      >
        {testimonial.quote}
      </motion.blockquote>

      <motion.cite
        variants={itemVariants}
        className="not-italic mt-8 sm:mt-10 inline-flex flex-col items-center gap-1"
      >
        <span
          className="font-display font-bold text-au-charcoal"
          style={{
            fontSize: "1rem",
            letterSpacing: "var(--tracking-tight-display)",
          }}
        >
          {testimonial.name}
        </span>
        <span className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] text-au-charcoal/60">
          {testimonial.role} · {testimonial.location}
        </span>
        {testimonial.placeholder && (
          <span
            className="mt-2 inline-block px-2 py-1 font-section font-semibold uppercase tracking-[0.18em] text-[0.5625rem] border rounded-[3px]"
            style={{
              borderColor: "var(--color-au-pink)",
              color: "var(--color-au-pink)",
            }}
            title="Placeholder — real testimonial pending consent"
          >
            Sample
          </span>
        )}
      </motion.cite>
    </motion.div>
  );
}

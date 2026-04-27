/**
 * EducationalApproach — homepage section that surfaces *how* AU teaches.
 *
 * Built per Giles' "very in-depth, very educational, very authoritative"
 * call. The course-content captures show two distinct voices: marketing
 * (sales pages) and course-content (warm mentor inside the lessons).
 * This section makes the educator-mentor stance visible BEFORE someone
 * commits to a course — answering "what is this teacher actually like?"
 *
 * Three principles, each anchored to a load-bearing brand phrase that
 * appears verbatim across the actual course content.
 */

"use client";

import { motion, type Variants } from "framer-motion";
import { Eyebrow } from "./Eyebrow";
import { PrinciplesIllustration } from "./SectionIllustration";

const PRINCIPLES = [
  {
    num: "01",
    title: "Education over enforcement",
    body: "AU teaches from the position of mentorship, not punishment. Regulation in aesthetics has been fragmented, poorly communicated, and inconsistently applied — feeling unsure isn't a failure, it's information. Every course starts from there.",
    quote:
      "There is no judgement here. There is no shaming. The system failed to prepare you. This is about putting that right.",
    quoteFrom: "RAG 2-Day · Welcome",
  },
  {
    num: "02",
    title: "Clarity before confidence",
    body: "AU courses don't ask you to perform certainty. They build the underlying judgement first — clinical reasoning, regulatory framework, business numbers — so confidence becomes a byproduct of competence.",
    quote:
      "Profit is a byproduct of clarity, not complexity. You're not here to fit into the industry — you're here to find your place within it.",
    quoteFrom: "5K+ Formula Mini · Day 3",
  },
  {
    num: "03",
    title: "Defensible, not popular",
    body: "Every clinical decision in an AU course is taught with one question in mind: can you justify this on paper? Treatments are taught NICE-aligned. Regulation is taught Traffic-Light-aligned. Marketing is taught ASA-aligned. The work has to hold up in the room where it matters.",
    quote:
      "If you can't justify it on paper, you can't defend it in practice.",
    quoteFrom: "RAG 2-Day · Module 2",
  },
] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 32, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function EducationalApproach() {
  return (
    <motion.div
      className="max-w-5xl"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <motion.div variants={itemVariants}>
        <Eyebrow className="mb-6">How AU teaches</Eyebrow>
      </motion.div>

      <motion.h2
        variants={itemVariants}
        className="font-display font-black text-au-charcoal mb-12 sm:mb-14"
        style={{
          fontSize: "var(--text-poster)",
          lineHeight: "var(--leading-poster)",
          letterSpacing: "var(--tracking-tight-display)",
        }}
      >
        {/* Three connected principles — visual echo of the three numbered
            principles below. */}
        <PrinciplesIllustration
          className="float-right ml-4 sm:ml-5 -mt-1 w-[88px] h-[88px] sm:w-[112px] sm:h-[112px] md:w-[132px] md:h-[132px]"
        />
        Calm, clinical,{" "}
        <span style={{ color: "var(--color-au-pink)" }}>defensible</span>.
      </motion.h2>

      <motion.p
        variants={itemVariants}
        className="max-w-2xl text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] text-au-charcoal/80 leading-relaxed mb-12 sm:mb-14"
      >
        Three principles run through every AU course — clinical, regulatory,
        and business. They&rsquo;re what makes the work hold up at the
        regulator&rsquo;s office, the bank, and the consultation room.
      </motion.p>

      <ul className="flex flex-col gap-10 sm:gap-12">
        {PRINCIPLES.map((p) => (
          <motion.li
            key={p.num}
            variants={itemVariants}
            className="grid grid-cols-[auto_1fr] gap-x-6 sm:gap-x-9 items-start"
          >
            <div className="flex flex-col items-start gap-2 pt-1">
              <span
                className="font-display font-black leading-none"
                style={{
                  fontSize: "clamp(1.875rem, 4.4vw, 2.5rem)",
                  color: "var(--color-au-pink)",
                  letterSpacing: "var(--tracking-tight-display)",
                }}
              >
                {p.num}
              </span>
              <span
                aria-hidden="true"
                className="block h-[2px] w-11"
                style={{ backgroundColor: "var(--color-au-pink)" }}
              />
            </div>

            <div>
              <h3
                className="leading-tight mb-3"
                style={{
                  fontSize: "clamp(1.25rem, 3vw, 1.625rem)",
                  color: "var(--color-au-pink)",
                }}
              >
                {p.title}
              </h3>
              <p
                className="text-au-charcoal/80 leading-relaxed mb-4 sm:mb-5"
                style={{ fontSize: "clamp(1rem, 2.2vw, 1.125rem)" }}
              >
                {p.body}
              </p>
              <blockquote
                className="border-l-2 pl-4 sm:pl-5 italic text-au-charcoal/70 leading-relaxed"
                style={{
                  borderColor: "var(--color-au-pink)",
                  fontSize: "clamp(0.9375rem, 2vw, 1.0625rem)",
                }}
              >
                <p className="mb-2">&ldquo;{p.quote}&rdquo;</p>
                <cite className="not-italic font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] text-au-charcoal/55">
                  {p.quoteFrom}
                </cite>
              </blockquote>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

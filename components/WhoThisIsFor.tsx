/**
 * WhoThisIsFor — homepage "This is for you if…" block.
 *
 * Per Giles' "this section needs some real love. It needs to be bolder.
 * It needs to have animation. It needs the rest of the website for
 * inspiration." call.
 *
 * Design language pulled from across the site:
 *   - Headline reveals line-by-line through an overflow-hidden band
 *     (same pattern as RevealHeadline, same easing as the hero cascade).
 *   - Each bullet row enters in sequence with the same y:32 → 0,
 *     opacity 0 → 1, expo-out curve as the hero items.
 *   - Big numbered ledger-style left column — display Montserrat black at
 *     2.25rem, sits in its own gutter with an animated pink rule that
 *     draws in beneath the digits (same gesture as the Three Pillars).
 *   - Bold body type — bumped from Lato 400 to Lato 700, so even the
 *     unhighlighted text reads as a confident pull-quote rather than
 *     small print. The pink key phrase still pops on top of that.
 *   - Generous spacing between rows so the section feels like a poster
 *     setlist, not a clipped FAQ.
 *
 * All animations once-only via `viewport={{ once: true }}`.
 */

"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";
import { AudienceIllustration } from "./SectionIllustration";

type Bullet = {
  num: string;
  /** Bold pink header — the key concept the row is about. */
  header: string;
  /** Subheader — descriptive context beneath the header. */
  sub: ReactNode;
};

/**
 * Bullets restructured into header + subheader pairs per Giles' "always
 * headers and subheaders for ease of understanding" call. The header
 * carries the punchline (formerly the bolded pink phrase inline); the
 * sub carries the qualifying context.
 */
const BULLETS: Bullet[] = [
  {
    num: "01",
    header: "Where the business is going",
    sub: (
      <>
        You&rsquo;re a year or three into aesthetics, technically capable, and
        privately unsure.
      </>
    ),
  },
  {
    num: "02",
    header: "“Busy” vs “profitable”",
    sub: <>You run a clinic and you can feel the difference.</>,
  },
  {
    num: "03",
    header: "Before someone else decides for you",
    sub: (
      <>
        You practise in England and you want to know exactly where you sit on
        the regulatory map.
      </>
    ),
  },
  {
    num: "04",
    header: "A reputation that compounds",
    sub: <>You&rsquo;d rather build that than chase the next viral treatment.</>,
  },
];

/* ============================================================
   Variants
   ============================================================ */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const headlineLineVariants: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const eyebrowVariants: Variants = {
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const rowVariants: Variants = {
  hidden: { y: 32, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function WhoThisIsFor() {
  return (
    <motion.div
      className="max-w-4xl"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {/* Concentric audience target, float-right so eyebrow + headline
          + bullets wrap around it. */}
      <AudienceIllustration
        className="float-right ml-4 sm:ml-5 -mt-1 w-[88px] h-[88px] sm:w-[112px] sm:h-[112px] md:w-[132px] md:h-[132px]"
      />

      {/* Eyebrow */}
      <motion.div variants={eyebrowVariants}>
        <Eyebrow className="mb-6">Who this is for</Eyebrow>
      </motion.div>

      {/* Headline, line-by-line reveal through overflow-hidden bands.
          Same gesture as the hero so the whole site reads with one motion
          language. */}
      <h2
        className="font-display font-black text-au-charcoal mb-12 sm:mb-14"
        style={{
          fontSize: "var(--text-poster)",
          lineHeight: "var(--leading-poster)",
          letterSpacing: "var(--tracking-tight-display)",
        }}
      >
        <span className="block overflow-hidden">
          <motion.span variants={headlineLineVariants} className="block">
            This is for{" "}
            <span style={{ color: "var(--color-au-pink)" }}>you</span>
          </motion.span>
        </span>
        <span className="block overflow-hidden">
          <motion.span variants={headlineLineVariants} className="block">
            if&hellip;
          </motion.span>
        </span>
      </h2>

      {/* Ledger of bullets, staggered, with animated pink rule beneath
          each number. */}
      <ul className="flex flex-col gap-7 sm:gap-9 max-w-3xl">
        {BULLETS.map((b) => (
          <motion.li
            key={b.num}
            variants={rowVariants}
            className="grid grid-cols-[auto_1fr] gap-x-6 sm:gap-x-9 items-start"
          >
            {/* Left column, big display number + animated pink rule. */}
            <div className="flex flex-col items-start gap-2 pt-1">
              <span
                className="font-display font-black leading-none"
                style={{
                  fontSize: "clamp(1.875rem, 4.4vw, 2.5rem)",
                  color: "var(--color-au-pink)",
                  letterSpacing: "var(--tracking-tight-display)",
                }}
              >
                {b.num}
              </span>
              <motion.span
                aria-hidden="true"
                className="block h-[2px]"
                style={{ backgroundColor: "var(--color-au-pink)" }}
                initial={{ width: 0 }}
                whileInView={{ width: "2.75rem" }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.25,
                }}
              />
            </div>

            {/* Right column, header + subheader.
                Bold weight removed per Giles' "remove bold" call, header
                now renders at regular Lato weight, distinguished only by
                size + AU pink. Subheader stays in charcoal at 75%. */}
            <div>
              <h3
                className="leading-tight mb-2"
                style={{
                  fontSize: "clamp(1.25rem, 3vw, 1.625rem)",
                  color: "var(--color-au-pink)",
                }}
              >
                {b.header}
              </h3>
              <p
                className="text-au-charcoal/75 leading-relaxed"
                style={{
                  fontSize: "clamp(1rem, 2.2vw, 1.125rem)",
                }}
              >
                {b.sub}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>

      {/* Who's actually enrolled, calm reassurance for visitors who
          aren't sure they "belong". Speaks to category mix only, no
          fabricated percentages, every label here genuinely fits the
          cohort that takes the courses. */}
      <motion.div
        variants={rowVariants}
        className="mt-10 sm:mt-12 max-w-3xl rounded-[5px] border border-au-charcoal/10 bg-au-white p-5 sm:p-6"
      >
        <p
          className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] sm:text-[0.75rem] mb-3"
          style={{ color: "var(--color-au-pink)" }}
        >
          Who&rsquo;s already inside
        </p>
        <p className="text-au-charcoal/85 leading-relaxed text-[0.9375rem] sm:text-[1.0625rem]">
          The cohort is a deliberate mix:{" "}
          <strong className="font-semibold text-au-charcoal">
            aesthetic nurses, aesthetic doctors, aestheticians, advanced
            facialists, and clinic owners
          </strong>
          , practising across England, Scotland, Wales and Northern
          Ireland. The clinical courses are written for any practitioner
          working with skin; the regulatory and business courses for
          anyone running an aesthetics practice in the UK.
        </p>
      </motion.div>
    </motion.div>
  );
}

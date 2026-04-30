/**
 * MeetBernadette — homepage authority section.
 *
 * New per Giles' "homepage needs to introduce her, what she stands for,
 * what she does, her authority" call. Sits between the hero and the
 * pillars. Two-column at md+; stacked on mobile. Left: Bernadette
 * portrait. Right: name, credentials, bio paragraph, stat strip, link
 * to the About page.
 *
 * Stats and copy pulled from `clone-aesthetics-unlocked/copy.md` (the
 * rewritten ABOUT_ME opening) and `bernadette-credentials.md` (verified
 * facts only).
 */

"use client";

import { motion, type Variants } from "framer-motion";
import { Eyebrow } from "./Eyebrow";
import { Button } from "./Button";
import { ClinicalIllustration } from "./SectionIllustration";

const STATS = [
  { num: "20+", label: "Years nursing" },
  { num: "12", label: "Years in aesthetics" },
  { num: "MSc", label: "Advanced Practice" },
  { num: "NMC", label: "Registered RN" },
] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 28, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function MeetBernadette() {
  return (
    <motion.div
      className="max-w-4xl"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {/* Single-column layout, portrait removed per Giles' "remove" call.
          Bio + bullets + stat strip carry the section. */}
      <div className="flex flex-col">
        <motion.div variants={itemVariants}>
          <Eyebrow className="mb-5">Meet Bernadette</Eyebrow>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="font-display font-black text-au-charcoal mb-6 sm:mb-7"
          style={{
            fontSize: "var(--text-poster)",
            lineHeight: "var(--leading-poster)",
            letterSpacing: "var(--tracking-tight-display)",
          }}
        >
          {/* Stethoscope sits to the right of the headline. `float-right`
              lets the title text wrap around it on every viewport without
              needing a separate column. Sized small on mobile, larger on
              desktop. */}
          <ClinicalIllustration
            className="float-right ml-4 sm:ml-5 -mt-1 w-[88px] h-[88px] sm:w-[112px] sm:h-[112px] md:w-[132px] md:h-[132px]"
          />
          Twelve years in clinic.{" "}
          <span style={{ color: "var(--color-au-pink)" }}>Twenty</span> in
          nursing.
        </motion.h2>

        {/* Identity line, first-person, "Hi, I'm Bernadette" framing
            per Giles' "rewrite in first person" call. */}
        <motion.p
          variants={itemVariants}
          className="text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] text-au-charcoal/85 leading-relaxed mb-4 sm:mb-5"
        >
          Hi, I&rsquo;m{" "}
          <strong className="font-bold">Bernadette Tobin</strong>,{" "}
          <span className="text-au-charcoal/70">RN, MSc Advanced Practice.</span>
        </motion.p>
        <motion.ul
          variants={itemVariants}
          className="flex flex-col gap-2 mb-5 sm:mb-6"
        >
          {[
            "Advanced Nurse Practitioner",
            "Award-winning clinic owner (Visage Aesthetics)",
            "Senior Lecturer (postgraduate clinicians)",
            "Head of Clinical Workforce, NHS Trust",
            <>
              Author of <em>Regulation to Reputation</em>
            </>,
            "Featured in Cosmopolitan magazine",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-baseline gap-3 text-[1rem] sm:text-[1.0625rem] text-au-charcoal/85 leading-relaxed"
            >
              <span
                aria-hidden="true"
                className="font-display font-black shrink-0 leading-none"
                style={{
                  fontSize: "1.125rem",
                  color: "var(--color-au-pink)",
                }}
              >
                +
              </span>
              <span>{item}</span>
            </li>
          ))}
        </motion.ul>

        <motion.p
          variants={itemVariants}
          className="text-[1rem] sm:text-[1.0625rem] text-au-charcoal/75 leading-relaxed mb-8 sm:mb-9"
        >
          I built Aesthetics Unlocked because the gap I kept seeing wasn&rsquo;t
          clinical. The practitioners I knew were technically excellent, they
          were just{" "}
          <span style={{ color: "var(--color-au-pink)" }}>
            exhausted, undercharging, and privately unsure if they were actually
            compliant
          </span>
          . AU is the framework I wish someone had handed me when I started,           the same one I run inside{" "}
          <strong className="font-bold">Visage Aesthetics</strong>, my own
          clinic, which won{" "}
          <span style={{ color: "var(--color-au-pink)" }}>
            Best Non-Surgical Aesthetics Clinic 2026 (Essex)
          </span>
          . What I teach isn&rsquo;t theory. It&rsquo;s what I do.
        </motion.p>

        {/* Stat strip, verified credentials only. */}
        <motion.dl
          variants={itemVariants}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-9 border-t border-au-charcoal/15 pt-6 sm:pt-7"
        >
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col">
              <dt
                className="font-display font-black leading-none mb-1"
                style={{
                  fontSize: "clamp(1.5rem, 3.6vw, 2.25rem)",
                  color: "var(--color-au-pink)",
                  letterSpacing: "var(--tracking-tight-display)",
                }}
              >
                {s.num}
              </dt>
              <dd className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] sm:text-[0.75rem] text-au-charcoal/65">
                {s.label}
              </dd>
            </div>
          ))}
        </motion.dl>

        <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
          <Button href="/about" variant="pink" size="sm">
            More about me
          </Button>
          <Button href="/courses" variant="black" size="sm">
            See the courses
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * SectionIllustration — small line-drawn animated illustrations that sit
 * beside section headlines to fill empty space and add brand presence.
 *
 * Style matches the hero awards icons (HeroLaurelIcon / HeroTrophyIcon):
 * 1.5px pink stroke, currentColor, framer-motion pathLength draw-on
 * animation. Triggers on viewport entry rather than mount, so each
 * section animates as the user scrolls into it.
 *
 * Variants are deliberately thematic to each section — clinical work,
 * three principles, three pillars, the book — rather than generic
 * decorative shapes. Each illustration tells a tiny visual story.
 */

"use client";

import { motion, type Variants } from "framer-motion";

const drawIcon: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.0, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.15 + i * 0.08 },
      opacity: { duration: 0.3, delay: 0.15 + i * 0.08 },
    },
  }),
};

const popIn: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4, delay: 0.5 + i * 0.1, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] },
  }),
};

interface IllustrationWrapProps {
  children: React.ReactNode;
  className?: string;
  ariaLabel: string;
}

function IllustrationWrap({
  children,
  className = "",
  ariaLabel,
}: IllustrationWrapProps) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={ariaLabel}
      className={`shrink-0 ${className}`}
      style={{ color: "var(--color-au-pink)" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.svg>
  );
}

/** Stethoscope — clinical/nursing experience (MeetBernadette). */
export function ClinicalIllustration({ className = "" }: { className?: string }) {
  return (
    <IllustrationWrap className={className} ariaLabel="Clinical experience">
      {/* Tubing — left earpiece down, U-bend, up to right earpiece */}
      <motion.path
        d="M 28 14 L 28 42 C 28 56 38 64 50 64 C 62 64 72 56 72 42 L 72 14"
        variants={drawIcon}
        custom={0}
      />
      {/* Drop down to chest piece */}
      <motion.line x1="50" y1="64" x2="50" y2="78" variants={drawIcon} custom={1} />
      {/* Earpiece tips */}
      <motion.circle
        cx="28"
        cy="14"
        r="3"
        fill="currentColor"
        stroke="none"
        variants={popIn}
        custom={0}
      />
      <motion.circle
        cx="72"
        cy="14"
        r="3"
        fill="currentColor"
        stroke="none"
        variants={popIn}
        custom={0}
      />
      {/* Diaphragm head */}
      <motion.circle cx="50" cy="84" r="8" variants={drawIcon} custom={2} />
      <motion.circle
        cx="50"
        cy="84"
        r="3"
        fill="currentColor"
        stroke="none"
        variants={popIn}
        custom={2}
      />
    </IllustrationWrap>
  );
}

/** Three connected principles — for EducationalApproach. */
export function PrinciplesIllustration({
  className = "",
}: {
  className?: string;
}) {
  return (
    <IllustrationWrap className={className} ariaLabel="Three principles">
      {/* Vertical spine connecting the three principles */}
      <motion.line x1="28" y1="22" x2="28" y2="78" variants={drawIcon} custom={0} />
      {/* Principle 1 */}
      <motion.circle cx="28" cy="22" r="5" variants={drawIcon} custom={1} />
      <motion.line x1="36" y1="22" x2="78" y2="22" variants={drawIcon} custom={1} />
      <motion.line x1="36" y1="28" x2="68" y2="28" variants={drawIcon} custom={1} />
      {/* Principle 2 */}
      <motion.circle cx="28" cy="50" r="5" variants={drawIcon} custom={2} />
      <motion.line x1="36" y1="50" x2="78" y2="50" variants={drawIcon} custom={2} />
      <motion.line x1="36" y1="56" x2="68" y2="56" variants={drawIcon} custom={2} />
      {/* Principle 3 */}
      <motion.circle cx="28" cy="78" r="5" variants={drawIcon} custom={3} />
      <motion.line x1="36" y1="78" x2="78" y2="78" variants={drawIcon} custom={3} />
      <motion.line x1="36" y1="84" x2="68" y2="84" variants={drawIcon} custom={3} />
      {/* Filled centre dots — pop in last */}
      <motion.circle
        cx="28"
        cy="22"
        r="2"
        fill="currentColor"
        stroke="none"
        variants={popIn}
        custom={0}
      />
      <motion.circle
        cx="28"
        cy="50"
        r="2"
        fill="currentColor"
        stroke="none"
        variants={popIn}
        custom={1}
      />
      <motion.circle
        cx="28"
        cy="78"
        r="2"
        fill="currentColor"
        stroke="none"
        variants={popIn}
        custom={2}
      />
    </IllustrationWrap>
  );
}

/** Three pillars under a single architrave — for ThreePillars. */
export function PillarsIllustration({ className = "" }: { className?: string }) {
  return (
    <IllustrationWrap className={className} ariaLabel="Three pillars">
      {/* Architrave / framework header */}
      <motion.line x1="14" y1="22" x2="86" y2="22" variants={drawIcon} custom={0} />
      <motion.line x1="14" y1="27" x2="86" y2="27" variants={drawIcon} custom={0} />
      {/* Three pillars */}
      <motion.line x1="22" y1="30" x2="22" y2="74" variants={drawIcon} custom={1} />
      <motion.line x1="26" y1="30" x2="26" y2="74" variants={drawIcon} custom={1} />
      <motion.line x1="48" y1="30" x2="48" y2="74" variants={drawIcon} custom={2} />
      <motion.line x1="52" y1="30" x2="52" y2="74" variants={drawIcon} custom={2} />
      <motion.line x1="74" y1="30" x2="74" y2="74" variants={drawIcon} custom={3} />
      <motion.line x1="78" y1="30" x2="78" y2="74" variants={drawIcon} custom={3} />
      {/* Base */}
      <motion.line x1="10" y1="77" x2="90" y2="77" variants={drawIcon} custom={4} />
      <motion.line x1="10" y1="82" x2="90" y2="82" variants={drawIcon} custom={4} />
    </IllustrationWrap>
  );
}

/** Open book — for BookSection (optional, only if image is removed). */
export function BookIllustration({ className = "" }: { className?: string }) {
  return (
    <IllustrationWrap className={className} ariaLabel="The book">
      {/* Spine + pages */}
      <motion.path
        d="M 50 25 C 38 22 22 22 14 26 L 14 76 C 22 72 38 72 50 75"
        variants={drawIcon}
        custom={0}
      />
      <motion.path
        d="M 50 25 C 62 22 78 22 86 26 L 86 76 C 78 72 62 72 50 75"
        variants={drawIcon}
        custom={0}
      />
      {/* Centre fold */}
      <motion.line x1="50" y1="25" x2="50" y2="75" variants={drawIcon} custom={1} />
      {/* Page lines — left */}
      <motion.line x1="22" y1="38" x2="42" y2="35" variants={drawIcon} custom={2} />
      <motion.line x1="22" y1="46" x2="42" y2="43" variants={drawIcon} custom={2} />
      <motion.line x1="22" y1="54" x2="42" y2="51" variants={drawIcon} custom={2} />
      {/* Page lines — right */}
      <motion.line x1="58" y1="35" x2="78" y2="38" variants={drawIcon} custom={3} />
      <motion.line x1="58" y1="43" x2="78" y2="46" variants={drawIcon} custom={3} />
      <motion.line x1="58" y1="51" x2="78" y2="54" variants={drawIcon} custom={3} />
    </IllustrationWrap>
  );
}

/** Audience target / qualifying lens — for WhoThisIsFor. */
export function AudienceIllustration({
  className = "",
}: {
  className?: string;
}) {
  return (
    <IllustrationWrap className={className} ariaLabel="Audience">
      {/* Concentric rings */}
      <motion.circle cx="50" cy="50" r="34" variants={drawIcon} custom={0} />
      <motion.circle cx="50" cy="50" r="22" variants={drawIcon} custom={1} />
      <motion.circle cx="50" cy="50" r="10" variants={drawIcon} custom={2} />
      <motion.circle
        cx="50"
        cy="50"
        r="3"
        fill="currentColor"
        stroke="none"
        variants={popIn}
        custom={0}
      />
    </IllustrationWrap>
  );
}

/** Stack of course cards — for the courses section. */
export function CoursesIllustration({
  className = "",
}: {
  className?: string;
}) {
  return (
    <IllustrationWrap className={className} ariaLabel="Courses">
      <motion.rect
        x="14"
        y="18"
        width="32"
        height="22"
        rx="2"
        variants={drawIcon}
        custom={0}
      />
      <motion.rect
        x="54"
        y="18"
        width="32"
        height="22"
        rx="2"
        variants={drawIcon}
        custom={1}
      />
      <motion.rect
        x="14"
        y="44"
        width="32"
        height="22"
        rx="2"
        variants={drawIcon}
        custom={2}
      />
      <motion.rect
        x="54"
        y="44"
        width="32"
        height="22"
        rx="2"
        variants={drawIcon}
        custom={3}
      />
      <motion.rect
        x="14"
        y="70"
        width="32"
        height="22"
        rx="2"
        variants={drawIcon}
        custom={4}
      />
      <motion.rect
        x="54"
        y="70"
        width="32"
        height="22"
        rx="2"
        variants={drawIcon}
        custom={5}
      />
    </IllustrationWrap>
  );
}

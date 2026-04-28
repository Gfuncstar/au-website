/**
 * CourseIllustration — line-drawn animated illustrations for each course
 * tile in the homepage CourseListCompact.
 *
 * Same visual vocabulary as SectionIllustration.tsx:
 *   - 100x100 viewBox SVG
 *   - 1.5px pink stroke (var(--color-au-pink))
 *   - Framer Motion pathLength draw-on, staggered
 *   - Viewport-triggered (each row animates as the user scrolls into it)
 *
 * Variants are course-specific — each tells a tiny visual story tied to
 * the course's subject matter:
 *   - free-3-day-startup     → ascending growth steps (5K mini)
 *   - free-2-day-rag         → traffic-light pair (RAG mini)
 *   - acne-decoded           → magnifying glass over skin texture
 *   - rosacea-beyond-redness → skin-barrier cross-section
 *   - rag-pathway            → full traffic-light with arrow path
 *   - 5k-formula             → growth chart with target marker
 */

"use client";

import { motion, type Variants } from "framer-motion";

const drawIcon: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: 1.0,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        delay: 0.15 + i * 0.08,
      },
      opacity: { duration: 0.3, delay: 0.15 + i * 0.08 },
    },
  }),
};

const popIn: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: 0.5 + i * 0.1,
      ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
    },
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
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={ariaLabel}
      className={`shrink-0 ${className}`}
      style={{ color: "var(--color-au-pink)" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      {children}
    </motion.svg>
  );
}

/* ============================================================
   1) The 5K+ Formula™ Mini  →  ascending steps
   ============================================================ */
export function FiveKMiniIllustration({ className = "" }: { className?: string }) {
  return (
    <IllustrationWrap className={className} ariaLabel="The 5K+ Formula Mini">
      {/* Three ascending step bars */}
      <motion.rect x="14" y="62" width="20" height="24" variants={drawIcon} custom={0} />
      <motion.rect x="40" y="46" width="20" height="40" variants={drawIcon} custom={1} />
      <motion.rect x="66" y="28" width="20" height="58" variants={drawIcon} custom={2} />
      {/* Trend arrow rising over the bars */}
      <motion.path
        d="M 18 56 L 44 40 L 70 24 L 86 14"
        variants={drawIcon}
        custom={3}
      />
      {/* Arrowhead */}
      <motion.path
        d="M 80 14 L 86 14 L 86 20"
        variants={drawIcon}
        custom={4}
      />
      {/* Target dot at peak */}
      <motion.circle
        cx="86"
        cy="14"
        r="2.5"
        fill="currentColor"
        stroke="none"
        variants={popIn}
        custom={3}
      />
    </IllustrationWrap>
  );
}

/* ============================================================
   2) From Regulation to Reputation™ Mini  →  traffic-light pair
   ============================================================ */
export function RagMiniIllustration({ className = "" }: { className?: string }) {
  return (
    <IllustrationWrap className={className} ariaLabel="RAG Mini">
      {/* Traffic light housing — rounded pill */}
      <motion.rect
        x="36"
        y="14"
        width="28"
        height="72"
        rx="6"
        variants={drawIcon}
        custom={0}
      />
      {/* Three light rings */}
      <motion.circle cx="50" cy="30" r="8" variants={drawIcon} custom={1} />
      <motion.circle cx="50" cy="50" r="8" variants={drawIcon} custom={2} />
      <motion.circle cx="50" cy="70" r="8" variants={drawIcon} custom={3} />
      {/* Filled green light at the bottom (RAG mini = the "go" first taste) */}
      <motion.circle
        cx="50"
        cy="70"
        r="5"
        fill="currentColor"
        stroke="none"
        variants={popIn}
        custom={2}
      />
    </IllustrationWrap>
  );
}

/* ============================================================
   3) Acne Decoded  →  magnifying glass over skin texture
   ============================================================ */
export function AcneIllustration({ className = "" }: { className?: string }) {
  return (
    <IllustrationWrap className={className} ariaLabel="Acne Decoded">
      {/* Skin texture grid — small dots laid out behind the glass */}
      <motion.circle cx="22" cy="68" r="1.5" fill="currentColor" stroke="none" variants={popIn} custom={0} />
      <motion.circle cx="32" cy="74" r="1.5" fill="currentColor" stroke="none" variants={popIn} custom={0} />
      <motion.circle cx="22" cy="80" r="1.5" fill="currentColor" stroke="none" variants={popIn} custom={1} />
      <motion.circle cx="14" cy="74" r="1.5" fill="currentColor" stroke="none" variants={popIn} custom={1} />
      <motion.circle cx="42" cy="80" r="1.5" fill="currentColor" stroke="none" variants={popIn} custom={2} />
      <motion.circle cx="48" cy="68" r="1.5" fill="currentColor" stroke="none" variants={popIn} custom={2} />
      {/* Larger lesion dots — what we're decoding */}
      <motion.circle cx="28" cy="60" r="3" variants={drawIcon} custom={1} />
      <motion.circle cx="42" cy="56" r="2.5" variants={drawIcon} custom={2} />
      {/* Magnifying glass — circle */}
      <motion.circle cx="58" cy="38" r="22" variants={drawIcon} custom={0} />
      {/* Magnifying glass — handle */}
      <motion.line x1="74" y1="54" x2="88" y2="68" variants={drawIcon} custom={3} />
      {/* Inner highlight inside the glass */}
      <motion.path
        d="M 46 30 A 12 12 0 0 1 56 22"
        variants={drawIcon}
        custom={4}
      />
    </IllustrationWrap>
  );
}

/* ============================================================
   4) Rosacea Beyond Redness  →  skin-barrier cross-section
   ============================================================ */
export function RosaceaIllustration({ className = "" }: { className?: string }) {
  return (
    <IllustrationWrap className={className} ariaLabel="Rosacea Beyond Redness">
      {/* Top epidermis — wavy surface */}
      <motion.path
        d="M 12 22 Q 24 18 36 22 T 60 22 T 88 22"
        variants={drawIcon}
        custom={0}
      />
      {/* Stratum corneum line */}
      <motion.path
        d="M 12 32 Q 24 30 36 32 T 60 32 T 88 32"
        variants={drawIcon}
        custom={1}
      />
      {/* Mid dermis */}
      <motion.line x1="12" y1="48" x2="88" y2="48" variants={drawIcon} custom={2} />
      {/* Deep dermis */}
      <motion.line x1="12" y1="66" x2="88" y2="66" variants={drawIcon} custom={3} />
      {/* Vascular layer at the base */}
      <motion.path
        d="M 12 82 Q 26 78 38 82 Q 50 86 62 82 Q 74 78 88 82"
        variants={drawIcon}
        custom={4}
      />
      {/* Tiny vessel dots in the vascular layer (the "redness" source) */}
      <motion.circle cx="26" cy="80" r="1.5" fill="currentColor" stroke="none" variants={popIn} custom={4} />
      <motion.circle cx="50" cy="84" r="1.5" fill="currentColor" stroke="none" variants={popIn} custom={5} />
      <motion.circle cx="74" cy="80" r="1.5" fill="currentColor" stroke="none" variants={popIn} custom={6} />
      {/* A single calm vertical "barrier" line marking the section reference */}
      <motion.line x1="92" y1="22" x2="92" y2="82" variants={drawIcon} custom={5} />
    </IllustrationWrap>
  );
}

/* ============================================================
   5) RAG Pathway  →  full traffic light with directional arrow
   ============================================================ */
export function RagPathwayIllustration({
  className = "",
}: {
  className?: string;
}) {
  return (
    <IllustrationWrap className={className} ariaLabel="The RAG Pathway">
      {/* Traffic light housing */}
      <motion.rect
        x="22"
        y="14"
        width="28"
        height="72"
        rx="6"
        variants={drawIcon}
        custom={0}
      />
      {/* Three lights — outline */}
      <motion.circle cx="36" cy="30" r="7" variants={drawIcon} custom={1} />
      <motion.circle cx="36" cy="50" r="7" variants={drawIcon} custom={2} />
      <motion.circle cx="36" cy="70" r="7" variants={drawIcon} custom={3} />
      {/* All three filled — the full pathway through R, A, G */}
      <motion.circle cx="36" cy="30" r="4" fill="currentColor" stroke="none" variants={popIn} custom={0} />
      <motion.circle cx="36" cy="50" r="4" fill="currentColor" stroke="none" variants={popIn} custom={1} />
      <motion.circle cx="36" cy="70" r="4" fill="currentColor" stroke="none" variants={popIn} custom={2} />
      {/* Pathway arrow — flowing right out of the green light */}
      <motion.path
        d="M 56 70 L 78 70 L 78 30 L 92 30"
        variants={drawIcon}
        custom={4}
      />
      {/* Arrowhead at the top-right */}
      <motion.path
        d="M 86 24 L 92 30 L 86 36"
        variants={drawIcon}
        custom={5}
      />
    </IllustrationWrap>
  );
}

/* ============================================================
   6) The 5K+ Formula™  →  full growth chart with target
   ============================================================ */
export function FiveKFormulaIllustration({
  className = "",
}: {
  className?: string;
}) {
  return (
    <IllustrationWrap className={className} ariaLabel="The 5K+ Formula">
      {/* Y axis */}
      <motion.line x1="14" y1="14" x2="14" y2="86" variants={drawIcon} custom={0} />
      {/* X axis */}
      <motion.line x1="14" y1="86" x2="92" y2="86" variants={drawIcon} custom={0} />
      {/* Y-axis tick marks */}
      <motion.line x1="11" y1="30" x2="14" y2="30" variants={drawIcon} custom={1} />
      <motion.line x1="11" y1="50" x2="14" y2="50" variants={drawIcon} custom={1} />
      <motion.line x1="11" y1="70" x2="14" y2="70" variants={drawIcon} custom={1} />
      {/* Growth curve — smooth ascending S */}
      <motion.path
        d="M 18 78 C 30 76 40 70 50 56 C 60 42 70 28 88 22"
        variants={drawIcon}
        custom={2}
      />
      {/* Data points along the curve */}
      <motion.circle
        cx="30"
        cy="74"
        r="2"
        fill="currentColor"
        stroke="none"
        variants={popIn}
        custom={2}
      />
      <motion.circle
        cx="50"
        cy="56"
        r="2"
        fill="currentColor"
        stroke="none"
        variants={popIn}
        custom={3}
      />
      <motion.circle
        cx="70"
        cy="36"
        r="2"
        fill="currentColor"
        stroke="none"
        variants={popIn}
        custom={4}
      />
      {/* Target — concentric ring at the curve peak */}
      <motion.circle cx="88" cy="22" r="6" variants={drawIcon} custom={3} />
      <motion.circle
        cx="88"
        cy="22"
        r="2"
        fill="currentColor"
        stroke="none"
        variants={popIn}
        custom={5}
      />
    </IllustrationWrap>
  );
}

/* ============================================================
   Slug → component mapping
   ============================================================ */
const ILLUSTRATIONS: Record<
  string,
  ({ className }: { className?: string }) => React.JSX.Element
> = {
  "free-3-day-startup": FiveKMiniIllustration,
  "free-2-day-rag": RagMiniIllustration,
  "acne-decoded": AcneIllustration,
  "rosacea-beyond-redness": RosaceaIllustration,
  "rag-pathway": RagPathwayIllustration,
  "5k-formula": FiveKFormulaIllustration,
};

export function CourseIllustrationFor({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const Component = ILLUSTRATIONS[slug];
  if (!Component) return null;
  return <Component className={className} />;
}

/**
 * NavIcons — pink line-art glyphs that sit to the left of each burger
 * menu section header. Same visual language as CourseMarks / DashboardPreview
 * icons: stroke-only, currentColor-driven, ~24px box.
 *
 * Each icon is a Framer Motion svg that animates its stroke draw-in
 * when the burger drawer opens — `open` prop drives initial/animate
 * states, so collapsing and re-opening replays the reveal. Hover
 * applies a subtle scale via Tailwind's group-hover so the icon
 * responds to the whole row, not just the SVG.
 */

"use client";

import { motion, type Variants } from "framer-motion";

// Cubic-bezier easing tuple. Cast to a fixed-length tuple so framer-motion's
// `Easing` type accepts it (a plain `number[]` widens to the wrong shape).
const easeOut = [0.22, 1, 0.36, 1] as [number, number, number, number];

const drawTransition = {
  pathLength: { duration: 0.6, ease: easeOut },
  opacity: { duration: 0.2 },
};

const drawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: drawTransition },
};

const popVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.35, ease: easeOut, delay: 0.25 },
  },
};

type IconProps = {
  /** True when the burger drawer is open — drives the draw-in cascade. */
  open: boolean;
  className?: string;
};

const baseSvgClass =
  "shrink-0 w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:scale-110";

const baseSvgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  style: { color: "var(--color-au-pink)" },
};

function SvgWrap({
  open,
  className,
  children,
}: {
  open: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.svg
      {...baseSvgProps}
      className={`${baseSvgClass} ${className ?? ""}`}
      initial="hidden"
      animate={open ? "visible" : "hidden"}
      aria-hidden="true"
    >
      {children}
    </motion.svg>
  );
}

/** Courses — stack of cards / library tile. */
export function CoursesIcon({ open, className }: IconProps) {
  return (
    <SvgWrap open={open} className={className}>
      <motion.rect x="3" y="4" width="8" height="16" rx="0.5" variants={drawVariants} />
      <motion.rect x="13" y="4" width="8" height="16" rx="0.5" variants={drawVariants} />
      <motion.line x1="6" y1="9" x2="8" y2="9" variants={drawVariants} />
      <motion.line x1="6" y1="13" x2="8" y2="13" variants={drawVariants} />
      <motion.line x1="16" y1="9" x2="18" y2="9" variants={drawVariants} />
      <motion.line x1="16" y1="13" x2="18" y2="13" variants={drawVariants} />
    </SvgWrap>
  );
}

/** Members' area — dashboard frame with one active tile. */
export function MembersAreaIcon({ open, className }: IconProps) {
  return (
    <SvgWrap open={open} className={className}>
      <motion.rect x="3" y="4" width="18" height="16" rx="0.5" variants={drawVariants} />
      <motion.line x1="3" y1="9" x2="21" y2="9" variants={drawVariants} />
      <motion.rect
        x="6"
        y="12"
        width="5"
        height="5"
        fill="currentColor"
        stroke="currentColor"
        variants={popVariants}
      />
      <motion.rect x="13" y="12" width="5" height="5" variants={drawVariants} />
    </SvgWrap>
  );
}

/** Bernadette — person silhouette. */
export function PersonIcon({ open, className }: IconProps) {
  return (
    <SvgWrap open={open} className={className}>
      <motion.circle cx="12" cy="8" r="4" variants={drawVariants} />
      <motion.path
        d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"
        variants={drawVariants}
      />
    </SvgWrap>
  );
}

/** Standards & regulation — shield with check. */
export function ShieldIcon({ open, className }: IconProps) {
  return (
    <SvgWrap open={open} className={className}>
      <motion.path
        d="M12 3 L4 6 V12 C4 16 7 19 12 21 C17 19 20 16 20 12 V6 Z"
        variants={drawVariants}
      />
      <motion.polyline points="9 12 11 14 15 10" variants={drawVariants} />
    </SvgWrap>
  );
}

/** Insights & answers — speech bubble with question/spark mark. */
export function InsightsIcon({ open, className }: IconProps) {
  return (
    <SvgWrap open={open} className={className}>
      <motion.path
        d="M3 5 H21 V16 H13 L8 20 V16 H3 Z"
        variants={drawVariants}
      />
      <motion.line x1="8" y1="10" x2="16" y2="10" variants={drawVariants} />
      <motion.line x1="8" y1="13" x2="13" y2="13" variants={drawVariants} />
    </SvgWrap>
  );
}

/** Testimonials — quote mark inside a circle. */
export function QuoteIcon({ open, className }: IconProps) {
  return (
    <SvgWrap open={open} className={className}>
      <motion.circle cx="12" cy="12" r="9" variants={drawVariants} />
      <motion.path
        d="M9 9 V12 C9 13.5 8 14.5 7 15"
        variants={drawVariants}
      />
      <motion.path
        d="M15 9 V12 C15 13.5 14 14.5 13 15"
        variants={drawVariants}
      />
    </SvgWrap>
  );
}

/** Connect — envelope. */
export function MailIcon({ open, className }: IconProps) {
  return (
    <SvgWrap open={open} className={className}>
      <motion.rect x="3" y="5" width="18" height="14" rx="0.5" variants={drawVariants} />
      <motion.polyline points="3 7 12 13 21 7" variants={drawVariants} />
    </SvgWrap>
  );
}

/* ============================================================
   COURSE-LEVEL ICONS — small (20px) animated marks shown next
   to each individual course in the burger's Courses accordion.
   Each one mirrors the same line-art metaphor used on the
   /courses index hero and the marketing CourseCards.
   ============================================================ */

const courseSvgClass =
  "shrink-0 w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110";

function CourseSvgWrap({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
      className={courseSvgClass}
      style={{ color: "var(--color-au-pink)" }}
      initial="hidden"
      animate={open ? "visible" : "hidden"}
      aria-hidden="true"
    >
      {children}
    </motion.svg>
  );
}

/** 5K+ Formula / Mini — narrowing in on a niche (concentric squares). */
function NicheCourseIcon({ open }: { open: boolean }) {
  return (
    <CourseSvgWrap open={open}>
      <motion.rect x="3" y="3" width="18" height="18" variants={drawVariants} />
      <motion.rect x="7" y="7" width="10" height="10" variants={drawVariants} />
      <motion.rect
        x="10.5"
        y="10.5"
        width="3"
        height="3"
        fill="currentColor"
        stroke="none"
        variants={popVariants}
      />
    </CourseSvgWrap>
  );
}

/** RAG / Regulation — three stacked dots (traffic light). */
function TrafficLightCourseIcon({ open }: { open: boolean }) {
  return (
    <CourseSvgWrap open={open}>
      <motion.rect x="8" y="2" width="8" height="20" rx="0.5" variants={drawVariants} />
      <motion.circle
        cx="12"
        cy="6.5"
        r="1.4"
        fill="currentColor"
        stroke="none"
        variants={popVariants}
      />
      <motion.circle cx="12" cy="12" r="1.4" variants={drawVariants} />
      <motion.circle cx="12" cy="17.5" r="1.4" variants={drawVariants} />
    </CourseSvgWrap>
  );
}

/** Acne / Skin Specialist — cellular hex (clinical). */
function HexCourseIcon({ open }: { open: boolean }) {
  return (
    <CourseSvgWrap open={open}>
      <motion.polygon
        points="12,2 21,7 21,17 12,22 3,17 3,7"
        variants={drawVariants}
      />
      <motion.circle
        cx="12"
        cy="12"
        r="2"
        fill="currentColor"
        stroke="none"
        variants={popVariants}
      />
    </CourseSvgWrap>
  );
}

/** Rosacea — concentric arcs (skin barrier waves). */
function BarrierCourseIcon({ open }: { open: boolean }) {
  return (
    <CourseSvgWrap open={open}>
      <motion.path
        d="M3 10 Q7 6 12 10 T21 10"
        strokeLinecap="round"
        variants={drawVariants}
      />
      <motion.path
        d="M3 14 Q7 10 12 14 T21 14"
        strokeLinecap="round"
        variants={drawVariants}
      />
      <motion.path
        d="M3 18 Q7 14 12 18 T21 18"
        strokeLinecap="round"
        variants={drawVariants}
      />
    </CourseSvgWrap>
  );
}

/** 5K+ Formula (paid) — ascending bars (compounding profit). */
function ProfitBarsCourseIcon({ open }: { open: boolean }) {
  return (
    <CourseSvgWrap open={open}>
      <motion.line x1="3" y1="20" x2="21" y2="20" variants={drawVariants} />
      <motion.rect
        x="4"
        y="14"
        width="3"
        height="6"
        fill="currentColor"
        stroke="none"
        variants={popVariants}
      />
      <motion.rect
        x="9"
        y="10"
        width="3"
        height="10"
        fill="currentColor"
        stroke="none"
        variants={popVariants}
      />
      <motion.rect
        x="14"
        y="6"
        width="3"
        height="14"
        fill="currentColor"
        stroke="none"
        variants={popVariants}
      />
    </CourseSvgWrap>
  );
}

/**
 * Slug → small course icon for the burger menu. Mirrors the marks
 * used on the /courses index. Defaults to HexCourseIcon for any slug
 * not explicitly mapped (most clinical content takes the hex).
 */
const COURSE_ICON_BY_SLUG: Record<
  string,
  React.ComponentType<{ open: boolean }>
> = {
  "free-3-day-startup": NicheCourseIcon,
  "5k-formula": ProfitBarsCourseIcon,
  "free-2-day-rag": TrafficLightCourseIcon,
  "free-clinical-audit": TrafficLightCourseIcon,
  "rag-pathway": TrafficLightCourseIcon,
  "free-acne-decoded": HexCourseIcon,
  "acne-decoded": HexCourseIcon,
  "free-rosacea-beyond-redness": BarrierCourseIcon,
  "rosacea-beyond-redness": BarrierCourseIcon,
  "free-skin-specialist-mini": HexCourseIcon,
  "skin-specialist-programme": HexCourseIcon,
};

/** Public component: looks up the right icon for a course slug. */
export function CourseRowIcon({
  slug,
  open,
}: {
  slug: string;
  open: boolean;
}) {
  const Icon = COURSE_ICON_BY_SLUG[slug] ?? HexCourseIcon;
  return <Icon open={open} />;
}

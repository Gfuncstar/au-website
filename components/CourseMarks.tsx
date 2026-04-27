/**
 * CourseMarks — line-based SVG marks used in the top-right corner of each
 * CourseCard on the homepage course grid.
 *
 * Built per Giles' "needs a graphical element here" call. Same visual
 * language as the ThreePillars marks: geometric, gig-poster, line-only
 * (stroke not fill), 48px box, takes its colour from `currentColor` so
 * the parent CourseCard can flip between AU pink (on dark cards) and AU
 * black (on pink cards).
 *
 * One mark per course — each one a simple visual metaphor for the course
 * promise:
 *   - 5K Mini      → concentric square (narrowing in on a niche)
 *   - RAG Mini     → three stacked dots (red/amber/green traffic light)
 *   - Acne Decoded → cellular hex (clinical / cell biology)
 *   - Rosacea      → concentric arcs (skin barrier waves)
 *   - 5K Formula   → ascending bars (compounding profit)
 *
 * Static (no per-mark scroll-in) — the parent ScrollReveal wrap handles
 * the entry animation for each card as a whole.
 */

const SIZE_CLASS = "w-12 h-12 sm:w-14 sm:h-14";

/** 5K+ Formula Mini — narrowing in on a niche. */
export const NicheMark = (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
    aria-hidden="true"
    className={SIZE_CLASS}
  >
    <rect x="4" y="4" width="56" height="56" />
    <rect x="16" y="16" width="32" height="32" />
    <rect x="28" y="28" width="8" height="8" fill="currentColor" stroke="none" />
  </svg>
);

/** RAG Mini — Traffic Light System. */
export const TrafficLightMark = (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
    aria-hidden="true"
    className={SIZE_CLASS}
  >
    <rect x="20" y="4" width="24" height="56" rx="2" />
    <circle cx="32" cy="16" r="4" fill="currentColor" stroke="none" />
    <circle cx="32" cy="32" r="4" />
    <circle cx="32" cy="48" r="4" />
  </svg>
);

/** Acne Decoded — cellular / hex biology. */
export const HexMark = (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
    className={SIZE_CLASS}
  >
    <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" />
    <polygon points="32,18 44,25 44,39 32,46 20,39 20,25" />
    <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
  </svg>
);

/** Rosacea — concentric barrier waves. */
export const BarrierMark = (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    aria-hidden="true"
    className={SIZE_CLASS}
  >
    <path d="M4 22 Q16 14 28 22 T52 22 T76 22" />
    <path d="M4 32 Q16 24 28 32 T52 32 T76 32" />
    <path d="M4 42 Q16 34 28 42 T52 42 T76 42" />
    <path d="M4 52 Q16 44 28 52 T52 52 T76 52" />
  </svg>
);

/** 5K Formula full — ascending bars. */
export const ProfitBarsMark = (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
    aria-hidden="true"
    className={SIZE_CLASS}
  >
    <line x1="6" y1="58" x2="58" y2="58" />
    <rect x="12" y="42" width="8" height="16" fill="currentColor" stroke="none" />
    <rect x="28" y="30" width="8" height="28" fill="currentColor" stroke="none" />
    <rect x="44" y="16" width="8" height="42" fill="currentColor" stroke="none" />
  </svg>
);

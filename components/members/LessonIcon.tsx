/**
 * LessonIcon — pink-stroke line-drawn glyph picked by name from a fixed
 * generic library. Each lesson opts in via its frontmatter:
 *
 *   ---
 *   icon: lens
 *   ---
 *
 * The library is intentionally generic so it works across any course
 * type (clinical, business, regulatory). When `name` is missing or
 * unrecognised, falls back to a numbered circle.
 *
 * Available names — see content/courses/README.md for the full visual
 * catalog Bernadette can pick from:
 *   doorway · lens · cross-section · branching · warning · clipboard ·
 *   signpost · people · shield · document-stack · medal · target ·
 *   lightbulb · scales · chart · circle
 *
 * Every glyph uses the same draw-on animation and shares stroke
 * width / colour, so the system stays visually coherent regardless
 * of which icons a course picks.
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
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        delay: 0.1 + i * 0.07,
      },
      opacity: { duration: 0.25, delay: 0.1 + i * 0.07 },
    },
  }),
};

const popIn: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.35,
      delay: 0.45 + i * 0.08,
      ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
    },
  }),
};

interface IconShellProps {
  children: React.ReactNode;
  className?: string;
  ariaLabel: string;
  strokeWidth?: number;
  replay?: boolean;
}

function IconShell({
  children,
  className = "",
  ariaLabel,
  strokeWidth = 3,
  replay = false,
}: IconShellProps) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={ariaLabel}
      className={`shrink-0 ${className}`}
      style={{ color: "var(--color-au-pink)" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !replay, margin: "-30px" }}
    >
      {children}
    </motion.svg>
  );
}

/* ============================================================
   The icon library. Each glyph: 100x100 viewBox, pink stroke.
   Add new glyphs here and document them in content/courses/README.md.
   ============================================================ */

function DoorwayIcon(p: IconBaseProps) {
  return (
    <IconShell {...p} ariaLabel="Open">
      <motion.rect x="14" y="18" width="48" height="64" rx="3" variants={drawIcon} custom={0} />
      <motion.path d="M 38 18 L 38 82" variants={drawIcon} custom={1} />
      <motion.circle cx="44" cy="50" r="2" fill="currentColor" stroke="none" variants={popIn} custom={1} />
      <motion.path d="M 70 50 L 90 50" variants={drawIcon} custom={2} />
      <motion.path d="M 84 44 L 90 50 L 84 56" variants={drawIcon} custom={3} />
    </IconShell>
  );
}

function LensIcon(p: IconBaseProps) {
  return (
    <IconShell {...p} ariaLabel="Examine">
      <motion.circle cx="44" cy="44" r="24" variants={drawIcon} custom={0} />
      <motion.line x1="62" y1="62" x2="84" y2="84" variants={drawIcon} custom={1} />
      <motion.circle cx="40" cy="42" r="4" variants={drawIcon} custom={2} />
      <motion.circle cx="52" cy="48" r="2.5" fill="currentColor" stroke="none" variants={popIn} custom={1} />
      <motion.circle cx="34" cy="52" r="1.5" fill="currentColor" stroke="none" variants={popIn} custom={2} />
    </IconShell>
  );
}

function CrossSectionIcon(p: IconBaseProps) {
  return (
    <IconShell {...p} ariaLabel="Structure">
      <motion.path d="M 14 22 Q 30 18 50 22 T 86 22" variants={drawIcon} custom={0} />
      <motion.path d="M 14 34 Q 30 30 50 34 T 86 34" variants={drawIcon} custom={1} />
      <motion.path d="M 50 34 L 50 78" variants={drawIcon} custom={2} />
      <motion.circle cx="50" cy="64" r="10" variants={drawIcon} custom={3} />
      <motion.path d="M 44 56 Q 50 50 56 56" variants={drawIcon} custom={4} />
    </IconShell>
  );
}

function BranchingIcon(p: IconBaseProps) {
  return (
    <IconShell {...p} ariaLabel="Drivers">
      <motion.circle cx="50" cy="20" r="6" variants={drawIcon} custom={0} />
      <motion.path d="M 50 26 L 50 44" variants={drawIcon} custom={1} />
      <motion.path d="M 50 44 L 22 70" variants={drawIcon} custom={2} />
      <motion.path d="M 50 44 L 50 70" variants={drawIcon} custom={2} />
      <motion.path d="M 50 44 L 78 70" variants={drawIcon} custom={2} />
      <motion.circle cx="22" cy="78" r="6" variants={drawIcon} custom={3} />
      <motion.circle cx="50" cy="78" r="6" variants={drawIcon} custom={3} />
      <motion.circle cx="78" cy="78" r="6" variants={drawIcon} custom={3} />
    </IconShell>
  );
}

function WarningIcon(p: IconBaseProps) {
  return (
    <IconShell {...p} ariaLabel="Risk">
      <motion.path d="M 50 14 L 88 80 L 12 80 Z" variants={drawIcon} custom={0} />
      <motion.line x1="50" y1="38" x2="50" y2="60" variants={drawIcon} custom={1} />
      <motion.circle cx="50" cy="70" r="2.5" fill="currentColor" stroke="none" variants={popIn} custom={1} />
    </IconShell>
  );
}

function ClipboardIcon(p: IconBaseProps) {
  return (
    <IconShell {...p} ariaLabel="Assess">
      <motion.rect x="22" y="16" width="56" height="72" rx="3" variants={drawIcon} custom={0} />
      <motion.rect x="38" y="10" width="24" height="12" rx="2" variants={drawIcon} custom={1} />
      <motion.line x1="34" y1="36" x2="68" y2="36" variants={drawIcon} custom={2} />
      <motion.line x1="34" y1="50" x2="68" y2="50" variants={drawIcon} custom={3} />
      <motion.line x1="34" y1="64" x2="68" y2="64" variants={drawIcon} custom={4} />
      <motion.path d="M 34 36 L 30 32" variants={drawIcon} custom={5} />
      <motion.path d="M 34 50 L 30 46" variants={drawIcon} custom={5} />
    </IconShell>
  );
}

function SignpostIcon(p: IconBaseProps) {
  return (
    <IconShell {...p} ariaLabel="Pathway">
      <motion.path d="M 14 50 L 38 50" variants={drawIcon} custom={0} />
      <motion.circle cx="44" cy="50" r="6" variants={drawIcon} custom={1} />
      <motion.path d="M 50 50 L 64 28" variants={drawIcon} custom={2} />
      <motion.path d="M 50 50 L 64 72" variants={drawIcon} custom={2} />
      <motion.circle cx="68" cy="24" r="6" variants={drawIcon} custom={3} />
      <motion.circle cx="68" cy="76" r="6" variants={drawIcon} custom={3} />
      <motion.circle cx="68" cy="24" r="2" fill="currentColor" stroke="none" variants={popIn} custom={2} />
      <motion.circle cx="68" cy="76" r="2" fill="currentColor" stroke="none" variants={popIn} custom={3} />
    </IconShell>
  );
}

function PeopleIcon(p: IconBaseProps) {
  return (
    <IconShell {...p} ariaLabel="Case studies">
      <motion.circle cx="32" cy="34" r="8" variants={drawIcon} custom={0} />
      <motion.path d="M 18 78 Q 18 56 32 56 Q 46 56 46 78" variants={drawIcon} custom={1} />
      <motion.circle cx="68" cy="34" r="8" variants={drawIcon} custom={2} />
      <motion.path d="M 54 78 Q 54 56 68 56 Q 82 56 82 78" variants={drawIcon} custom={3} />
    </IconShell>
  );
}

function ShieldIcon(p: IconBaseProps) {
  return (
    <IconShell {...p} ariaLabel="Standards">
      <motion.path
        d="M 50 12 L 84 22 L 84 50 Q 84 76 50 88 Q 16 76 16 50 L 16 22 Z"
        variants={drawIcon}
        custom={0}
      />
      <motion.line x1="50" y1="34" x2="50" y2="62" variants={drawIcon} custom={1} />
      <motion.line x1="36" y1="48" x2="64" y2="48" variants={drawIcon} custom={2} />
    </IconShell>
  );
}

function DocumentStackIcon(p: IconBaseProps) {
  return (
    <IconShell {...p} ariaLabel="Summary">
      <motion.rect x="20" y="20" width="48" height="60" rx="3" variants={drawIcon} custom={0} />
      <motion.path d="M 30 18 L 78 18" variants={drawIcon} custom={1} />
      <motion.path d="M 32 12 L 84 12" variants={drawIcon} custom={2} />
      <motion.path d="M 34 38 L 42 46 L 60 28" variants={drawIcon} custom={3} />
      <motion.line x1="30" y1="58" x2="58" y2="58" variants={drawIcon} custom={4} />
      <motion.line x1="30" y1="68" x2="50" y2="68" variants={drawIcon} custom={5} />
    </IconShell>
  );
}

function MedalIcon(p: IconBaseProps) {
  return (
    <IconShell {...p} ariaLabel="Certificate">
      <motion.circle cx="50" cy="40" r="22" variants={drawIcon} custom={0} />
      <motion.circle cx="50" cy="40" r="14" variants={drawIcon} custom={1} />
      <motion.path d="M 38 56 L 30 86 L 42 78" variants={drawIcon} custom={2} />
      <motion.path d="M 62 56 L 70 86 L 58 78" variants={drawIcon} custom={3} />
      <motion.path d="M 44 36 L 48 42 L 56 32" variants={drawIcon} custom={4} />
    </IconShell>
  );
}

function TargetIcon(p: IconBaseProps) {
  return (
    <IconShell {...p} ariaLabel="Target">
      <motion.circle cx="50" cy="50" r="34" variants={drawIcon} custom={0} />
      <motion.circle cx="50" cy="50" r="22" variants={drawIcon} custom={1} />
      <motion.circle cx="50" cy="50" r="10" variants={drawIcon} custom={2} />
      <motion.circle cx="50" cy="50" r="3" fill="currentColor" stroke="none" variants={popIn} custom={1} />
    </IconShell>
  );
}

function LightbulbIcon(p: IconBaseProps) {
  return (
    <IconShell {...p} ariaLabel="Insight">
      <motion.path
        d="M 30 46 A 20 20 0 1 1 70 46 Q 70 60 60 64 L 60 72 L 40 72 L 40 64 Q 30 60 30 46 Z"
        variants={drawIcon}
        custom={0}
      />
      <motion.line x1="42" y1="80" x2="58" y2="80" variants={drawIcon} custom={1} />
      <motion.line x1="44" y1="86" x2="56" y2="86" variants={drawIcon} custom={2} />
      <motion.path d="M 44 56 L 50 50 L 56 56" variants={drawIcon} custom={3} />
    </IconShell>
  );
}

function ScalesIcon(p: IconBaseProps) {
  return (
    <IconShell {...p} ariaLabel="Balance">
      <motion.line x1="50" y1="14" x2="50" y2="78" variants={drawIcon} custom={0} />
      <motion.line x1="22" y1="32" x2="78" y2="32" variants={drawIcon} custom={1} />
      <motion.path d="M 22 32 L 14 56 Q 22 64 30 56 Z" variants={drawIcon} custom={2} />
      <motion.path d="M 78 32 L 70 56 Q 78 64 86 56 Z" variants={drawIcon} custom={3} />
      <motion.line x1="38" y1="84" x2="62" y2="84" variants={drawIcon} custom={4} />
    </IconShell>
  );
}

function ChartIcon(p: IconBaseProps) {
  return (
    <IconShell {...p} ariaLabel="Growth">
      <motion.line x1="14" y1="86" x2="86" y2="86" variants={drawIcon} custom={0} />
      <motion.line x1="14" y1="86" x2="14" y2="14" variants={drawIcon} custom={0} />
      <motion.rect x="22" y="58" width="14" height="28" variants={drawIcon} custom={1} />
      <motion.rect x="44" y="42" width="14" height="44" variants={drawIcon} custom={2} />
      <motion.rect x="66" y="26" width="14" height="60" variants={drawIcon} custom={3} />
      <motion.path d="M 22 56 L 44 40 L 66 24 L 84 14" variants={drawIcon} custom={4} />
      <motion.path d="M 78 14 L 84 14 L 84 20" variants={drawIcon} custom={5} />
    </IconShell>
  );
}

function CircleIcon(p: IconBaseProps) {
  return (
    <IconShell {...p} ariaLabel="Chapter">
      <motion.circle cx="50" cy="50" r="30" variants={drawIcon} custom={0} />
      <motion.circle cx="50" cy="50" r="3" fill="currentColor" stroke="none" variants={popIn} custom={1} />
    </IconShell>
  );
}

interface IconBaseProps {
  className?: string;
  replay?: boolean;
}

const ICONS = {
  doorway: DoorwayIcon,
  lens: LensIcon,
  "cross-section": CrossSectionIcon,
  branching: BranchingIcon,
  warning: WarningIcon,
  clipboard: ClipboardIcon,
  signpost: SignpostIcon,
  people: PeopleIcon,
  shield: ShieldIcon,
  "document-stack": DocumentStackIcon,
  medal: MedalIcon,
  target: TargetIcon,
  lightbulb: LightbulbIcon,
  scales: ScalesIcon,
  chart: ChartIcon,
  circle: CircleIcon,
} as const;

export type LessonIconName = keyof typeof ICONS;

interface LessonIconProps {
  /** Icon name from the library — picks the matching glyph. Falls back
   *  to a generic circle if missing or unrecognised. */
  name?: string;
  className?: string;
  /** Replay the draw-on animation when the icon's key changes (i.e.
   *  on lesson navigation) rather than only once per mount. */
  replay?: boolean;
}

export function LessonIcon({ name, className, replay }: LessonIconProps) {
  const lookup = ICONS as Record<string, React.ComponentType<IconBaseProps>>;
  const Cmp: React.ComponentType<IconBaseProps> =
    (name ? lookup[name] : undefined) ?? ICONS.circle;
  return <Cmp className={className} replay={replay} />;
}

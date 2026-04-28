/**
 * LessonScrollProgress — slim pink rule fixed to the very top of the
 * viewport that fills as the lesson scrolls. Cheap continuous cue of
 * "where am I in this chapter" — pairs with the discrete chapter
 * progress bar in CourseChapterStrip.
 *
 * Honours `prefers-reduced-motion` automatically (Framer Motion
 * respects the OS setting; we still update the value, the spring just
 * snaps instead of easing).
 */

"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function LessonScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-[3px] bg-au-pink origin-left pointer-events-none"
      style={{ scaleX }}
    />
  );
}

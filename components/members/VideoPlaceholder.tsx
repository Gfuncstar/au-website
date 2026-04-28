/**
 * VideoPlaceholder — placeholder hero for the lesson player while Mux
 * is not yet wired. Charcoal 16:9 frame with a soft pink wash, brand
 * monogram, animated play disc, and a corner chapter tag so it carries
 * editorial weight rather than reading as a flat empty rectangle.
 *
 * Pulse animation on the play ring + soft glow on hover. Pure
 * presentational — clicking does nothing for v1.
 */

"use client";

import { motion } from "framer-motion";

interface VideoPlaceholderProps {
  duration?: string;
  lessonTitle: string;
  chapterNumber: number;
}

export function VideoPlaceholder({
  duration,
  lessonTitle,
  chapterNumber,
}: VideoPlaceholderProps) {
  return (
    <motion.figure
      initial={{ opacity: 0, scale: 0.985 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full aspect-video bg-au-charcoal text-au-white overflow-hidden rounded-[5px] group"
      aria-label={`Video placeholder for ${lessonTitle}`}
    >
      {/* Soft pink radial wash to break the flat charcoal */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30 group-hover:opacity-45 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 55%, var(--color-au-pink) 0%, transparent 70%)",
        }}
      />

      {/* Diagonal pink rule — editorial flourish */}
      <div
        aria-hidden="true"
        className="absolute -left-8 top-0 w-px h-[140%] bg-au-pink/25 rotate-[18deg] origin-top-left"
      />

      {/* Top-left chapter tag */}
      <div className="absolute top-4 left-5 flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-[3px] border border-au-pink/60 text-au-pink font-section font-semibold tabular-nums text-[0.7rem] tracking-[0.04em]">
          {String(chapterNumber).padStart(2, "0")}
        </span>
        <span className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6rem] text-au-white/55">
          Chapter
        </span>
      </div>

      {/* Top-right brand mark */}
      <p className="absolute top-4 right-5 font-section font-semibold uppercase tracking-[0.2em] text-[0.6rem] text-au-white/55">
        Aesthetics Unlocked<sup className="text-[0.45em]">®</sup>
      </p>

      {/* Centered animated play disc + label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <motion.span
          aria-hidden="true"
          className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-[5px] border-2 border-au-white/70 group-hover:border-au-pink transition-colors duration-300"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Pulsing ring */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-[5px] border border-au-pink/60"
            animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
          <span className="ml-1 text-au-white text-[1.5rem] sm:text-[1.75rem] leading-none">
            ▶
          </span>
        </motion.span>
        <p className="mt-5 font-section font-semibold uppercase tracking-[0.18em] text-[0.65rem] text-au-white/65">
          Video coming soon
        </p>
        {duration && (
          <p className="mt-1 font-section font-semibold uppercase tracking-[0.1em] text-[0.65rem] text-au-white/45 tabular-nums">
            {duration}
          </p>
        )}
      </div>

      {/* Bottom-right lesson title — small, editorial */}
      <p className="absolute bottom-4 right-5 max-w-[60%] text-right font-display font-bold text-[0.7rem] sm:text-[0.8rem] text-au-white/40 leading-tight">
        {lessonTitle}
      </p>
    </motion.figure>
  );
}

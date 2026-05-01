/**
 * VideoPlaceholder — lesson video frame.
 *
 * When `src` is set, renders a real native HTML5 video player.
 * When `src` is unset, renders nothing so chapters without a
 * lesson video keep their layout clean.
 */

"use client";

import { motion } from "framer-motion";

interface VideoPlaceholderProps {
  /** Path to the lesson video under /public, e.g.
   *  `/video/lessons/ACNE_M07_TreatmentPathways_LESSON_acne75.mp4`.
   *  When unset, the component renders nothing. */
  src?: string;
  duration?: string;
  lessonTitle: string;
  chapterNumber: number;
}

export function VideoPlaceholder({
  src,
  lessonTitle,
}: VideoPlaceholderProps) {
  if (!src) return null;

  return (
    <motion.figure
      initial={{ opacity: 0, scale: 0.985 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full aspect-video bg-au-charcoal overflow-hidden rounded-[5px]"
      aria-label={`Lesson video, ${lessonTitle}`}
    >
      <video
        src={src}
        controls
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-contain bg-au-charcoal"
      >
        Your browser does not support the video tag.
      </video>
    </motion.figure>
  );
}

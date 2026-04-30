/**
 * ParallaxBackdrop — full-section parallax image with dark overlay.
 *
 * Built per Giles' "replace blacks with these backgrounds and look at
 * parallax" call. Sits inside a relative-positioned section (typically
 * a PosterBlock) and:
 *   1. Renders a full-bleed `<img>` background that translates Y as the
 *      section scrolls through the viewport (framer-motion useScroll +
 *      useTransform).
 *   2. Layers a configurable dark overlay over the image so headline
 *      copy on top stays readable regardless of which texture's loaded.
 *
 * The image element extends 15% above and below the section so the
 * parallax travel doesn't reveal blank gaps at either edge.
 *
 * Mobile note: parallax is kept gentle (±15%) so it never feels jittery
 * on small viewports. iOS Safari handles `transform` parallax well —
 * we don't use `background-attachment: fixed` (it's broken on iOS).
 */

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Props = {
  /** /public path to the backdrop image. */
  imageUrl: string;
  /**
   * Black overlay opacity 0–1. Default 0.65. Bump to ~0.8 if the chosen
   * image is light-toned and headline contrast suffers.
   */
  overlay?: number;
  /**
   * Optional gradient overlay instead of a flat black. Useful when you
   * want the foot of the section darker than the top.
   * Pass a CSS background-image string.
   */
  overlayGradient?: string;
  className?: string;
};

export function ParallaxBackdrop({
  imageUrl,
  overlay = 0.65,
  overlayGradient,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Image translates -8% → +8% over the whole section travel.
  // Light parallax — feels editorial, not theme-park.
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {/* Image layer, extends past section bounds so parallax doesn't
          reveal background gaps. */}
      <motion.div
        className="absolute inset-x-0 -top-[15%] -bottom-[15%] bg-cover bg-center"
        style={{
          backgroundImage: `url('${imageUrl}')`,
          y,
        }}
      />
      {/* Overlay, flat or gradient. Keeps headline copy readable. */}
      {overlayGradient ? (
        <div
          className="absolute inset-0"
          style={{ backgroundImage: overlayGradient }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0, 0, 0, ${overlay})` }}
        />
      )}
    </div>
  );
}

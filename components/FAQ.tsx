/**
 * FAQ — accessible accordion list.
 *
 * Built per Giles' "add Q and A's" call. Used on /faqs and embedded on
 * each course detail page. Renders a list of <details>/<summary> pairs
 * — native browser disclosure, full keyboard support, screen-reader
 * announces expanded state, no JS required for the actual toggle.
 *
 * The framer-motion bit is just an entry stagger on scroll-in; the
 * open/close itself is browser-native so it works even with JS disabled.
 */

"use client";

import { motion, type Variants } from "framer-motion";

export type FAQItem = {
  q: string;
  a: string;
};

type Props = {
  items: readonly FAQItem[];
  /** Optional eyebrow above the list. */
  eyebrow?: string;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function FAQ({ items }: Props) {
  return (
    <motion.ul
      className="flex flex-col"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {items.map((item, i) => (
        <motion.li
          key={i}
          variants={itemVariants}
          className="border-b border-au-charcoal/15 first:border-t"
        >
          <details className="group">
            <summary className="list-none cursor-pointer flex items-baseline justify-between gap-6 py-5 sm:py-6">
              <span
                className="font-display font-bold text-au-charcoal leading-snug"
                style={{
                  fontSize: "clamp(1rem, 2.4vw, 1.1875rem)",
                  letterSpacing: "var(--tracking-tight-display)",
                }}
              >
                {item.q}
              </span>
              <span
                aria-hidden="true"
                className="font-display font-black shrink-0 transition-transform duration-300 group-open:rotate-45 leading-none"
                style={{
                  fontSize: "1.5rem",
                  color: "var(--color-au-pink)",
                }}
              >
                +
              </span>
            </summary>
            <div className="pb-6 pr-10">
              <p
                className="text-au-charcoal/80 leading-relaxed whitespace-pre-line"
                style={{ fontSize: "clamp(0.9375rem, 2vw, 1.0625rem)" }}
              >
                {item.a}
              </p>
            </div>
          </details>
        </motion.li>
      ))}
    </motion.ul>
  );
}

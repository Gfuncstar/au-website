/**
 * BookSection — surfaces Bernadette's book "Regulation to Reputation:
 * mastering successful aesthetic practice" as a tangible authority
 * signal on the homepage.
 *
 * Built per the full-site review: the book is mentioned in passing on
 * the About page but never *shown*. For a practitioner deciding whether
 * to pay for one of Bernadette's courses, "she literally wrote the book"
 * is one of the strongest possible proof points.
 */

"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Eyebrow } from "./Eyebrow";
import { BOOK_AMAZON_URL } from "@/lib/links";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function BookSection() {
  return (
    <motion.div
      className="grid md:grid-cols-[5fr_7fr] gap-10 sm:gap-12 md:gap-16 items-center"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {/* Photo — Bernadette in scrubs holding the book in her clinic. */}
      <motion.div
        variants={itemVariants}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[5px] bg-au-charcoal"
      >
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 z-10 h-[3px] w-16"
          style={{ backgroundColor: "var(--color-au-pink)" }}
        />
        <Image
          src="/brand/bernadette-holding-book.png"
          alt="Bernadette Tobin in scrubs holding her book Regulation to Reputation in her clinic"
          fill
          className="object-cover object-[60%_center]"
          sizes="(max-width: 768px) 100vw, 40vw"
          quality={95}
        />
      </motion.div>

      {/* Right column — eyebrow + headline + body + book details. */}
      <div className="flex flex-col">
        <motion.div variants={itemVariants}>
          <Eyebrow className="mb-5">The book</Eyebrow>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="font-display font-black text-au-charcoal mb-6 sm:mb-7"
          style={{
            fontSize: "var(--text-poster)",
            lineHeight: "var(--leading-poster)",
            letterSpacing: "var(--tracking-tight-display)",
          }}
        >
          I literally{" "}
          <span style={{ color: "var(--color-au-pink)" }}>wrote the book</span>{" "}
          on it.
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] text-au-charcoal/85 leading-relaxed mb-5"
        >
          <em className="font-bold">
            Regulation to Reputation: mastering successful aesthetic practice
          </em>{" "}
          — the reference I wrote for UK aesthetic practitioners who want to
          practise safely, ethically, and defensibly. Available on Amazon UK.
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-[0.9375rem] sm:text-[1rem] text-au-charcoal/70 leading-relaxed mb-7 sm:mb-8 max-w-md"
        >
          Every framework I teach inside the courses — including the{" "}
          <span style={{ color: "var(--color-au-pink)" }}>
            Traffic Light System
          </span>{" "}
          and the{" "}
          <span style={{ color: "var(--color-au-pink)" }}>
            UNLOCK PROFIT™ Framework
          </span>{" "}
          — is anchored to the same clinical and regulatory reasoning I put on
          the record in the book. If you want the long-form, the book is the
          start. If you want me walking you through it module by module, the
          courses are the next step.
        </motion.p>

        <motion.a
          variants={itemVariants}
          href={BOOK_AMAZON_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 self-start font-section font-semibold uppercase tracking-[0.15em] text-[0.8125rem] text-au-charcoal hover:text-[var(--color-au-pink)] transition-colors"
        >
          Find the book on Amazon{" "}
          <span aria-hidden="true">↗</span>
        </motion.a>
      </div>
    </motion.div>
  );
}

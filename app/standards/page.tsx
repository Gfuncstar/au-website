/**
 * /standards — overview of every regulator and professional body AU
 * teaches against.
 *
 * Each row links through to /standards/[slug] for the deep dive (what
 * the body does, how AU teaches against it, which courses reference it).
 *
 * Built per Giles' "each one of them has its page and how aesthetics
 * unlocked works with the standards they teach against" call.
 */

import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PosterBlock } from "@/components/PosterBlock";
import { Eyebrow } from "@/components/Eyebrow";
import { CTAPoster } from "@/components/CTAPoster";
import { ScrollReveal } from "@/components/ScrollReveal";
import { RevealHeadline } from "@/components/RevealHeadline";
import { STANDARDS } from "@/lib/standards";

export const metadata: Metadata = {
  title: "Standards we teach against",
  description:
    "Every Aesthetics Unlocked course is anchored to UK regulators and professional bodies — NICE, JCCP, CPSA, MHRA, CQC, NMC, RCN, ASA. Here's who they are and how AU teaches against them.",
  alternates: { canonical: "/standards" },
  openGraph: {
    title: "Standards we teach against — Aesthetics Unlocked®",
    description:
      "Every AU course is anchored to UK regulators — NICE, JCCP, CPSA, MHRA, CQC, NMC, RCN, ASA.",
    url: "/standards",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Standards we teach against — Aesthetics Unlocked®",
    description:
      "Eight UK regulators, one defensible practice. NICE, JCCP, CPSA, MHRA, CQC, NMC, RCN, ASA.",
  },
};

export default function StandardsIndexPage() {
  return (
    <>
      <Nav forceLight />
      <main id="main" className="pt-16 sm:pt-20">
        {/* HERO */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal className="max-w-4xl">
            <Eyebrow className="mb-6">The framework I teach against</Eyebrow>
          </ScrollReveal>
          <RevealHeadline
            as="h1"
            className="font-display font-black text-au-charcoal mb-8 sm:mb-10"
            style={{
              fontSize: "var(--text-poster)",
              lineHeight: "var(--leading-poster)",
              letterSpacing: "var(--tracking-tight-display)",
            }}
            lines={[
              <Fragment key="0">Eight bodies.</Fragment>,
              <Fragment key="1">
                One{" "}
                <span style={{ color: "var(--color-au-pink)" }}>
                  defensible
                </span>{" "}
                practice.
              </Fragment>,
            ]}
          />
          <ScrollReveal delay={0.15}>
            <p className="max-w-2xl text-[1.0625rem] sm:text-[1.125rem] md:text-[1.25rem] text-au-charcoal/85 leading-relaxed">
              Every course I teach is anchored to UK regulators and
              professional bodies. Click through any standard for a full
              read-out of who they are, what they regulate, and how I
              teach against them.
            </p>
          </ScrollReveal>
        </PosterBlock>

        {/* INDEX LIST */}
        <PosterBlock tone="white" contained>
          <ul className="flex flex-col">
            {STANDARDS.map((s, i) => (
              <ScrollReveal key={s.slug} delay={i * 0.05}>
                <li className="border-b border-au-charcoal/15 first:border-t">
                  <Link
                    href={`/standards/${s.slug}`}
                    className="group block py-7 sm:py-8 grid grid-cols-[auto_1fr_auto] gap-x-5 sm:gap-x-9 items-baseline transition-colors hover:bg-au-cream"
                  >
                    <span
                      className="font-display font-black leading-none"
                      style={{
                        fontSize: "clamp(1.5rem, 3.6vw, 2.25rem)",
                        color: "var(--color-au-pink)",
                        letterSpacing: "var(--tracking-tight-display)",
                        minWidth: "4rem",
                      }}
                    >
                      {s.abbrev}
                    </span>
                    <div>
                      <p className="font-section font-semibold uppercase tracking-[0.15em] text-[0.6875rem] sm:text-[0.75rem] text-au-charcoal/55 mb-1.5">
                        {s.name}
                      </p>
                      <p className="text-au-charcoal/85 leading-relaxed text-[0.9375rem] sm:text-[1rem]">
                        {s.what}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="font-display font-black text-au-charcoal/40 group-hover:text-[var(--color-au-pink)] group-hover:translate-x-1 transition-all leading-none"
                      style={{ fontSize: "1.5rem" }}
                    >
                      →
                    </span>
                  </Link>
                </li>
              </ScrollReveal>
            ))}
          </ul>
        </PosterBlock>

        <CTAPoster
          eyebrow="Standards in practice"
          headline={
            <>
              Education that{" "}
              <span style={{ color: "var(--color-au-pink)" }}>holds up</span>.
            </>
          }
          buttonText="Browse the courses"
          buttonHref="/courses"
          tone="black"
        />
      </main>
      <Footer />
    </>
  );
}

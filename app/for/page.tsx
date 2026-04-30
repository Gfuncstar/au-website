/**
 * /for — index page for the geo landing pages.
 *
 * Lists every UK nation and city we have a tailored landing page for.
 * Reachable from the Footer; feeds the breadcrumb on /for/[slug] pages.
 */

import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PosterBlock } from "@/components/PosterBlock";
import { Eyebrow } from "@/components/Eyebrow";
import { ScrollReveal } from "@/components/ScrollReveal";
import { RevealHeadline } from "@/components/RevealHeadline";
import { LOCATIONS, getLocationsByKind } from "@/lib/locations";

export const metadata: Metadata = {
  title: "For UK practitioners, by nation and city",
  description:
    "Aesthetics education tailored to UK nation-level regulation (England, Scotland, Wales, Northern Ireland) and key practitioner-density cities (London, Manchester, Birmingham, Edinburgh).",
  alternates: { canonical: "/for" },
  openGraph: {
    title: "For UK practitioners, Aesthetics Unlocked®",
    description:
      "Tailored aesthetics education for every UK nation and major city, the regulatory map, the practitioner landscape, and the courses I'd start with.",
    url: "/for",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "For UK practitioners, by nation & city",
    description:
      "Tailored aesthetics education for England, Scotland, Wales, Northern Ireland, and London, Manchester, Birmingham, Edinburgh.",
  },
};

export default function ForIndexPage() {
  const nations = getLocationsByKind("nation");
  const cities = getLocationsByKind("city");

  return (
    <>
      <Nav forceLight />
      <main id="main" className="pt-16 sm:pt-20">
        {/* HERO */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal className="max-w-4xl">
            <Eyebrow className="mb-6">For UK practitioners</Eyebrow>
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
              <Fragment key="0">Where you</Fragment>,
              <Fragment key="1">
                <span style={{ color: "var(--color-au-pink)" }}>practise</span>{" "}
                matters.
              </Fragment>,
            ]}
          />
          <ScrollReveal delay={0.15}>
            <p className="max-w-2xl text-[1.0625rem] sm:text-[1.125rem] md:text-[1.25rem] text-au-charcoal/85 leading-relaxed">
              UK aesthetics regulation isn&rsquo;t one rulebook, it diverges
              by nation, and the practitioner economics shift dramatically
              between cities. Pick the page closest to where you work.
            </p>
          </ScrollReveal>
        </PosterBlock>

        {/* NATIONS */}
        <PosterBlock tone="white" contained>
          <ScrollReveal className="max-w-3xl mb-10">
            <Eyebrow className="mb-6">By UK nation</Eyebrow>
            <h2
              className="font-display font-black text-au-charcoal mb-4"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
                lineHeight: 1.05,
                letterSpacing: "var(--tracking-tight-display)",
              }}
            >
              Four nations,{" "}
              <span style={{ color: "var(--color-au-pink)" }}>four rulebooks</span>.
            </h2>
            <p className="text-[1rem] sm:text-[1.0625rem] text-au-charcoal/80 leading-relaxed">
              Healthcare regulation is devolved across the UK, CQC in England,
              HIS in Scotland, HIW in Wales, RQIA in Northern Ireland. The
              UK-wide bodies (NMC, MHRA, JCCP, CPSA, ASA) overlay all four,
              but the framework I teach flags every divergence.
            </p>
          </ScrollReveal>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">
            {nations.map((n) => (
              <li
                key={n.slug}
                className="border border-au-charcoal/15 rounded-[5px] hover:border-[var(--color-au-pink)] transition-colors"
              >
                <Link href={`/for/${n.slug}`} className="block p-6 sm:p-7">
                  <p
                    className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] mb-2"
                    style={{ color: "var(--color-au-pink)" }}
                  >
                    Nation
                  </p>
                  <h3
                    className="font-display font-black text-au-charcoal mb-3"
                    style={{
                      fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
                      letterSpacing: "var(--tracking-tight-display)",
                    }}
                  >
                    {n.name}
                  </h3>
                  <p className="text-[0.9375rem] text-au-charcoal/75 leading-relaxed">
                    {n.summary}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </PosterBlock>

        {/* CITIES */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal className="max-w-3xl mb-10">
            <Eyebrow className="mb-6">By city</Eyebrow>
            <h2
              className="font-display font-black text-au-charcoal mb-4"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
                lineHeight: 1.05,
                letterSpacing: "var(--tracking-tight-display)",
              }}
            >
              Four cities,{" "}
              <span style={{ color: "var(--color-au-pink)" }}>four economies</span>.
            </h2>
            <p className="text-[1rem] sm:text-[1.0625rem] text-au-charcoal/80 leading-relaxed">
              Practitioner density and fee tolerance vary sharply between UK
              cities. The framework I teach doesn&rsquo;t change, but the
              order in which I&rsquo;d steer you through it does.
            </p>
          </ScrollReveal>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">
            {cities.map((c) => (
              <li
                key={c.slug}
                className="border border-au-charcoal/15 rounded-[5px] bg-au-white hover:border-[var(--color-au-pink)] transition-colors"
              >
                <Link href={`/for/${c.slug}`} className="block p-6 sm:p-7">
                  <p
                    className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] mb-2"
                    style={{ color: "var(--color-au-pink)" }}
                  >
                    City · {c.region}
                  </p>
                  <h3
                    className="font-display font-black text-au-charcoal mb-3"
                    style={{
                      fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
                      letterSpacing: "var(--tracking-tight-display)",
                    }}
                  >
                    {c.name}
                  </h3>
                  <p className="text-[0.9375rem] text-au-charcoal/75 leading-relaxed">
                    {c.summary}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </PosterBlock>
      </main>
      <Footer />
    </>
  );
}

void LOCATIONS;

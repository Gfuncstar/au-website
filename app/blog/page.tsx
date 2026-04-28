/**
 * /blog — the AU Notebook index.
 *
 * Lists every post by date, newest first. Editorial layout matching the
 * rest of the site — PosterBlock + Eyebrow + brand pink accent on each
 * topic label.
 *
 * Posts are loaded from `content/blog/*.md` via `lib/blog.ts`. The
 * publishing agent only ever writes new .md files into that folder; no
 * code changes required to publish.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PosterBlock } from "@/components/PosterBlock";
import { Eyebrow } from "@/components/Eyebrow";
import { ScrollReveal } from "@/components/ScrollReveal";
import { RevealHeadline } from "@/components/RevealHeadline";
import { Fragment } from "react";
import { getAllPosts, formatPostDate, TOPIC_LABELS } from "@/lib/blog";
import { BRAND, FOUNDER } from "@/lib/credentials";

export const metadata: Metadata = {
  title: "Journal — unlocking the aesthetics arena",
  description:
    "A clinical journal for UK aesthetic practitioners. Ingredient science, treatments, regulation, peer-reviewed studies, and the claims that don't survive scrutiny. Three pieces a week from Bernadette Tobin RN, MSc.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Journal — Aesthetics Unlocked",
    description:
      "Clinical reads for UK aesthetic practitioners. Sourced, referenced, written for working clinicians.",
    url: "/blog",
    type: "website",
  },
};

export const dynamic = "force-static";

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  const siteUrl = `https://${BRAND.domain}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteUrl}/blog#blog`,
    name: "Aesthetics Unlocked Journal",
    description:
      "A clinical journal for UK aesthetic practitioners by Bernadette Tobin RN, MSc.",
    url: `${siteUrl}/blog`,
    publisher: {
      "@type": "Organization",
      name: BRAND.name,
      url: siteUrl,
    },
    author: {
      "@type": "Person",
      name: FOUNDER.fullName,
      honorificSuffix: FOUNDER.shortCredentials,
    },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${siteUrl}/blog/${p.slug}`,
      datePublished: p.date,
      author: { "@type": "Person", name: p.author },
    })),
  };

  return (
    <>
      <Nav forceLight />
      <main id="main" className="pt-16 sm:pt-20">
        {/* ============================================================
            HERO
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal className="max-w-4xl">
            <Eyebrow className="mb-6">The Journal</Eyebrow>
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
              <Fragment key="0">Unlocking the</Fragment>,
              <Fragment key="1">
                <span style={{ color: "var(--color-au-pink)" }}>aesthetics</span>
                {" "}arena.
              </Fragment>,
            ]}
          />
          <ScrollReveal delay={0.15}>
            <p className="max-w-2xl text-[1.0625rem] sm:text-[1.125rem] md:text-[1.25rem] text-au-charcoal/85 leading-relaxed">
              The studies that move the field. The regulation
              you&rsquo;ll need to act on. The claims that don&rsquo;t
              survive scrutiny. Concise, referenced, written for
              working clinicians.
            </p>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            POST LIST
            ============================================================ */}
        <PosterBlock tone="white" contained>
          {posts.length === 0 ? (
            <ScrollReveal className="max-w-2xl">
              <p className="text-[1.0625rem] text-au-charcoal/75 leading-relaxed">
                First piece, Sunday.
              </p>
            </ScrollReveal>
          ) : (
            <ul className="flex flex-col max-w-4xl">
              {posts.map((p, i) => (
                <li
                  key={p.slug}
                  className={`${
                    i === 0 ? "border-y" : "border-b"
                  } border-au-charcoal/15`}
                >
                  <Link
                    href={`/blog/${p.slug}`}
                    className="block py-7 sm:py-9 group"
                  >
                    <div className="flex items-baseline justify-between gap-6 mb-3">
                      <p
                        className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem]"
                        style={{ color: "var(--color-au-pink)" }}
                      >
                        {TOPIC_LABELS[p.topic]}
                      </p>
                      <p className="font-section uppercase tracking-[0.15em] text-[0.6875rem] text-au-charcoal/55 whitespace-nowrap">
                        {formatPostDate(p.date)}
                      </p>
                    </div>
                    <h2
                      className="font-display font-black text-au-charcoal mb-3 group-hover:text-[var(--color-au-pink)] transition-colors"
                      style={{
                        fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
                        lineHeight: 1.05,
                        letterSpacing: "var(--tracking-tight-display)",
                      }}
                    >
                      {p.title}
                    </h2>
                    <p className="text-[0.9375rem] sm:text-[1rem] text-au-charcoal/75 leading-relaxed max-w-2xl">
                      {p.excerpt}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </PosterBlock>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

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
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PosterBlock } from "@/components/PosterBlock";
import { Eyebrow } from "@/components/Eyebrow";
import { ScrollReveal } from "@/components/ScrollReveal";
import { RevealHeadline } from "@/components/RevealHeadline";
import { JournalIndexBody } from "@/components/blog/JournalIndexBody";
import { Fragment } from "react";
import { getAllPosts } from "@/lib/blog";
import { BRAND, FOUNDER } from "@/lib/credentials";

export const metadata: Metadata = {
  title: "Journal, unlocking the aesthetics arena",
  description:
    "A clinical journal for UK aesthetic practitioners. Ingredient science, treatments, regulation, peer-reviewed studies, and the claims that don't survive scrutiny. Three pieces a week from Bernadette Tobin RN, MSc.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Journal, Aesthetics Unlocked",
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
            FEATURED + SEARCH + LIST, split into a client component
            so the search filter can run interactively. The static page
            still pre-renders the full list as initial state.
            ============================================================ */}
        <PosterBlock tone="white" contained>
          <JournalIndexBody posts={posts} />
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

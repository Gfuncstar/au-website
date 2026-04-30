/**
 * /blog/[slug] — single post page.
 *
 * Renders the markdown body inside the editorial-poster shell. Pulls
 * frontmatter (title, date, topic, excerpt, sources) from `lib/blog.ts`.
 *
 * Sources render as a list at the foot of the post — every claim must
 * be backed by a primary source per `content/blog/README.md`. The list
 * also gives Google a clear signal of editorial integrity.
 *
 * Static-generated at build time via `generateStaticParams`.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PosterBlock } from "@/components/PosterBlock";
import { Eyebrow } from "@/components/Eyebrow";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  getAllPosts,
  getPostBySlug,
  formatPostDate,
  TOPIC_LABELS,
  RELATED_LINKS_BY_TOPIC,
} from "@/lib/blog";
import { BRAND, FOUNDER, AWARDS } from "@/lib/credentials";
import { NMC_REGISTER_URL } from "@/lib/links";

export const dynamic = "force-static";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const siteUrl = `https://${BRAND.domain}`;
  const pageUrl = `${siteUrl}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${pageUrl}#article`,
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.date,
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        wordCount: post.wordCount,
        timeRequired: `PT${post.readingTimeMinutes}M`,
        articleSection: TOPIC_LABELS[post.topic],
        inLanguage: "en-GB",
        author: {
          "@type": "Person",
          "@id": `${siteUrl}/#person`,
          name: post.author,
          honorificSuffix: FOUNDER.longCredentials,
          jobTitle: "Founder, Aesthetics Unlocked",
          alumniOf: "MSc Advanced Practice (Level 7)",
          identifier: `NMC PIN ${FOUNDER.nmcPin}`,
          url: `${siteUrl}/about`,
          sameAs: [NMC_REGISTER_URL],
          award: AWARDS.map((a) => a.long),
        },
        publisher: {
          "@type": "Organization",
          name: BRAND.name,
          url: siteUrl,
        },
        citation: post.sources.map((s) => ({
          "@type": "CreativeWork",
          name: s.title,
          url: s.url,
          publisher: { "@type": "Organization", name: s.publisher },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${siteUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Journal",
            item: `${siteUrl}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Nav forceLight />
      <main id="main" className="pt-16 sm:pt-20">
        {/* ============================================================
            HEADER
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal className="max-w-4xl">
            <div className="flex items-baseline justify-between gap-6 mb-6 flex-wrap">
              <Eyebrow>{TOPIC_LABELS[post.topic]}</Eyebrow>
              <p className="font-section uppercase tracking-[0.15em] text-[0.6875rem] text-au-charcoal/60">
                {formatPostDate(post.date)}
                <span className="mx-2 text-au-charcoal/30">·</span>
                {post.readingTimeMinutes} min read
              </p>
            </div>
            <h1
              className="font-display font-black text-au-charcoal mb-6"
              style={{
                fontSize: "var(--text-poster)",
                lineHeight: "var(--leading-poster)",
                letterSpacing: "var(--tracking-tight-display)",
              }}
            >
              {post.title}
            </h1>
            <p className="max-w-2xl text-[1.0625rem] sm:text-[1.125rem] md:text-[1.25rem] text-au-charcoal/85 leading-relaxed mb-2">
              {post.excerpt}
            </p>
            <p className="text-[0.9375rem] text-au-charcoal/65">
              By{" "}
              <Link
                href="/about"
                className="underline decoration-[var(--color-au-pink)] underline-offset-4 hover:text-[var(--color-au-pink)] transition-colors"
              >
                {post.author}
              </Link>
            </p>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            BODY
            ============================================================ */}
        <PosterBlock tone="white" contained>
          <article
            className="prose-au max-w-3xl text-au-charcoal"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </PosterBlock>

        {/* ============================================================
            SOURCES
            ============================================================ */}
        {post.sources.length > 0 && (
          <PosterBlock tone="cream" contained>
            <ScrollReveal className="max-w-3xl">
              <Eyebrow className="mb-6">Sources</Eyebrow>
              <ol className="flex flex-col gap-4 list-decimal list-outside pl-5">
                {post.sources.map((s) => (
                  <li
                    key={s.url}
                    className="text-[0.9375rem] sm:text-[1rem] text-au-charcoal/85 leading-relaxed"
                  >
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display font-bold text-au-charcoal hover:text-[var(--color-au-pink)] transition-colors"
                    >
                      {s.title}
                    </a>
                    <span className="text-au-charcoal/60">, {s.publisher}</span>
                  </li>
                ))}
              </ol>
            </ScrollReveal>
          </PosterBlock>
        )}

        {/* ============================================================
            CONTINUE, internal links per topic. Drives readers (and
            search engines) into the deeper site: courses, the
            regulation pillar, the standards index. Three tailored
            links per topic, defined in lib/blog.ts.
            ============================================================ */}
        <PosterBlock tone="white" contained>
          <ScrollReveal className="max-w-3xl">
            <Eyebrow className="mb-6">Continue your reading</Eyebrow>
            <ul className="flex flex-col">
              {RELATED_LINKS_BY_TOPIC[post.topic].map((link, i) => (
                <li
                  key={link.href}
                  className={`${
                    i === 0 ? "border-y" : "border-b"
                  } border-au-charcoal/15`}
                >
                  <Link
                    href={link.href}
                    className="block py-5 group flex items-center justify-between gap-4"
                  >
                    <span
                      className="font-display font-bold text-au-charcoal group-hover:text-[var(--color-au-pink)] transition-colors"
                      style={{
                        fontSize: "1.0625rem",
                        letterSpacing: "var(--tracking-tight-display)",
                      }}
                    >
                      {link.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-au-charcoal/55 group-hover:text-[var(--color-au-pink)] transition-colors"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            BACK
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          <Link
            href="/blog"
            className="font-section font-semibold uppercase tracking-[0.15em] text-[0.8125rem] text-au-charcoal hover:text-[var(--color-au-pink)] transition-colors"
          >
            ← Back to the Journal
          </Link>
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

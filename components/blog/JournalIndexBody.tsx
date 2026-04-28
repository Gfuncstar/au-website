/**
 * JournalIndexBody — client-side body of /blog.
 *
 * Renders three things:
 *   1. A featured "Latest" hero card for the newest piece.
 *   2. A search input that filters the list (and hides the featured
 *      card while filtering, so the result set stays a single flat
 *      list).
 *   3. The remaining posts as the standard editorial list.
 *
 * Splits out from the server component so the search interaction can
 * run client-side. The page itself stays statically generated; this
 * component hydrates after first paint.
 */

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eyebrow } from "@/components/Eyebrow";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  type PostMeta,
  TOPIC_LABELS,
  formatPostDate,
} from "@/lib/blog-types";

type Props = {
  posts: PostMeta[];
};

export function JournalIndexBody({ posts }: Props) {
  const [query, setQuery] = useState("");

  const trimmed = query.trim().toLowerCase();
  const filtering = trimmed.length > 0;

  const filtered = useMemo(() => {
    if (!filtering) return posts;
    return posts.filter((p) => {
      const haystack = [
        p.title,
        p.excerpt,
        TOPIC_LABELS[p.topic],
        p.topic,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [posts, trimmed, filtering]);

  if (posts.length === 0) {
    return (
      <ScrollReveal className="max-w-2xl">
        <p className="text-[1.0625rem] text-au-charcoal/75 leading-relaxed">
          First piece, Sunday.
        </p>
      </ScrollReveal>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <>
      {/* ============================================================
          SEARCH BAR — pink-soft pill field with a pink magnifier and
          a darker pink ring on focus. Reads as a deliberate editorial
          accent rather than a generic search input.
          ============================================================ */}
      <ScrollReveal className="max-w-4xl mb-12 sm:mb-14">
        <label htmlFor="journal-search" className="sr-only">
          Search the Journal
        </label>
        <div
          className="relative rounded-[3px] border transition-colors focus-within:border-[color:var(--color-au-pink)]"
          style={{
            backgroundColor: "color-mix(in srgb, var(--color-au-pink-soft) 35%, white)",
            borderColor: "color-mix(in srgb, var(--color-au-pink) 35%, transparent)",
          }}
        >
          {/* Magnifier glyph — Unicode "⌕" is right-shaped for a search
              affordance and avoids pulling in an icon library. */}
          <span
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[1.375rem] leading-none pointer-events-none"
            style={{ color: "var(--color-au-pink)" }}
          >
            ⌕
          </span>
          <input
            id="journal-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics — JCCP, retinoids, MHRA, polynucleotides…"
            className="w-full bg-transparent border-0 py-4 pl-11 pr-4 font-display text-[1rem] sm:text-[1.0625rem] text-au-charcoal placeholder:text-au-charcoal/45 focus:outline-none"
          />
        </div>
        {filtering && (
          <p className="font-section uppercase tracking-[0.15em] text-[0.6875rem] text-au-charcoal/60 mt-3">
            {filtered.length === 0
              ? `No matches for “${query}”.`
              : `${filtered.length} ${
                  filtered.length === 1 ? "piece" : "pieces"
                } matching “${query}”.`}
          </p>
        )}
      </ScrollReveal>

      {/* ============================================================
          FEATURED — dark-mode poster card. Charcoal background,
          white type, pink accents. Sets the latest piece visually
          apart from the cream hero above and the white list below.
          Only shown when not filtering, so the search result set
          always reads as one flat list.
          ============================================================ */}
      {!filtering && featured && (
        <ScrollReveal className="max-w-4xl mb-14 sm:mb-16">
          <Link
            href={`/blog/${featured.slug}`}
            className="block group bg-au-charcoal text-au-white p-8 sm:p-10 md:p-12 rounded-[3px] transition-colors hover:bg-au-black"
          >
            <div className="flex items-baseline justify-between gap-6 mb-6 flex-wrap">
              <p
                className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem]"
                style={{ color: "var(--color-au-pink)" }}
              >
                Latest · {TOPIC_LABELS[featured.topic]}
              </p>
              <p className="font-section uppercase tracking-[0.15em] text-[0.6875rem] text-au-white/55 whitespace-nowrap">
                {formatPostDate(featured.date)}
                {featured.readingTimeMinutes ? (
                  <>
                    <span className="mx-2 text-au-white/30">·</span>
                    {featured.readingTimeMinutes} min read
                  </>
                ) : null}
              </p>
            </div>
            <h2
              className="font-display font-black text-au-white mb-5 group-hover:text-[var(--color-au-pink)] transition-colors"
              style={{
                fontSize: "clamp(2rem, 5.5vw, 3.25rem)",
                lineHeight: 0.98,
                letterSpacing: "var(--tracking-tight-display)",
              }}
            >
              {featured.title}
            </h2>
            <p className="max-w-2xl text-[1.0625rem] sm:text-[1.125rem] text-au-white/85 leading-relaxed mb-7">
              {featured.excerpt}
            </p>
            <span className="inline-flex items-center gap-2 font-section font-semibold uppercase tracking-[0.15em] text-[0.8125rem] text-au-white group-hover:text-[var(--color-au-pink)] transition-colors">
              Read the latest piece <span aria-hidden="true">→</span>
            </span>
          </Link>
        </ScrollReveal>
      )}

      {/* ============================================================
          LIST — when filtering, this is the full filtered set.
          When not filtering, this is everything below the featured
          card.
          ============================================================ */}
      {(filtering ? filtered : rest).length > 0 && (
        <>
          {!filtering && (
            <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] text-au-charcoal/55 mb-6">
              Earlier pieces
            </p>
          )}
          <ul className="flex flex-col max-w-4xl">
            {(filtering ? filtered : rest).map((p, i) => (
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
        </>
      )}
    </>
  );
}

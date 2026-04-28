/**
 * JournalIndexBody — body of /blog.
 *
 * Renders two things:
 *   1. A featured "Latest" hero card (dark mode) for the newest piece.
 *   2. The remaining posts as the standard editorial list, under an
 *      "Earlier pieces" label.
 *
 * Search was removed for now per Giles' call (2026-04-28). Re-add by
 * restoring the useState-driven filter and the search-field block from
 * git history if/when wanted.
 *
 * Currently no client-side interactivity is needed, but the file stays
 * in `components/blog/` and remains a separate component so adding
 * search back later is a single-file change.
 */

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
          FEATURED — dark-mode poster card. Charcoal background,
          white type, pink accents. Sets the latest piece visually
          apart from the cream hero above and the white list below.
          ============================================================ */}
      {featured && (
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
          EARLIER PIECES
          ============================================================ */}
      {rest.length > 0 && (
        <>
          <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] text-au-charcoal/55 mb-6">
            Earlier pieces
          </p>
          <ul className="flex flex-col max-w-4xl">
            {rest.map((p, i) => (
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

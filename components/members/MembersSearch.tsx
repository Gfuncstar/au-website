/**
 * MembersSearch — search bar at the top of /members/courses.
 *
 * Filters across every lesson in every course the member owns, by
 * lesson title, course title, and lesson summary. Substring match,
 * case-insensitive, instant as the member types. Results link
 * straight into the lesson player.
 *
 * Title + course + summary only — not lesson body. Keeps the client
 * payload small and the search fast. A future v2 could move to
 * server-side full-text search if practitioners want body-level
 * lookup ("find every mention of azelaic acid").
 */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type SearchableLesson = {
  courseSlug: string;
  courseTitle: string;
  lessonSlug: string;
  lessonTitle: string;
  lessonSummary: string;
};

interface Props {
  lessons: readonly SearchableLesson[];
}

const RESULT_CAP = 20;
const MIN_QUERY = 2;

export function MembersSearch({ lessons }: Props) {
  const [query, setQuery] = useState<string>("");

  const trimmed = query.trim().toLowerCase();
  const tooShort = trimmed.length > 0 && trimmed.length < MIN_QUERY;
  const hasQuery = trimmed.length >= MIN_QUERY;

  const results = useMemo(() => {
    if (!hasQuery) return [] as SearchableLesson[];
    return lessons.filter(
      (l) =>
        l.lessonTitle.toLowerCase().includes(trimmed) ||
        l.courseTitle.toLowerCase().includes(trimmed) ||
        l.lessonSummary.toLowerCase().includes(trimmed),
    );
  }, [trimmed, hasQuery, lessons]);

  const visible = results.slice(0, RESULT_CAP);
  const overflow = results.length > RESULT_CAP;

  if (lessons.length === 0) return null;

  return (
    <section aria-label="Search your library" className="not-prose">
      <label htmlFor="members-search" className="block">
        <span className="sr-only">Search your library</span>
        <span className="relative block">
          <span
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-au-mid"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16" y2="16" />
            </svg>
          </span>
          <input
            id="members-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your library — lesson, course, or topic"
            className="w-full bg-au-white border border-au-charcoal/15 focus:border-au-pink focus:outline-none rounded-[3px] pl-12 pr-4 py-3.5 text-[0.9375rem] sm:text-[1rem] text-au-charcoal placeholder:text-au-charcoal/40 transition-colors"
          />
        </span>
      </label>

      {tooShort && (
        <p className="mt-3 font-section font-semibold uppercase tracking-[0.12em] text-[0.6875rem] text-au-mid">
          Keep typing — at least {MIN_QUERY} characters.
        </p>
      )}

      {hasQuery && (
        <div className="mt-5">
          <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.7rem] text-au-mid mb-4">
            {results.length === 0
              ? "No matches in your library"
              : `${results.length} lesson${results.length === 1 ? "" : "s"} found${overflow ? ` (showing first ${RESULT_CAP})` : ""}`}
          </p>

          {results.length === 0 && (
            <p className="text-[0.9375rem] text-au-charcoal/85 leading-relaxed max-w-[60ch]">
              Nothing in your enrolled courses matches{" "}
              <span className="font-bold">&ldquo;{query.trim()}&rdquo;</span>.
              Try a different word, or browse the full library below to see if
              another course covers it.
            </p>
          )}

          {results.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {visible.map((r) => (
                <li
                  key={`${r.courseSlug}:${r.lessonSlug}`}
                  className="bg-au-pink-soft/30 rounded-[4px] p-4"
                >
                  <Link
                    href={`/members/courses/${r.courseSlug}/${r.lessonSlug}`}
                    className="block group"
                  >
                    <p className="font-section font-semibold uppercase tracking-[0.14em] text-[0.625rem] text-au-mid mb-2">
                      {r.courseTitle}
                    </p>
                    <p className="font-display font-bold text-au-charcoal text-[0.9375rem] sm:text-[1rem] leading-snug group-hover:text-au-pink transition-colors mb-1.5">
                      {highlight(r.lessonTitle, trimmed)}
                    </p>
                    {r.lessonSummary && (
                      <p className="text-[0.8125rem] text-au-charcoal/75 leading-relaxed line-clamp-2">
                        {highlight(r.lessonSummary, trimmed)}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

/**
 * Wraps the matched substring in a pink-tinted span so the member's
 * eye lands on it immediately. Case-insensitive match, escapes the
 * query so a regex-meaningful character (e.g. ".") doesn't break.
 */
function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(${safe})`, "ig");
  const parts = text.split(re);
  return parts.map((part, i) =>
    re.test(part) ? (
      <span
        key={i}
        className="bg-au-pink/20 text-au-charcoal rounded-[2px] px-0.5"
      >
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

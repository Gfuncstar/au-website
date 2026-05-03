/**
 * CoursesCatalog — interactive filter shell for the /courses index.
 *
 * Built for a growing catalogue. Three controls:
 *   1. Subject tabs   — ALL · CLINICAL · REGULATORY · BUSINESS, with live counts
 *   2. Search field   — fuzzy text match within the active subject
 *   3. Course grid    — same CourseCard tiles, just filtered & re-sorted
 *
 * Free tasters are routed onto whichever subject their parent paid course
 * sits in (via `getCourseSubject` in lib/courses.ts) — so the Acne Mini
 * shows up under CLINICAL, and the 5K+ Mini under BUSINESS, etc.
 *
 * Within each subject:
 *   • Free tasters first (lower commitment, natural entry point)
 *   • Then paid courses, ascending by price
 *   • Stable alphabetical tiebreaker so the order is deterministic
 *
 * Filter chrome sticks to the top on scroll (mobile-aware) so the user
 * can switch tabs / search without losing position when the page is
 * long. CourseCard tiles render exactly as they did before — same look,
 * same SEO surface (every card is still link-rich and crawlable on
 * "All").
 */

"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { CourseCard } from "@/components/CourseCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  COURSE_SUBJECTS,
  type Course,
  type CourseSubject,
  getCourseSubject,
} from "@/lib/courses";

type TabValue = "All" | "Free" | CourseSubject;

// "Free" sits between "All" and the subject tabs — it's a price filter,
// not a subject filter, but visitors looking for tasters expect it
// alongside the other primary filters.
const TABS: readonly TabValue[] = ["All", "Free", ...COURSE_SUBJECTS] as const;

type Props = {
  courses: readonly Course[];
  /** Slug → mark JSX. Lives at the page level because marks are React
   *  components and can't sit in the data file. */
  marks: Record<string, React.ReactNode>;
};

export function CoursesCatalog({ courses, marks }: Props) {
  const [activeTab, setActiveTab] = useState<TabValue>("All");
  const [query, setQuery] = useState("");
  const searchId = useId();

  // Honour ?filter=free / #free on first paint so deep-links from the
  // burger menu's "Start free" CTA land on the Free filter directly.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace("#", "").toLowerCase();
    if (
      params.get("filter")?.toLowerCase() === "free" ||
      hash === "free"
    ) {
      setActiveTab("Free");
    }
  }, []);

  // Pre-compute the tab → courses index once. Keeps the filter logic
  // O(1) per render and lets us show live counts on each tab.
  const bySubject = useMemo(() => {
    const map: Record<TabValue, Course[]> = {
      All: [...courses],
      Free: courses.filter((c) => c.price === undefined),
      Clinical: [],
      Regulatory: [],
      Business: [],
    };
    for (const c of courses) {
      const subject = getCourseSubject(c);
      if (subject) map[subject].push(c);
    }
    // Sort each bucket: free first, then paid by ascending price, then
    // alphabetical for ties. Free bucket is all free, so it falls back
    // to alphabetical via the same comparator.
    for (const key of Object.keys(map) as TabValue[]) {
      map[key].sort((a, b) => {
        const aFree = a.price === undefined ? 0 : 1;
        const bFree = b.price === undefined ? 0 : 1;
        if (aFree !== bFree) return aFree - bFree;
        const aP = a.price ?? 0;
        const bP = b.price ?? 0;
        if (aP !== bP) return aP - bP;
        return a.title.localeCompare(b.title);
      });
    }
    return map;
  }, [courses]);

  const trimmed = query.trim().toLowerCase();
  const visible = useMemo(() => {
    const pool = bySubject[activeTab];
    if (!trimmed) return pool;
    return pool.filter((c) => {
      const haystack = [
        c.title,
        c.summary,
        c.eyebrow,
        c.format,
        c.bullets.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [bySubject, activeTab, trimmed]);

  return (
    <div>
      {/* ============================================================
          WHERE SHOULD I START?, three-prompt decision shortcut.
          Sits above the filter bar so a first-time visitor doesn't
          have to scan all 10 cards. Each prompt jumps the catalogue
          to the right tab so the recommendation is in eyeline.
          ============================================================ */}
      <ScrollReveal className="mb-10 sm:mb-12">
        <div className="bg-au-charcoal text-au-white rounded-[5px] p-6 sm:p-7 md:p-8">
          <div className="flex items-baseline justify-between gap-3 mb-5 sm:mb-6">
            <p
              className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] sm:text-[0.75rem]"
              style={{ color: "var(--color-au-pink)" }}
            >
              Where should I start?
            </p>
            <p className="hidden sm:block font-section font-semibold uppercase tracking-[0.15em] text-[0.6875rem] text-au-white/55">
              Every paid course has a free taster
            </p>
          </div>
          <h3
            className="font-display font-black text-au-white leading-[1.05] mb-6 sm:mb-7"
            style={{
              fontSize: "clamp(1.375rem, 4vw, 2rem)",
              letterSpacing: "var(--tracking-tight-display)",
            }}
          >
            Start with the goal{" "}
            <span style={{ color: "var(--color-au-pink)" }}>
              you actually have.
            </span>
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <li>
              <button
                type="button"
                onClick={() => setActiveTab("Clinical")}
                className="group block w-full text-left rounded-[5px] p-4 sm:p-5 bg-au-white/5 hover:bg-[var(--color-au-pink)]/15 border border-au-white/10 hover:border-[var(--color-au-pink)]/40 transition-colors"
              >
                <p className="font-section font-semibold uppercase tracking-[0.15em] text-[0.625rem] text-au-white/55 mb-1.5">
                  I want to&hellip;
                </p>
                <p
                  className="font-display font-bold text-au-white leading-tight"
                  style={{
                    fontSize: "1.0625rem",
                    letterSpacing: "var(--tracking-tight-display)",
                  }}
                >
                  Treat skin better.
                </p>
                <p className="text-[0.8125rem] text-au-white/65 leading-snug mt-1.5">
                  Clinical reasoning anchored in NICE guidance, acne,
                  rosacea, the full skin pathway.
                </p>
                <span
                  className="inline-flex items-center gap-1 mt-3 text-[0.6875rem] font-section font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "var(--color-au-pink)" }}
                >
                  See clinical courses{" "}
                  <span aria-hidden="true">→</span>
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setActiveTab("Regulatory")}
                className="group block w-full text-left rounded-[5px] p-4 sm:p-5 bg-au-white/5 hover:bg-[var(--color-au-pink)]/15 border border-au-white/10 hover:border-[var(--color-au-pink)]/40 transition-colors"
              >
                <p className="font-section font-semibold uppercase tracking-[0.15em] text-[0.625rem] text-au-white/55 mb-1.5">
                  I want to&hellip;
                </p>
                <p
                  className="font-display font-bold text-au-white leading-tight"
                  style={{
                    fontSize: "1.0625rem",
                    letterSpacing: "var(--tracking-tight-display)",
                  }}
                >
                  Get compliant.
                </p>
                <p className="text-[0.8125rem] text-au-white/65 leading-snug mt-1.5">
                  The UK regulatory framework, plain English, JCCP,
                  CPSA, MHRA, ASA, the licensing direction of travel.
                </p>
                <span
                  className="inline-flex items-center gap-1 mt-3 text-[0.6875rem] font-section font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "var(--color-au-pink)" }}
                >
                  See regulatory courses{" "}
                  <span aria-hidden="true">→</span>
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setActiveTab("Business")}
                className="group block w-full text-left rounded-[5px] p-4 sm:p-5 bg-au-white/5 hover:bg-[var(--color-au-pink)]/15 border border-au-white/10 hover:border-[var(--color-au-pink)]/40 transition-colors"
              >
                <p className="font-section font-semibold uppercase tracking-[0.15em] text-[0.625rem] text-au-white/55 mb-1.5">
                  I want to&hellip;
                </p>
                <p
                  className="font-display font-bold text-au-white leading-tight"
                  style={{
                    fontSize: "1.0625rem",
                    letterSpacing: "var(--tracking-tight-display)",
                  }}
                >
                  Charge more, work less.
                </p>
                <p className="text-[0.8125rem] text-au-white/65 leading-snug mt-1.5">
                  Niche, signature offers, confident pricing, the
                  framework Bernadette built her own clinic on.
                </p>
                <span
                  className="inline-flex items-center gap-1 mt-3 text-[0.6875rem] font-section font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "var(--color-au-pink)" }}
                >
                  See business courses{" "}
                  <span aria-hidden="true">→</span>
                </span>
              </button>
            </li>
          </ul>
          <p className="mt-5 text-[0.8125rem] text-au-white/55 sm:hidden">
            Every paid course has a free taster.
          </p>
        </div>
      </ScrollReveal>

      {/* ============================================================
          FILTER BAR, sticky on scroll, sits flush against the hero
          ============================================================ */}
      <div className="sticky top-16 sm:top-20 z-30 -mx-[35px] sm:-mx-10 md:-mx-14 mb-8 sm:mb-10 bg-au-white/92 backdrop-blur-sm border-y border-au-charcoal/8">
        <div className="px-[35px] sm:px-10 md:px-14 py-4 sm:py-5 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Tabs, wrap on mobile so all 5 always fit on screen
              (3 on row 1, 2 stretched on row 2). Flex single-row on
              sm+ where labels take their natural width. */}
          <nav aria-label="Filter courses by subject">
            <ul className="flex flex-wrap items-stretch gap-1.5 sm:flex-nowrap sm:items-center">
              {TABS.map((tab) => {
                const count = bySubject[tab].length;
                const active = activeTab === tab;
                return (
                  <li
                    key={tab}
                    className="flex-1 basis-[28%] sm:basis-auto sm:flex-none"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      aria-pressed={active}
                      className={[
                        "group inline-flex w-full sm:w-auto items-center justify-center gap-1.5 sm:gap-2",
                        "px-3 sm:px-4 py-2.5 rounded-[5px]",
                        "font-section font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em]",
                        "text-[0.6875rem] sm:text-[0.8125rem] whitespace-nowrap",
                        "transition-colors duration-200 outline-none",
                        "focus-visible:ring-2 focus-visible:ring-[var(--color-au-pink)]",
                        active
                          ? "bg-au-charcoal text-au-white hover:bg-[var(--color-au-pink)]"
                          : "bg-au-charcoal/4 text-au-charcoal/75 hover:bg-[var(--color-au-pink)] hover:text-au-white",
                      ].join(" ")}
                    >
                      <span>{tab}</span>
                      <span
                        className={[
                          "hidden sm:inline text-[0.6875rem] tabular-nums",
                          active ? "text-au-white/55" : "text-au-charcoal/40",
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Search */}
          <label
            htmlFor={searchId}
            className={[
              "relative flex items-center gap-2 lg:max-w-xs lg:w-full",
              "rounded-[5px] border border-au-charcoal/15",
              "bg-au-white",
              "focus-within:border-au-charcoal/40",
              "transition-colors",
            ].join(" ")}
          >
            <SearchIcon className="ml-3 shrink-0 text-au-charcoal/45" />
            <span className="sr-only">
              Search {activeTab === "All" ? "courses" : `${activeTab.toLowerCase()} courses`}
            </span>
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                activeTab === "All"
                  ? "Search every course"
                  : `Search ${activeTab.toLowerCase()} courses`
              }
              className={[
                "flex-1 min-w-0 bg-transparent py-2.5 pr-2",
                "text-[0.9375rem] text-au-charcoal placeholder:text-au-charcoal/40",
                "outline-none",
              ].join(" ")}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="mr-2 p-1.5 rounded-[3px] text-au-charcoal/55 hover:text-au-charcoal hover:bg-au-charcoal/6 transition-colors"
              >
                <CloseIcon />
              </button>
            )}
          </label>
        </div>
      </div>

      {/* ============================================================
          GRID, same CourseCard layout, filtered + sorted
          ============================================================ */}
      {visible.length > 0 ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          aria-live="polite"
          aria-label={`${visible.length} ${
            visible.length === 1 ? "course" : "courses"
          } shown`}
        >
          {visible.map((c, i) => (
            // The eyebrow ("FREE · 2 DAYS", "REGULATORY · 4 WEEKS · £499")
            // already carries duration and price, so we deliberately omit
            // the secondary stats rail on the catalogue grid — it just
            // repeats the eyebrow and steals room from the title.
            <ScrollReveal key={c.slug} delay={Math.min(i, 5) * 0.05}>
              <CourseCard
                tone={c.tone}
                eyebrow={c.eyebrow}
                title={c.title}
                bullets={c.bullets}
                mark={marks[c.slug]}
                href={`/courses/${c.slug}`}
                ctaText={c.ctaText}
                price={c.price}
                weeklyHours={c.weeklyHours}
                isCpdEvidence={c.isCpdEvidence}
              />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <EmptyState
          query={trimmed}
          activeTab={activeTab}
          onClear={() => {
            setQuery("");
            setActiveTab("All");
          }}
        />
      )}
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function EmptyState({
  query,
  activeTab,
  onClear,
}: {
  query: string;
  activeTab: TabValue;
  onClear: () => void;
}) {
  return (
    <div className="py-16 sm:py-24 text-center max-w-xl mx-auto">
      <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.75rem] text-[var(--color-au-pink)] mb-4">
        Nothing matches yet
      </p>
      <p className="text-au-charcoal text-[1.0625rem] sm:text-[1.125rem] leading-relaxed">
        {query ? (
          <>
            No {activeTab === "All" ? "courses" : `${activeTab.toLowerCase()} courses`}{" "}
            match{" "}
            <span className="font-medium text-au-charcoal">“{query}”</span>.
          </>
        ) : (
          <>No courses sit under {activeTab} yet. New ones land here as the catalogue grows.</>
        )}
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-[5px] bg-au-charcoal text-au-white font-section font-semibold uppercase tracking-[0.18em] text-[0.75rem] hover:bg-au-charcoal/90 transition-colors"
      >
        Show all courses
      </button>
    </div>
  );
}

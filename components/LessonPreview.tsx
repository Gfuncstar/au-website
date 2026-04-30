/**
 * LessonPreview — stylised mockup of the Aesthetics Unlocked native
 * lesson player. Shown on paid course detail pages so visitors can
 * see what the inside-the-portal experience actually looks like
 * before they enrol.
 *
 * Built as a static SVG-style HTML mockup (rather than a real
 * screenshot) so it renders fast, works at every viewport, and
 * doesn't rely on member-area screenshots being kept in sync.
 *
 * Voice rules respected:
 *   • No "AU" — "Aesthetics Unlocked" written in full
 *   • Crisp 5px corners
 *   • Editorial typography matching the rest of the site
 */

import { Eyebrow } from "./Eyebrow";

type Props = {
  /** Course title — surfaces in the mocked-up nav so the preview
   *  feels course-specific. Truncated heavily for the small UI. */
  courseTitle: string;
  /** Optional caption sentence for context. Defaults to a generic
   *  "this is what a lesson looks like" line. */
  caption?: string;
};

export function LessonPreview({ courseTitle, caption }: Props) {
  // Trim the course title so the mocked breadcrumb stays compact.
  const breadcrumbTitle =
    courseTitle.length > 32
      ? `${courseTitle.slice(0, 32)}…`
      : courseTitle;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,520px)] gap-8 lg:gap-12 items-center">
      {/* ------- Left column: the why ------- */}
      <div>
        <Eyebrow className="mb-5">Inside the lesson</Eyebrow>
        <h2
          className="font-display font-black text-au-charcoal leading-[1.05] mb-5"
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
            letterSpacing: "var(--tracking-tight-display)",
          }}
        >
          Editorial lessons,{" "}
          <span style={{ color: "var(--color-au-pink)" }}>
            built to be read.
          </span>
        </h2>
        <p className="text-au-charcoal/85 leading-relaxed text-[1rem] sm:text-[1.0625rem] max-w-xl mb-5">
          {caption ??
            "Each lesson opens with an audio intro, runs as a clean editorial article, and ends with the next lesson cued up. Mobile-first when you're catching up between consultations, keyboard-navigable when you're at your desk."}
        </p>
        <ul className="flex flex-col gap-2 text-[0.9375rem] sm:text-[1rem] text-au-charcoal/80">
          <li className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-2 inline-block w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: "var(--color-au-pink)" }}
            />
            <span>
              Audio intro on every lesson, listen while you make a coffee
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-2 inline-block w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: "var(--color-au-pink)" }}
            />
            <span>
              Per-lesson progress tracking, with the next lesson queued up
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-2 inline-block w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: "var(--color-au-pink)" }}
            />
            <span>
              Keyboard navigation for desk study (arrow keys / J–K)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-2 inline-block w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: "var(--color-au-pink)" }}
            />
            <span>
              Calm typography, no auto-play video, no marketing pop-ups
            </span>
          </li>
        </ul>
      </div>

      {/* ------- Right column: the mockup ------- */}
      <div
        aria-hidden="true"
        className="relative bg-au-charcoal rounded-[8px] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.45)] overflow-hidden"
      >
        {/* Faux browser chrome */}
        <div className="bg-au-charcoal/90 border-b border-au-white/10 px-3 py-2.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-au-white/25" />
          <span className="w-2 h-2 rounded-full bg-au-white/25" />
          <span className="w-2 h-2 rounded-full bg-au-white/25" />
          <span className="ml-2 flex-1 text-au-white/40 text-[0.625rem] tracking-[0.05em] truncate">
            aestheticsunlocked.co.uk / lessons / {breadcrumbTitle.toLowerCase().replace(/\s+/g, "-")}
          </span>
        </div>

        {/* Lesson body */}
        <div className="bg-au-white px-5 sm:px-6 pt-5 pb-6">
          {/* Breadcrumb */}
          <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.5625rem] text-au-charcoal/55 mb-3">
            {breadcrumbTitle} · Module 2 · Lesson 3
          </p>
          {/* Lesson title */}
          <h3
            className="font-display font-black text-au-charcoal leading-[1.05] mb-3"
            style={{
              fontSize: "1.375rem",
              letterSpacing: "var(--tracking-tight-display)",
            }}
          >
            The four mechanisms underneath every breakout.
          </h3>
          {/* Audio pill */}
          <div className="inline-flex items-center gap-2 mb-4 px-2.5 py-1.5 rounded-[5px] border border-au-charcoal/15 bg-au-charcoal/3">
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-au-white"
              style={{ backgroundColor: "var(--color-au-pink)" }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-2.5 h-2.5"
              >
                <polygon points="6 4 20 12 6 20" />
              </svg>
            </span>
            <span className="text-[0.625rem] font-section font-semibold uppercase tracking-[0.15em] text-au-charcoal/75">
              Audio intro · 2:14
            </span>
          </div>
          {/* Body skeleton lines */}
          <div className="flex flex-col gap-1.5">
            <span className="block h-2 bg-au-charcoal/10 rounded-[2px] w-[96%]" />
            <span className="block h-2 bg-au-charcoal/10 rounded-[2px] w-[88%]" />
            <span className="block h-2 bg-au-charcoal/10 rounded-[2px] w-[92%]" />
            <span className="block h-2 bg-au-charcoal/10 rounded-[2px] w-[70%]" />
          </div>
          <div className="mt-4 mb-3 flex flex-col gap-1.5">
            <span className="block h-2 bg-au-charcoal/10 rounded-[2px] w-[84%]" />
            <span className="block h-2 bg-au-charcoal/10 rounded-[2px] w-[60%]" />
          </div>
          {/* Pull quote */}
          <div
            className="my-4 pl-3 border-l-2"
            style={{ borderColor: "var(--color-au-pink)" }}
          >
            <span className="block h-2 bg-au-charcoal/15 rounded-[2px] w-[90%] mb-1.5" />
            <span className="block h-2 bg-au-charcoal/15 rounded-[2px] w-[55%]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="block h-2 bg-au-charcoal/10 rounded-[2px] w-[78%]" />
            <span className="block h-2 bg-au-charcoal/10 rounded-[2px] w-[45%]" />
          </div>

          {/* Progress + next lesson */}
          <div className="mt-5 pt-4 border-t border-au-charcoal/10 flex items-center justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[0.5625rem] font-section font-semibold uppercase tracking-[0.15em] text-au-charcoal/55">
                  Module 2 · 60% complete
                </span>
              </div>
              <div className="h-1 bg-au-charcoal/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "60%",
                    backgroundColor: "var(--color-au-pink)",
                  }}
                />
              </div>
            </div>
            <span
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] text-au-white text-[0.625rem] font-section font-semibold uppercase tracking-[0.15em]"
              style={{ backgroundColor: "var(--color-au-pink)" }}
            >
              Next lesson <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

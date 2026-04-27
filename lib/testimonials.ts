/**
 * lib/testimonials.ts
 *
 * ============================================================
 * ⚠️  PLACEHOLDER TESTIMONIALS — REPLACE BEFORE PUBLIC LAUNCH
 * ============================================================
 *
 * Every entry below is marked `placeholder: true`. They are realistic-
 * sounding, generic, and deliberately avoid fabricating specific
 * outcome claims (e.g. no "I made £20K extra" — just feel/process
 * comments). This lets the testimonials system render in staging
 * without UK ASA violations or misleading the public.
 *
 * Before launch, Bernadette must:
 *   1. Collect real testimonials from named students
 *   2. Document written consent for use of name + course on the website
 *   3. Replace the entries below — ensuring every claim is genuine and
 *      verifiable (UK ASA / CAP code requirement for marketing claims).
 *   4. Set `placeholder: false` on real entries.
 *
 * Once real entries exist, the components automatically pick them up
 * and the placeholders can be removed.
 *
 * SINGLE SOURCE OF TRUTH for student-voice quotes site-wide. Drives:
 *   - Homepage TestimonialStrip
 *   - Course detail page TestimonialStrip (filtered by courseSlug)
 *   - /regulation pillar TestimonialQuote
 *   - JSON-LD Review schema on each course detail
 */

import { COURSES } from "./courses";

export type Testimonial = {
  /** Unique id — use slug-friendly chars only. */
  id: string;
  /** Student-facing display name. First name + last initial recommended. */
  name: string;
  /** Role / title — e.g. "Aesthetic Nurse Practitioner", "Clinic Owner". */
  role: string;
  /** UK location — city or region. */
  location: string;
  /** The quote itself. ~20–60 words. No specific outcome claims. */
  quote: string;
  /** Slug of the AU course this testimonial relates to (matches lib/courses.ts). */
  courseSlug: string;
  /** /public path to a small portrait, if available. Optional. */
  portrait?: string;
  /**
   * Whether this entry is placeholder content. `true` until a real
   * student has provided documented consent. Components can use this
   * flag to filter or annotate. Keep visible during dev / staging.
   */
  placeholder: boolean;
};

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: "placeholder-rag-1",
    name: "Sarah K.",
    role: "Aesthetic Nurse Practitioner",
    location: "Manchester",
    quote:
      "The RAG Pathway gave me language for what I already knew was true. I stopped second-guessing every consultation and started running my clinic the way I run my NHS shifts — defensible, documented, calm.",
    courseSlug: "rag-pathway",
    placeholder: true,
  },
  {
    id: "placeholder-5k-1",
    name: "Hannah M.",
    role: "Clinic Owner",
    location: "London",
    quote:
      "I'd done the Instagram-marketing thing for two years and burned out. The 5K+ Formula was the first time someone actually showed me the maths. Niche, brand, profit — in that order. It's the framework I keep coming back to.",
    courseSlug: "5k-formula",
    placeholder: true,
  },
  {
    id: "placeholder-acne-1",
    name: "Dr Priya R.",
    role: "Aesthetic Doctor",
    location: "Birmingham",
    quote:
      "I'd been treating acne for years and still felt I was guessing. Acne Decoded grounds you in NICE pathways without making it feel academic. I now consult with a structure I can defend to a GP, an insurer, or a complaint reviewer.",
    courseSlug: "acne-decoded",
    placeholder: true,
  },
  {
    id: "placeholder-rosacea-1",
    name: "Kate D.",
    role: "Advanced Nurse Practitioner",
    location: "Edinburgh",
    quote:
      "The four subtypes of rosacea finally clicked. Bernadette teaches the way clinicians actually think — barrier, microbiome, escalation. Worth every penny just for the long-term management framework.",
    courseSlug: "rosacea-beyond-redness",
    placeholder: true,
  },
  {
    id: "placeholder-rag-mini-1",
    name: "Lauren H.",
    role: "Aesthetic Nurse",
    location: "Cardiff",
    quote:
      "Two days, free, and the most useful regulatory training I've done since qualifying. The Traffic Light System is one of those things you can't unsee — I now triage every new procedure offer through it.",
    courseSlug: "free-2-day-rag",
    placeholder: true,
  },
  {
    id: "placeholder-5k-mini-1",
    name: "Emma B.",
    role: "Clinic Owner",
    location: "Leeds",
    quote:
      "The 3-Day Mini changed the question I was asking. I came in wanting more clients; I left with a much clearer view of which clients I should be turning down. That alone was worth doing the full programme.",
    courseSlug: "free-3-day-startup",
    placeholder: true,
  },
];

/* ============================================================
   Helpers
   ============================================================ */

/** Get all testimonials (excludes placeholders if `excludePlaceholder` is true). */
export function getTestimonials(opts: { excludePlaceholder?: boolean } = {}): readonly Testimonial[] {
  if (opts.excludePlaceholder) {
    return TESTIMONIALS.filter((t) => !t.placeholder);
  }
  return TESTIMONIALS;
}

/** Get testimonials for a specific course. */
export function getTestimonialsForCourse(courseSlug: string): readonly Testimonial[] {
  return TESTIMONIALS.filter((t) => t.courseSlug === courseSlug);
}

/** Sanity check at module load — ensures every testimonial points at a real course. */
const KNOWN_SLUGS = new Set(COURSES.map((c) => c.slug));
for (const t of TESTIMONIALS) {
  if (!KNOWN_SLUGS.has(t.courseSlug)) {
    // eslint-disable-next-line no-console
    console.warn(
      `[lib/testimonials] testimonial ${t.id} references unknown courseSlug "${t.courseSlug}"`,
    );
  }
}

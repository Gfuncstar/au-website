/**
 * lib/credentials.ts
 *
 * SINGLE SOURCE OF TRUTH for Bernadette's credentials, awards, and the AU
 * brand-name marks. When the 2026 award winner is announced, or when new
 * credentials are added, change them HERE and the entire site updates.
 *
 * Sourced from:
 * - clone-aesthetics-unlocked/bernadette-credentials.md
 * - clone-aesthetics-unlocked/build-decisions.md (Top USP section)
 *
 * RULE: never hardcode credential strings in pages or components. Import
 * from here.
 */

export const BRAND = {
  name: "Aesthetics Unlocked",
  /** ® for the registered AU mark; ™ for the others (per Q12). */
  nameWithMark: "Aesthetics Unlocked®",
  tagline: "Injecting Strategy Into Business",
  email: "hello@aunlock.co.uk",
  domain: "aestheticsunlocked.co.uk",
  membersDomain: "app.aestheticsunlocked.co.uk",
  /** Social — confirm handle with Bernadette before launch. PLACEHOLDER. */
  instagram: {
    handle: "aestheticsunlocked",
    url: "https://www.instagram.com/aestheticsunlocked/",
  },
} as const;

export const FOUNDER = {
  firstName: "Bernadette",
  lastName: "Tobin",
  fullName: "Bernadette Tobin",
  shortCredentials: "RN, INP, MSc",
  longCredentials:
    "RN, Independent Nurse Prescriber, MSc Advanced Practice (Level 7), Level 7 Aesthetics",
  /** Verifiable on the NMC public register at nmc.org.uk */
  nmcPin: "05G1755E",
  /** Years headline numbers — surfaced in stat badges */
  yearsClinical: "20+",
  yearsAesthetics: "12",
  /** Personal */
  motherOfThree: true,
} as const;

/**
 * The two awards that lead AU's credibility — the "1-2 punch."
 *
 * Educator of the Year speaks to the teaching axis (AU);
 * Best Non-Surgical Aesthetics Clinic speaks to the practice axis (Visage).
 *
 * Both should appear on the homepage hero, About page, every paid course
 * sales page, footer, and Person/Organization JSON-LD schema.
 *
 * If/when status changes (e.g. nominee → winner), update the `status` here.
 */
export const AWARDS = [
  {
    id: "educator-of-the-year-2026",
    /** Used in hero eyebrows */
    short: "Educator of the Year 2026",
    /** Used in body copy and JSON-LD `award` */
    long: "Educator of the Year 2026 Nominee — Beauty & Aesthetics Awards",
    /** Used in stat strips and footer */
    status: "Nominee" as const,
    year: 2026,
    awardingBody: "Beauty & Aesthetics Awards",
    /** Which axis of credibility this represents */
    axis: "teaching" as const,
    /** Whose award this is — AU itself, or Visage Aesthetics (Bernadette's clinic) */
    business: "Aesthetics Unlocked",
  },
  {
    id: "best-non-surgical-clinic-2026",
    short: "Best Non-Surgical Aesthetics Clinic 2026 (Essex)",
    long: "Best Non-Surgical Aesthetics Clinic 2026 (Essex) — Health, Beauty & Wellness Awards",
    status: "Winner" as const,
    year: 2026,
    awardingBody: "Health, Beauty & Wellness Awards",
    axis: "practice" as const,
    /** This award belongs to Visage Aesthetics, NOT AU. Always credit via
     *  Bernadette as founder so the two brands stay cleanly separate. */
    business: "Visage Aesthetics",
  },
] as const;

/**
 * The verbatim phrasing used to credit the Visage award without conflating
 * the two businesses. Use this string anywhere the clinic award is
 * referenced — page copy, footer, alt text.
 */
export const VISAGE_ATTRIBUTION =
  "Bernadette also founded Visage Aesthetics, named Best Non-Surgical Aesthetics Clinic 2026 (Essex) by the Health, Beauty & Wellness Awards.";

/**
 * Concise stat-strip line for hero / footer use.
 * Falls under hero with the eyebrow above the headline.
 */
export const HERO_STAT_STRIP = [
  "Educator of the Year 2026 Nominee",
  "Independent Nurse Prescriber",
  "MSc Advanced Practice (Level 7)",
  "Level 7 Aesthetics",
  "NMC Registered",
  "20+ years clinical",
  "12 years in aesthetics",
] as const;

/** Order matters — leads with the awards (per design-direction.md). */
export const WHY_BERNADETTE_CREDIBILITY_LIST = [
  {
    headline: "Educator of the Year 2026 Nominee",
    sub: "Beauty & Aesthetics Awards",
  },
  {
    headline: "Best Non-Surgical Aesthetics Clinic 2026 (Essex)",
    sub: "Health, Beauty & Wellness Awards · Founder, Visage Aesthetics",
  },
  {
    headline:
      "RN, Independent Nurse Prescriber, MSc Advanced Practice (Level 7)",
    sub: "Level 7 Aesthetics · NMC Registered · Royal College of Nursing",
  },
  {
    headline: "20+ years clinical, 12 years in aesthetics",
    sub: "Acute medical, community nursing, advanced practice, aesthetics",
  },
  {
    headline: "Featured in Cosmopolitan magazine",
    sub: "Recognised for shaping UK aesthetics standards",
  },
] as const;

/**
 * Trade marks used across the site. Apply on first reference per page.
 */
export const MARKS = {
  /** Registered (per Q12) */
  aestheticsUnlocked: "Aesthetics Unlocked®",
  /** Unregistered common-law marks (per Q12) */
  fromRegToRep: "From Regulation to Reputation™",
  ragPathway: "The RAG Pathway™",
  fiveKFormula: "The 5K+ Formula™",
  unlockProfit: "The UNLOCK PROFIT™ Framework",
} as const;

/**
 * JSON-LD `award` array for Person schema. Bake into About page Schema block.
 */
export const PERSON_AWARDS_JSONLD = AWARDS.map((a) => a.long);

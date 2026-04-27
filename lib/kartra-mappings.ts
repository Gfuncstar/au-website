/**
 * lib/kartra-mappings.ts
 *
 * Maps each AU course slug to its Kartra list + tag IDs.
 *
 * Pulled from Bernadette's Kartra dashboard. Some entries are marked
 * `// TODO: confirm` where the dashboard had ambiguous candidates —
 * Bernadette must verify these before launch so the right Kartra
 * automation sequences fire.
 *
 * Why this lives in code rather than the DB:
 *   - These IDs change so rarely that a code change is appropriate
 *   - Code is type-checked + reviewed before deploy
 *   - Adding a new course means adding a new entry here, which is
 *     a natural step alongside adding the course in lib/courses.ts
 */

export type CourseKartraMapping = {
  /** Kartra list ID to add the lead to on opt-in. */
  optInListId?: string;
  /** Kartra tag ID to apply on opt-in (free tasters). */
  optInTagId?: string;
  /** Kartra list ID to add the lead to after purchase. */
  purchaseListId?: string;
  /** Kartra tag ID to apply after a successful Stripe payment. */
  purchaseTagId?: string;
  /** Kartra tag ID to apply when a Stripe checkout is abandoned. */
  abandonedCartTagId?: string;
  /** Kartra tag ID to apply when the student finishes the course. */
  completedTagId?: string;
  /** Kartra tag ID to apply when the student is enrolled (post-purchase, in members area). */
  enrolledTagId?: string;
};

/* ============================================================
   ID lookup tables — short for readability.
   ============================================================ */

const LISTS = {
  free2DayTaster: "281",
  acneDecoded: "282",
  rosaceaBuyers: "295",
  ragPathway: "293",
  ragWaitlist: "231",
  twelveWeekProgram: "294",
  fiveKWaitlist: "229",
  fiveK: "230",
  fiveKPrelaunchTrigger: "291",
  profitShift: "283",
} as const;

const TAGS = {
  // Free tasters
  taster2DayOptedIn: "1032",
  taster2DayComplete: "1015",
  fiveKPrelaunchStart: "988",
  clarityToCashOptedIn: "1038",

  // Acne Decoded (£79)
  acneDecodedPurchased: "1030",
  acneDecodedAbandoned: "1025",
  acneDecodedEnrolled: "1021",
  acneDecodedComplete: "1022",

  // Rosacea (£79)
  rosaceaPurchased: "1023",
  rosaceaAbandoned: "1024",
  rosaceaEnrolled: "1036",
  rosaceaComplete: "1034",

  // RAG Pathway (waitlist → paid)
  ragPathwayOptedIn: "1035",
  ragPathwayPurchased: "1028",
  ragPathwayAbandoned: "1029",
  ragPathwayEnrolled: "1017",
  ragPathwayComplete: "1018",

  // 5K Formula / 12-week (waitlist → paid)
  twelveWeekPurchased: "1033",
  twelveWeekEnrolled: "1019",
  twelveWeekComplete: "1020",
  fiveKAbandoned: "1026",
} as const;

/* ============================================================
   Course → Kartra mapping.
   ============================================================ */

export const COURSE_KARTRA: Record<string, CourseKartraMapping> = {
  // ──────────────────────────────────────────────────────────
  // FREE TASTERS — opt-in only, no purchase flow
  // ──────────────────────────────────────────────────────────
  "free-2-day-rag": {
    optInListId: LISTS.free2DayTaster,
    optInTagId: TAGS.taster2DayOptedIn,
    completedTagId: TAGS.taster2DayComplete,
  },
  "free-3-day-startup": {
    // TODO: confirm — using the 5K Formula Prelaunch list + tag.
    // Alternative: list "230" (The 5K Formula) + tag "1038" (Clarity
    // To Cash Opted In) if the 3-Day Mini funnel feeds the prelaunch
    // sequence rather than the standalone Clarity to Cash funnel.
    optInListId: LISTS.fiveKPrelaunchTrigger,
    optInTagId: TAGS.fiveKPrelaunchStart,
  },

  // ──────────────────────────────────────────────────────────
  // PAID SELF-PACED — Stripe webhook fires the purchase tag
  // ──────────────────────────────────────────────────────────
  "acne-decoded": {
    purchaseListId: LISTS.acneDecoded,
    purchaseTagId: TAGS.acneDecodedPurchased,
    abandonedCartTagId: TAGS.acneDecodedAbandoned,
    enrolledTagId: TAGS.acneDecodedEnrolled,
    completedTagId: TAGS.acneDecodedComplete,
  },
  "rosacea-beyond-redness": {
    purchaseListId: LISTS.rosaceaBuyers,
    purchaseTagId: TAGS.rosaceaPurchased,
    abandonedCartTagId: TAGS.rosaceaAbandoned,
    enrolledTagId: TAGS.rosaceaEnrolled,
    completedTagId: TAGS.rosaceaComplete,
  },

  // ──────────────────────────────────────────────────────────
  // WAITLIST — opt-in now, purchase later
  // ──────────────────────────────────────────────────────────
  "rag-pathway": {
    // TODO: confirm — RAG Waitlist list (231) for opt-in, RAG Pathway
    // list (293) for active enrolment.
    optInListId: LISTS.ragWaitlist,
    optInTagId: TAGS.ragPathwayOptedIn,
    purchaseListId: LISTS.ragPathway,
    purchaseTagId: TAGS.ragPathwayPurchased,
    abandonedCartTagId: TAGS.ragPathwayAbandoned,
    enrolledTagId: TAGS.ragPathwayEnrolled,
    completedTagId: TAGS.ragPathwayComplete,
  },
  "5k-formula": {
    // TODO: confirm — 5K Waitlist (229) for opt-in. No "5K Waitlist
    // Opted In" tag exists in the dashboard; recommend Bernadette
    // create one. For now using fiveKPrelaunchStart (988) as the
    // closest existing match.
    optInListId: LISTS.fiveKWaitlist,
    optInTagId: TAGS.fiveKPrelaunchStart,
    // The 12-week program list/tags pick up after purchase
    purchaseListId: LISTS.twelveWeekProgram,
    purchaseTagId: TAGS.twelveWeekPurchased,
    abandonedCartTagId: TAGS.fiveKAbandoned,
    enrolledTagId: TAGS.twelveWeekEnrolled,
    completedTagId: TAGS.twelveWeekComplete,
  },
};

/** Lookup helper. Returns `undefined` if a slug isn't mapped yet. */
export function getKartraMapping(
  courseSlug: string,
): CourseKartraMapping | undefined {
  return COURSE_KARTRA[courseSlug];
}

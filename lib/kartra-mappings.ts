/**
 * lib/kartra-mappings.ts
 *
 * Maps each AU course slug to its Kartra list + tag NAMES.
 *
 * IMPORTANT: Kartra's Inbound API expects list/tag NAMES, not IDs
 * (verified empirically — list_id and tag_id are silently ignored,
 * only list_name and tag_name take effect). The IDs Bernadette
 * pulled from her dashboard aren't usable here; what we need are
 * the human-readable names exactly as they appear in Kartra.
 *
 * If Bernadette renames a list or tag in Kartra, update the matching
 * string here too — otherwise opt-ins will silently fail to apply
 * the right Kartra automation.
 *
 * Some entries are marked `// TODO: confirm` where the original
 * dashboard had ambiguous candidates — Bernadette must verify these
 * before launch so the right Kartra automation sequences fire.
 */

export type CourseKartraMapping = {
  /** Kartra list NAME to subscribe the lead to on opt-in. */
  optInListName?: string;
  /** Kartra tag NAME to apply on opt-in (free tasters). */
  optInTagName?: string;
  /** Kartra list NAME for post-purchase customers. */
  purchaseListName?: string;
  /** Kartra tag NAME applied after a successful Stripe payment. */
  purchaseTagName?: string;
  /** Kartra tag NAME for an abandoned Stripe checkout. */
  abandonedCartTagName?: string;
  /** Kartra tag NAME for an enrolled student (post-purchase, in members area). */
  enrolledTagName?: string;
  /** Kartra tag NAME for course completion. */
  completedTagName?: string;
};

/* ============================================================
   Course → Kartra mapping. Names come straight from the
   Bernadette dashboard listing she sent.
   ============================================================ */

export const COURSE_KARTRA: Record<string, CourseKartraMapping> = {
  // ──────────────────────────────────────────────────────────
  // FREE TASTERS — opt-in only, no purchase flow
  // ──────────────────────────────────────────────────────────
  "free-2-day-rag": {
    optInListName: "Free 2-Day Taster",
    optInTagName: "Taster 2Day Opted In",
    completedTagName: "Taster 2Day Complete",
  },
  "free-3-day-startup": {
    // TODO: confirm — using the 5K Formula Prelaunch list + tag.
    // Alternative: list "The 5K Formula" + tag "Clarity To Cash
    // Opted In" if the 3-Day Mini funnel feeds the prelaunch
    // sequence rather than the standalone Clarity to Cash funnel.
    optInListName: "5K Formula Prelaunch Trigger",
    optInTagName: "5K_Prelaunch_Start",
  },

  // ──────────────────────────────────────────────────────────
  // PAID SELF-PACED — Stripe webhook fires the purchase tag
  // ──────────────────────────────────────────────────────────
  "acne-decoded": {
    purchaseListName: "ACNE DECODED",
    purchaseTagName: "Acne Decoded Purchased",
    abandonedCartTagName: "Acne Decoded Abandoned Cart",
    enrolledTagName: "Acne Decoded Enrolled",
    completedTagName: "Acne Decoded Complete",
  },
  "rosacea-beyond-redness": {
    purchaseListName: "Rosacea Beyond Redness Buyers",
    purchaseTagName: "Rosacea Purchased",
    abandonedCartTagName: "Rosacea Abandoned Cart",
    enrolledTagName: "Rosacea Enrolled",
    completedTagName: "Rosacea Complete",
  },

  // ──────────────────────────────────────────────────────────
  // WAITLIST — opt-in now, purchase later
  // ──────────────────────────────────────────────────────────
  "rag-pathway": {
    // TODO: confirm — RAG Waitlist list for opt-in vs RAG Pathway
    // list for active enrolment.
    optInListName: "From Regulation to Reputation™ Waitlist",
    optInTagName: "RAG Pathway Opted In",
    purchaseListName: "RAG Pathway",
    purchaseTagName: "RAG Pathway Purchased",
    abandonedCartTagName: "RAG Pathway Abandoned Cart",
    enrolledTagName: "RAG Pathway Enrolled",
    completedTagName: "RAG Pathway Complete",
  },
  "5k-formula": {
    // TODO: confirm — 5K Waitlist for opt-in. There's no obvious
    // "5K Waitlist Opted In" tag in the dashboard; using the
    // 5K_Prelaunch_Start tag as the closest existing match.
    // Recommend Bernadette create a "5K Waitlist Opted In" tag.
    optInListName: "The 5K Formula Waitlist",
    optInTagName: "5K_Prelaunch_Start",
    purchaseListName: "12-Week Business Program",
    purchaseTagName: "12 Week Purchased",
    abandonedCartTagName: "5K Formula Abandoned Cart",
    enrolledTagName: "12 Week Enrolled",
    completedTagName: "12 Week Complete",
  },
};

/** Lookup helper. Returns `undefined` if a slug isn't mapped yet. */
export function getKartraMapping(
  courseSlug: string,
): CourseKartraMapping | undefined {
  return COURSE_KARTRA[courseSlug];
}

/**
 * lib/kartra-mappings.ts
 *
 * Maps each AU course slug to its Kartra list + tag NAMES.
 *
 * IMPORTANT: Kartra's Inbound API expects list/tag NAMES, not IDs
 * (verified empirically: list_id and tag_id are silently ignored,
 * only list_name and tag_name take effect). The IDs Bernadette
 * pulled from her dashboard aren't usable here; what we need are
 * the human-readable names exactly as they appear in Kartra.
 *
 * If Bernadette renames a list or tag in Kartra, update the matching
 * string here too, otherwise opt-ins will silently fail to apply
 * the right Kartra automation.
 *
 * All entries verified against Bernadette's Kartra dashboard on
 * 2026-04-30. Every list and tag below exists in her account with
 * the exact name shown.
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
    optInListName: "5K Formula Prelaunch Trigger",
    optInTagName: "5K_Prelaunch_Start",
  },
  "free-acne-decoded": {
    optInListName: "Acne Decoded Mini",
    optInTagName: "Acne Mini Opted In",
    completedTagName: "Acne Mini Complete",
  },
  "free-rosacea-beyond-redness": {
    optInListName: "Rosacea Beyond Redness Mini",
    optInTagName: "Rosacea Mini Opted In",
    completedTagName: "Rosacea Mini Complete",
  },
  "free-clinical-audit": {
    optInListName: "England Aesthetic Compliance Audit",
    optInTagName: "Compliance Audit Opted In",
    completedTagName: "Compliance Audit Complete",
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
  "skin-specialist-programme": {
    purchaseListName: "Skin Specialist Programme Buyers",
    purchaseTagName: "Skin Specialist Purchased",
    abandonedCartTagName: "Skin Specialist Abandoned Cart",
    enrolledTagName: "Skin Specialist Enrolled",
    completedTagName: "Skin Specialist Complete",
  },
  "free-skin-specialist-mini": {
    optInListName: "The Skin Specialist Mini",
    optInTagName: "Skin Specialist Mini Opted In",
    completedTagName: "Skin Specialist Mini Complete",
  },

  // ──────────────────────────────────────────────────────────
  // WAITLIST — opt-in now, purchase later
  // ──────────────────────────────────────────────────────────
  "rag-pathway": {
    optInListName: "From Regulation to Reputation™ Waitlist",
    optInTagName: "RAG Pathway Opted In",
    purchaseListName: "RAG Pathway",
    purchaseTagName: "RAG Pathway Purchased",
    abandonedCartTagName: "RAG Pathway Abandoned Cart",
    enrolledTagName: "RAG Pathway Enrolled",
    completedTagName: "RAG Pathway Complete",
  },
  "5k-formula": {
    optInListName: "The 5K Formula Waitlist",
    // Dedicated waitlist tag, distinct from the 3-Day Mini's
    // 5K_Prelaunch_Start tag, so the two funnels can fire their
    // own nurture sequences without colliding.
    optInTagName: "5K Waitlist Opted In",
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

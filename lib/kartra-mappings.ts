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
  "free-acne-decoded": {
    // TODO: confirm with Bernadette — needs a dedicated Kartra list
    // ("Acne Decoded Mini") and a tag ("Acne Mini Opted In") created
    // before launch. The opt-in should drop the lead into a 7–10
    // email nurture sequence pointing to the paid Acne Decoded course.
    optInListName: "Acne Decoded Mini",
    optInTagName: "Acne Mini Opted In",
    completedTagName: "Acne Mini Complete",
  },
  "free-rosacea-beyond-redness": {
    // TODO: confirm with Bernadette — needs a dedicated Kartra list
    // ("Rosacea Beyond Redness Mini") and a tag ("Rosacea Mini Opted In")
    // created before launch. The opt-in should drop the lead into a
    // 7–10 email nurture sequence pointing to the paid Rosacea course.
    optInListName: "Rosacea Beyond Redness Mini",
    optInTagName: "Rosacea Mini Opted In",
    completedTagName: "Rosacea Mini Complete",
  },
  "free-clinical-audit": {
    // TODO: confirm with Bernadette — needs a dedicated Kartra list
    // ("England Aesthetic Compliance Audit") and a tag ("Compliance
    // Audit Opted In") created before launch. The opt-in should drop
    // the lead into a nurture sequence pointing to the paid RAG
    // Pathway, since the audit IS the gap-analysis tool that the
    // Pathway exists to close.
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
    // TODO: confirm with Bernadette — these names need to be created
    // in Kartra before launch. Recommend matching the existing
    // condition-decoder naming convention so automation patterns
    // stay consistent.
    purchaseListName: "Skin Specialist Programme Buyers",
    purchaseTagName: "Skin Specialist Purchased",
    abandonedCartTagName: "Skin Specialist Abandoned Cart",
    enrolledTagName: "Skin Specialist Enrolled",
    completedTagName: "Skin Specialist Complete",
  },
  "free-skin-specialist-mini": {
    // TODO: confirm with Bernadette — needs a dedicated Kartra list
    // ("The Skin Specialist Mini") and tag ("Skin Specialist Mini
    // Opted In") created before launch. The opt-in should drop the
    // lead into a 7–10 email nurture sequence pointing to the paid
    // Skin Specialist Programme.
    optInListName: "The Skin Specialist Mini",
    optInTagName: "Skin Specialist Mini Opted In",
    completedTagName: "Skin Specialist Mini Complete",
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

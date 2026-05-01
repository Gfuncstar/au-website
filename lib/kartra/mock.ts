/**
 * lib/kartra/mock.ts
 *
 * Realistic fixture for one Aesthetics Unlocked member: Sarah Bennett —
 * a UK aesthetic practitioner who runs her own clinic, has bought two
 * paid courses, completed the free RAG taster, and is on the 5K+
 * Formula waitlist.
 *
 * The fixture intentionally exercises EVERY field the dashboard renders
 * so the UI shows what's possible end-to-end. Replace this with real
 * `kartra.getLead()` output once API credentials are provisioned.
 */

import type { Lead } from "./types";

export const MOCK_LEAD: Lead = {
  /* ============================================================
     Profile
     ============================================================ */
  id: "39260",
  email: "sarah@bennettaesthetics.co.uk",
  first_name: "Sarah",
  last_name: "Bennett",
  phone: "7700 900219",
  phone_country_code: "+44",
  address: "12 Marlborough Court",
  city: "Brentwood",
  state: "Essex",
  zip: "CM14 4DE",
  country: "United Kingdom",
  lead_picture: undefined, // initials avatar
  date_joined: "2025-08-14T11:42:00Z",
  lead_preferred_time_zone: "Europe/London",
  website: "https://bennettaesthetics.co.uk",
  company: "Bennett Aesthetics Clinic",
  facebook: undefined,
  twitter: undefined,
  linkedin: "https://linkedin.com/in/sarahbennett",
  ip: "82.34.12.198",
  ip_country: "GB",

  /* Engagement */
  score: 78,
  source: "Free 2-Day RAG Mini opt-in",
  notes: undefined,

  /* GDPR */
  gdpr_lead_status: "consented",
  gdpr_lead_communications: true,
  gdpr_lead_status_date: "2025-08-14T11:42:00Z",

  /* ============================================================
     Tags — segmentation visible to the user as small badges
     ============================================================ */
  tags: [
    { tag_name: "Founding Member", assigned_at: "2025-08-14T11:42:00Z" },
    { tag_name: "Acne Decoded · Grad", assigned_at: "2025-11-02T16:08:00Z" },
    { tag_name: "Rosacea · Active", assigned_at: "2026-01-19T09:15:00Z" },
    { tag_name: "RAG Mini · Completed", assigned_at: "2025-09-01T18:22:00Z" },
    { tag_name: "5K+ Formula · Waitlist", assigned_at: "2026-02-14T08:11:00Z" },
    { tag_name: "Visage Reader", assigned_at: "2025-10-04T12:00:00Z" },
  ],

  /* ============================================================
     Lists — drives the comms-prefs panel
     ============================================================ */
  lists: [
    {
      list_name: "AU Weekly — practitioner edition",
      active: true,
      subscribed_at: "2025-08-14T11:42:00Z",
    },
    {
      list_name: "New course launches",
      active: true,
      subscribed_at: "2025-08-14T11:42:00Z",
    },
    {
      list_name: "RAG Pathway updates",
      active: true,
      subscribed_at: "2025-09-01T18:22:00Z",
    },
    {
      list_name: "Promotional offers",
      active: false,
      subscribed_at: "2025-08-14T11:42:00Z",
    },
  ],

  /* ============================================================
     Sequences — drives the "you're on Day X of Y" copy
     ============================================================ */
  sequences: [
    {
      sequence_name: "From Regulation to Reputation™ Mini · 2-day",
      step: 2,
      total_steps: 2,
      status: "completed",
    },
    {
      sequence_name: "Acne Decoded · post-purchase nurture",
      step: 4,
      total_steps: 6,
      status: "active",
      next_email_at: "2026-04-30T09:00:00Z",
    },
    {
      sequence_name: "Rosacea Beyond Redness · onboarding",
      step: 2,
      total_steps: 5,
      status: "active",
      next_email_at: "2026-04-29T09:00:00Z",
    },
    {
      sequence_name: "5K+ Formula · waitlist warm-up",
      step: 3,
      total_steps: 8,
      status: "active",
      next_email_at: "2026-05-02T08:00:00Z",
    },
  ],

  /* ============================================================
     Memberships — the entitlements view
     ============================================================ */
  memberships: [
    {
      membership_id: "M_acne_decoded",
      membership_name: "Acne Decoded",
      level_id: "L_full",
      level_name: "Full Access",
      active: true,
      granted_at: "2025-11-02T16:08:00Z",
    },
    {
      membership_id: "M_rosacea_beyond_redness",
      membership_name: "Rosacea Beyond Redness",
      level_id: "L_full",
      level_name: "Full Access",
      active: true,
      granted_at: "2026-01-19T09:15:00Z",
    },
    {
      membership_id: "M_rag_mini",
      membership_name: "From Regulation to Reputation™ Mini",
      level_id: "L_free",
      level_name: "Free Taster",
      active: true,
      granted_at: "2025-08-14T11:42:00Z",
    },
  ],

  /* ============================================================
     Custom fields — practitioner-specific data Bernadette captures
     ============================================================ */
  custom_fields: [
    {
      field_id: "cf_clinic_stage",
      field_identifier: "clinic_stage",
      field_label: "Clinic stage",
      field_type: "select",
      field_value: "Established (3+ years)",
      field_options: [
        "Pre-launch",
        "Year 1",
        "Year 2",
        "Established (3+ years)",
        "Multi-site",
      ],
    },
    {
      field_id: "cf_specialism",
      field_identifier: "specialism",
      field_label: "Primary specialism",
      field_type: "select",
      field_value: "Skin (medical-grade)",
      field_options: [
        "Skin (medical-grade)",
        "Injectables",
        "Body & contouring",
        "Generalist",
      ],
    },
    {
      field_id: "cf_focus_areas",
      field_identifier: "focus_areas",
      field_label: "Clinical focus areas",
      field_type: "checkbox",
      field_value: ["Acne", "Rosacea", "Pigmentation"],
      field_options: [
        "Acne",
        "Rosacea",
        "Pigmentation",
        "Anti-ageing",
        "Scarring",
        "Aesthetic procedures",
      ],
    },
    {
      field_id: "cf_practitioner_reg",
      field_identifier: "practitioner_reg",
      field_label: "Practitioner registration",
      field_type: "text",
      field_value: "NMC 87FE2031",
    },
    {
      field_id: "cf_msc",
      field_identifier: "msc",
      field_label: "Postgraduate qualifications",
      field_type: "text",
      field_value: "MSc Advanced Practice (in progress)",
    },
    {
      field_id: "cf_years_active",
      field_identifier: "years_active",
      field_label: "Years in aesthetics",
      field_type: "number",
      field_value: 4,
    },
    {
      field_id: "cf_jccp",
      field_identifier: "jccp_registered",
      field_label: "JCCP registered",
      field_type: "checkbox",
      field_value: ["Yes"],
      field_options: ["Yes", "No", "In progress"],
    },
    {
      field_id: "cf_bio",
      field_identifier: "short_bio",
      field_label: "Short clinic bio",
      field_type: "textarea",
      field_value:
        "RGN-led aesthetic clinic in Brentwood — medical-grade skin, evidence-based protocols, NICE-aligned acne pathway.",
    },
  ],

  /* ============================================================
     Transactions — full billing history.
     AU model is single-payment-per-course (no subscriptions, no
     rebills, no recurring). Each row is a one-time purchase.
     ============================================================ */
  transactions: [
    {
      id: "T_2026_01_19_rosacea",
      product_name: "Rosacea Beyond Redness",
      transaction_type: "sale",
      amount_cents: 15000,
      currency: "GBP",
      status: "success",
      occurred_at: "2026-01-19T09:15:00Z",
      processor_reference: "ch_3NkQp2…",
    },
    {
      id: "T_2025_11_02_acne",
      product_name: "Acne Decoded",
      transaction_type: "sale",
      amount_cents: 7900,
      currency: "GBP",
      status: "success",
      occurred_at: "2025-11-02T16:08:00Z",
      processor_reference: "ch_3MwLn1…",
    },
    {
      id: "T_2025_10_22_book",
      product_name: "Regulation to Reputation (book) — signed copy",
      transaction_type: "sale",
      amount_cents: 1800,
      currency: "GBP",
      status: "success",
      occurred_at: "2025-10-22T14:30:00Z",
    },
    {
      id: "T_2025_10_22_book_refund",
      product_name: "Regulation to Reputation (book) — duplicate order refund",
      transaction_type: "refund",
      amount_cents: -1800,
      currency: "GBP",
      status: "refunded",
      occurred_at: "2025-10-23T10:11:00Z",
    },
  ],

  /* ============================================================
     Recurring subscriptions — empty for AU. Single-payment model
     means no rebills. Type kept on Lead in case Kartra surfaces
     a sub for an unrelated product in future.
     ============================================================ */
  recurring_subscriptions: [],

  /* ============================================================
     Calendar bookings — empty for the demo so the UI shows the
     "nothing booked" empty state. Add items in the same shape as
     the (commented-out) examples below when wiring real data.
     ============================================================ */
  calendar_bookings: [],

  /* ============================================================
     Surveys / quizzes
     ============================================================ */
  surveys: [
    {
      survey_id: "Q_clinical_identity",
      survey_name: "Clinical Identity Quiz",
      completed_at: "2025-08-15T20:11:00Z",
      score: 76,
      max_score: 100,
      highlights: [
        {
          question: "Which framework best describes your current niche?",
          answer: "Medical skin (acne, rosacea, pigmentation)",
        },
        {
          question: "How clearly can you articulate your offer in one line?",
          answer: "Pretty clear — 4/5",
        },
      ],
    },
    {
      survey_id: "Q_rag_self_audit",
      survey_name: "RAG Self-Audit · regulation readiness",
      completed_at: "2025-09-01T18:30:00Z",
      score: 82,
      max_score: 100,
      highlights: [
        {
          question: "Documentation against MHRA scope of practice?",
          answer: "In place — last reviewed 6 months ago",
        },
        {
          question: "ASA-compliant marketing copy on website?",
          answer: "Mostly compliant; needs the prescription-only language audit",
        },
      ],
    },
  ],
};

/** Convenience helper for the dashboard pages. */
export function getMockLead(): Lead {
  return MOCK_LEAD;
}

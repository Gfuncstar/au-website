/**
 * lib/kartra/types.ts
 *
 * TypeScript shapes for everything Kartra's Inbound API + IPN exposes.
 * Built from documentation captured 2026-04-28 — see kartra-api.md in
 * the clone-aesthetics-unlocked foundation folder for the canonical spec.
 *
 * The dashboard reads these shapes from `kartra.getLead(email)` (cached
 * 60s server-side) and renders the entire surface area defined here.
 */

export type GdprStatus = "consented" | "withdrawn" | "pending" | "unknown";

export type LeadCustomFieldValue =
  | string
  | number
  | boolean
  | string[]
  | null;

export interface LeadCustomField {
  field_id: string;
  field_identifier: string;
  field_label: string;
  field_type: "text" | "number" | "select" | "checkbox" | "textarea" | "date";
  field_value: LeadCustomFieldValue;
  field_options?: string[];
}

export interface LeadTag {
  tag_name: string;
  assigned_at?: string;
}

export interface LeadList {
  list_name: string;
  active: boolean;
  subscribed_at?: string;
}

export interface LeadSequence {
  sequence_name: string;
  step: number;
  total_steps: number;
  status: "active" | "paused" | "completed";
  next_email_at?: string;
}

export interface LeadMembership {
  membership_id: string;
  membership_name: string;
  level_id?: string;
  level_name: string;
  active: boolean;
  granted_at: string;
  revoked_at?: string;
}

export type TransactionType = "sale" | "refund" | "rebill" | "chargeback";
export type TransactionStatus = "success" | "failed" | "refunded";

export interface LeadTransaction {
  id: string;
  product_name: string;
  transaction_type: TransactionType;
  amount_cents: number;
  currency: "GBP" | "USD" | "EUR";
  status: TransactionStatus;
  occurred_at: string;
  processor_reference?: string;
}

export type SubscriptionStatus = "active" | "paused" | "cancelled" | "failed";

export interface LeadRecurringSubscription {
  subscription_id: string;
  product_name: string;
  amount_cents: number;
  currency: "GBP" | "USD" | "EUR";
  frequency: "weekly" | "monthly" | "quarterly" | "annual";
  status: SubscriptionStatus;
  started_at: string;
  next_rebill_at?: string;
  cancelled_at?: string;
}

export interface LeadCalendarBooking {
  booking_id: string;
  calendar_name: string;
  host_name: string;
  event_name: string;
  starts_at: string;
  ends_at: string;
  location: "zoom" | "phone" | "in_person";
  meeting_url?: string;
}

export interface LeadSurveyResponse {
  survey_id: string;
  survey_name: string;
  completed_at: string;
  score?: number;
  max_score?: number;
  highlights: { question: string; answer: string }[];
}

export interface Lead {
  /* Profile */
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  phone_country_code?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  lead_picture?: string;
  date_joined: string;
  lead_preferred_time_zone?: string;
  website?: string;
  company?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  ip?: string;
  ip_country?: string;

  /* Engagement */
  score: number;
  source?: string;
  notes?: string;

  /* GDPR */
  gdpr_lead_status: GdprStatus;
  gdpr_lead_communications: boolean;
  gdpr_lead_status_date?: string;

  /* Associated data */
  tags: LeadTag[];
  lists: LeadList[];
  sequences: LeadSequence[];
  memberships: LeadMembership[];
  custom_fields: LeadCustomField[];
  transactions: LeadTransaction[];
  recurring_subscriptions: LeadRecurringSubscription[];
  calendar_bookings: LeadCalendarBooking[];
  surveys: LeadSurveyResponse[];
}

export interface KartraResponse<T> {
  status: "Success" | "Error";
  message: string;
  type: number;
  data?: T;
}

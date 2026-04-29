/**
 * lib/owner-emails.ts
 *
 * Single source of truth for the platform-owner email allowlist.
 *
 * Imported by:
 *   - lib/entitlements.ts     — bypasses the per-course memberships
 *                                check so owners can read any lesson.
 *   - lib/kartra/client.ts    — synthesises a full-catalogue membership
 *                                list so the members dashboard surfaces
 *                                every course (paid + waitlist + free)
 *                                without needing rows in the Supabase
 *                                memberships table.
 *
 * Owner emails get the platform as if they bought every course. This is
 * the right behaviour for Giles and Bernadette — they need to preview,
 * QA, demo, and walk students through every piece of content.
 *
 * To add an owner: append the lowercase email to the array below,
 * commit, push. Vercel auto-deploys; the new owner sees the full
 * catalogue on their next page load.
 */

export const OWNER_EMAILS: readonly string[] = [
  "giles@hieb.co.uk",
  "ber.parsons@outlook.com",
];

/** Case-insensitive check. Always lowercase the input before comparing. */
export function isOwnerEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return OWNER_EMAILS.includes(email.toLowerCase());
}

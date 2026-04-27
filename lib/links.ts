/**
 * lib/links.ts
 *
 * SINGLE SOURCE OF TRUTH for every external link and CTA destination on
 * the AU site. When Bernadette provides the real Kartra opt-in / checkout
 * / waitlist URLs, swap them in HERE — every CTA across the site updates
 * in one edit.
 *
 * Sourced from:
 * - lib/credentials.ts (BRAND.membersDomain, BRAND.email, Instagram)
 * - The book is on Amazon UK
 * - Kartra URLs: PENDING from Bernadette
 *
 * RULE: never hardcode an external URL inline in a page or component.
 * Add it here, name it, import it.
 *
 * Per-course Kartra URLs live on each course in lib/courses.ts (see the
 * `kartraUrl` field), since each course has its own opt-in / checkout.
 */

import { BRAND } from "./credentials";

/**
 * Kartra placeholder convention. Anything starting with `#TODO_KARTRA_`
 * is a placeholder — Bernadette must supply the real URL before launch.
 * The site renders these as anchor links so they don't 404; they just
 * scroll to the top of the current page.
 *
 * Search the codebase for `TODO_KARTRA_` to find every unfilled CTA.
 */
const TODO_KARTRA = (label: string) => `#TODO_KARTRA_${label}`;

/* ============================================================
   GLOBAL EXTERNAL LINKS — referenced by Nav, Footer, multiple pages.
   ============================================================ */

/** Members area (Kartra). DNS-mapped subdomain — final landing TBD by
 *  Bernadette. Currently points at the AU members subdomain placeholder. */
export const MEMBERS_URL = `https://${BRAND.membersDomain}`;

/** Contact destination. Until a Kartra-embedded form is wired, this is
 *  the AU brand inbox. */
export const CONTACT_EMAIL_URL = `mailto:${BRAND.email}`;

/** Optional Kartra-hosted contact form. PLACEHOLDER. If the contact page
 *  swaps from email-only to a hosted form, set this and update
 *  app/contact/page.tsx. */
export const CONTACT_FORM_URL = TODO_KARTRA("contact_form");

/** Bernadette's book on Amazon UK. */
export const BOOK_AMAZON_URL =
  "https://www.amazon.co.uk/Regulation-Reputation-mastering-successful-aesthetic/dp/B0FWX5RN5T/";

/** Social — Instagram. Confirmed handle: @aestheticsunlocked. */
export const INSTAGRAM_URL = "https://www.instagram.com/aestheticsunlocked/";

/* ============================================================
   REGULATOR LINKS — verifiable third parties. NOT placeholders;
   safe to leave linked permanently.
   ============================================================ */

/** NMC public register search — used to verify Bernadette's RN status. */
export const NMC_REGISTER_URL =
  "https://www.nmc.org.uk/registration/search-the-register/";

/* ============================================================
   PER-COURSE KARTRA URLS — see lib/courses.ts. Each course has its
   own `kartraUrl` field because every course has a different Kartra
   opt-in form, checkout page, or waitlist landing.
   ============================================================ */

/**
 * Default Kartra placeholder URL for a course slug. Used by lib/courses.ts
 * as the fallback so the type stays required while still being replaceable.
 */
export const courseKartraPlaceholder = (slug: string): string =>
  TODO_KARTRA(`course_${slug.replace(/-/g, "_")}`);

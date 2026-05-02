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

/** Members area (Kartra). DNS-mapped subdomain — kept here for reference
 *  / fallback only. Customer-facing "Members" / "Log in" CTAs use the
 *  internal LOGIN_URL below now that AU has its own on-brand login page. */
export const MEMBERS_URL = `https://${BRAND.membersDomain}`;

/** Internal members login page. All customer-facing "Members" / "Log in"
 *  CTAs route here. The /login page itself authenticates via Kartra
 *  (server-side `kartra.searchLead` + magic link) before routing into
 *  the on-brand /members dashboard. */
export const LOGIN_URL = "/login";

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

/* ============================================================
   COURSE ASSET FOLDERS — Dropbox source folders Bernadette drops
   raw materials (videos, photos, slides, PDFs) into. The site
   reads finished assets from /public, but the source-of-truth
   lives in these Dropbox folders so the team has one canonical
   place per course.
   ============================================================ */

/** Hyperpigmentation Decoded asset source folder. Hard-coded per Giles
 *  on 2026-05-02. Bernadette drops raw lesson materials here, which
 *  are then exported and committed into /public on the site. */
export const HYPERPIGMENTATION_DECODED_ASSETS_URL =
  "https://www.dropbox.com/scl/fo/o1v4m95kn55h9p2ypab53/AEckzVhtVba-1Cmz2B6XRic?rlkey=ti1enwi6qhp26ewd05rsgjrxk&dl=0";

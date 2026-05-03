/**
 * Nav — top nav with educational mobile drawer.
 *
 * Two visual states:
 *  - "dark" (default at top of page) — transparent, white logo / text
 *  - "light" (after scrolling past hero) — solid white, colour logo
 *
 * State flips when the user scrolls past ~80% of the first viewport height.
 * Pages without a dark hero pass `forceLight` to skip the dark state.
 *
 * Mobile drawer rebuilt per Giles' "burger menu needs to convey the depth
 * of pages, very educational, people need to see at a glance the scale of
 * learning" call. The drawer now lists:
 *   - Every course with category + format + price (grows with the catalogue)
 *   - The About page
 *   - The /standards index (8 regulators AU teaches against)
 *   - Contact
 *   - Members portal (external)
 *   - Bernadette's credential strip at the foot
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BRAND, FOUNDER } from "@/lib/credentials";
import { COURSES } from "@/lib/courses";
import { LOGIN_URL, NMC_REGISTER_URL, BOOK_AMAZON_URL } from "@/lib/links";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  CoursesIcon,
  MembersAreaIcon,
  PersonIcon,
  ShieldIcon,
  InsightsIcon,
  MailIcon,
  QuoteIcon,
  CourseRowIcon,
} from "@/components/NavIcons";

/** Visage Aesthetics — Bernadette's award-winning clinic. */
const VISAGE_URL = "https://www.vaclinic.co.uk";

const PRIMARY_LINKS = [
  { href: "/courses", label: "Courses" },
  { href: "/dashboard", label: "Members' area" },
  { href: "/about", label: "About" },
  { href: "/standards", label: "Standards" },
  { href: "/blog", label: "Blog" },
] as const;

type Props = {
  /** Force the light state regardless of scroll position. */
  forceLight?: boolean;
};

export function Nav({ forceLight = false }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Mobile-drawer accordions. Each section starts collapsed every time
  // the drawer opens, so the user lands on a compact, scannable index
  // and chooses what to expand.
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [referencesOpen, setReferencesOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);

  // Auth-aware nav state. Starts unknown (null) so SSR matches the
  // initial client render and avoids a hydration warning. Once the
  // browser Supabase client resolves the session, we flip the CTA
  // from "Members log-in" → "Dashboard" and reveal a "Sign out" link.
  // While unknown, we render the signed-out state (the safer default
  // for visitors who land mid-render).
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setSignedIn(false);
      return;
    }
    let cancelled = false;
    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) setSignedIn(Boolean(data.user));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) setSignedIn(Boolean(session?.user));
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      // Hard redirect so server components re-render with no session.
      window.location.href = "/";
    }
  }

  // When the drawer closes, reset every accordion so the next open is
  // collapsed-by-default.
  useEffect(() => {
    if (!open) {
      setCoursesOpen(false);
      setAboutOpen(false);
      setReferencesOpen(false);
      setInsightsOpen(false);
      setConnectOpen(false);
    }
  }, [open]);

  // Free tasters live alongside paid courses in COURSES — count them so
  // the Courses accordion header can advertise "10 programmes (5 free)".
  const freeCount = COURSES.filter((c) => c.price === undefined).length;

  useEffect(() => {
    if (forceLight) {
      setScrolled(true);
      return;
    }
    const onScroll = () => {
      const threshold = window.innerHeight * 0.8;
      setScrolled(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [forceLight]);

  // While the mobile drawer is open we always want the light state so the
  // open menu reads cleanly.
  const light = scrolled || open;

  // Header background + border. Scrolled state uses AU brand charcoal
  // per Giles' "have this bar in the brand grey on scroll" call. Top
  // of page (over the dark hero) stays transparent.
  const headerBg = light
    ? "bg-au-charcoal/95 backdrop-blur supports-[backdrop-filter]:bg-au-charcoal/85 border-b border-au-white/10"
    : "bg-transparent border-b border-transparent";

  // Link colour — both states are now on a dark surface, so links stay
  // white throughout.
  const linkBase =
    "font-section font-semibold text-[0.8125rem] uppercase tracking-[0.15em] transition-colors";
  const linkColour =
    "text-au-white/90 hover:text-[var(--color-au-pink)]";

  const membersColour =
    "text-au-white/65 hover:text-au-white";

  const barColour = "bg-au-white";

  // Lock body scroll when the drawer is open so it reads as a full panel.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color] duration-300 ${headerBg}`}
    >
      <div className="mx-auto max-w-7xl px-[35px] sm:px-8 md:px-12 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo, pink "aesthetics" + white "unlocked" on dark hero,
            pink + charcoal primary on light scrolled state. Sized
            bigger per Giles' "make this bigger" call. */}
        <Link
          href="/"
          aria-label="Aesthetics Unlocked, home"
          className="flex items-center"
          onClick={() => setOpen(false)}
        >
          {/* Logo always pink-on-dark, header bar is dark in both
              states (transparent over hero, charcoal once scrolled). */}
          <Image
            src="/brand/au-logo-pink-on-dark.png"
            alt="Aesthetics Unlocked"
            width={640}
            height={232}
            priority
            className="h-10 sm:h-12 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-8">
          {PRIMARY_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${linkBase} ${linkColour}`}
            >
              {l.label}
            </Link>
          ))}
          {signedIn ? (
            <>
              <Link
                href="/members"
                className={`text-[0.75rem] uppercase tracking-[0.15em] transition-colors ${membersColour}`}
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className={`text-[0.75rem] uppercase tracking-[0.15em] transition-colors ${membersColour}`}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href={LOGIN_URL}
              className={`text-[0.75rem] uppercase tracking-[0.15em] transition-colors ${membersColour}`}
            >
              Members log-in
            </Link>
          )}
        </nav>

        {/* Mobile auth-status icon — sits to the left of the burger so
            members can see at a glance whether they're signed in. The
            icon itself changes based on session state: a person
            silhouette when signed out (tap → /login), a dashboard glyph
            when signed in (tap → /members). Same line-art language as
            the rest of the nav icons. Same h-12 w-12 tap target as the
            burger so both feel like one row of controls. The signed-in
            state also picks up the AU pink accent so it pops a little
            more, matching the "active" visual treatment used elsewhere. */}
        {/* Mobile right-side cluster: auth icon + burger packed together
            so the icon sits flush next to the burger instead of being
            distributed by the parent's justify-between. */}
        <div className="md:hidden flex items-center gap-2">
        <Link
          href={signedIn ? "/members" : LOGIN_URL}
          aria-label={
            signedIn ? "Go to your dashboard" : "Sign in to your dashboard"
          }
          className="h-10 w-10 flex items-center justify-center z-10 rounded-[3px] border border-[var(--color-au-pink)]/60 text-[var(--color-au-pink)] hover:bg-[var(--color-au-pink)] hover:text-au-charcoal hover:border-[var(--color-au-pink)] transition-colors"
        >
          {signedIn ? (
            // Dashboard glyph — frame with one active (filled) tile.
            // Mirrors components/NavIcons.tsx → MembersAreaIcon so the
            // header icon and the drawer's "Members' area" row share
            // the same visual language.
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="w-5 h-5"
            >
              <rect x="3" y="4" width="18" height="16" rx="0.5" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <rect
                x="6"
                y="12"
                width="5"
                height="5"
                fill="currentColor"
                stroke="currentColor"
              />
              <rect x="13" y="12" width="5" height="5" />
            </svg>
          ) : (
            // Person silhouette — same shape as PersonIcon in NavIcons.
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="w-5 h-5"
            >
              <circle cx="12" cy="9" r="4" />
              <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
          )}
        </Link>

        {/* Mobile menu trigger */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="h-12 w-12 flex flex-col items-center justify-center gap-[5px] -mr-2 z-10"
        >
          <span
            className={`h-[2px] w-7 transition-all ${barColour} ${
              open ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-[2px] w-7 transition-opacity ${barColour} ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-[2px] w-7 transition-all ${barColour} ${
              open ? "-translate-y-[5px] -rotate-45" : ""
            }`}
          />
        </button>
        </div>
      </div>
    </header>

      {/* ============================================================
          MOBILE DRAWER, full-screen panel with course depth surfaced.
          Rendered as a sibling of <header> (not inside it) so the
          header's `backdrop-blur` doesn't establish a containing block
          for this fixed-position drawer, without that, the drawer's
          `bottom: 0` was resolving to the bottom of the 64px-tall
          header instead of the viewport, collapsing the drawer to ~1px.
          z-40 so it sits below the header's z-50 (logo + close button
          must remain clickable above the drawer).
          ============================================================ */}
      <div
        id="mobile-nav"
        className={`md:hidden fixed inset-x-0 top-16 sm:top-20 bottom-0 z-40 bg-au-charcoal text-au-white border-t border-au-white/10 overflow-y-auto transition-[opacity,transform] duration-300 ease-out ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="px-[35px] py-4 flex flex-col">
          {/* DASHBOARD / MEMBERS LOG-IN — promoted to the very top of
              the drawer so signed-in members get straight back to
              their dashboard, and returning members get straight to
              sign-in, without scrolling past the full nav. Pink-filled
              per the AU brand: pink is the activating accent across
              the site. The label flips based on session state once the
              browser-side auth check resolves. */}
          {signedIn ? (
            <>
              <Link
                href="/members"
                onClick={() => setOpen(false)}
                className="mb-3 inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-[3px] font-section font-semibold uppercase tracking-[0.15em] text-[0.8125rem] bg-[var(--color-au-pink)] text-au-charcoal hover:bg-au-white transition-colors"
              >
                Go to dashboard
                <span aria-hidden="true">→</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  handleSignOut();
                }}
                className="mb-6 inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-[3px] font-section font-semibold uppercase tracking-[0.15em] text-[0.75rem] border border-au-white/25 text-au-white hover:bg-au-white/10 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href={LOGIN_URL}
              onClick={() => setOpen(false)}
              className="mb-6 inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-[3px] font-section font-semibold uppercase tracking-[0.15em] text-[0.8125rem] bg-[var(--color-au-pink)] text-au-charcoal hover:bg-au-white transition-colors"
            >
              Members log-in
              <span aria-hidden="true">→</span>
            </Link>
          )}

          {/* COURSES, collapsible accordion. Default collapsed. Burger-menu
              style: display-font heading, dividers between sections. */}
          <section className="border-b border-au-white/15 first:border-t">
            <button
              type="button"
              aria-expanded={coursesOpen}
              aria-controls="mobile-nav-courses"
              onClick={() => setCoursesOpen((v) => !v)}
              className="group w-full flex items-center gap-4 py-5"
            >
              <CoursesIcon open={open} />
              <span
                className="font-display font-bold text-au-white text-left flex-1"
                style={{
                  fontSize: "1.125rem",
                  letterSpacing: "var(--tracking-tight-display)",
                }}
              >
                Courses
                <span className="text-au-white/55 font-medium">
                  {" · "}
                  {COURSES.length} programmes
                  {freeCount > 0 && ` (${freeCount} free)`}
                </span>
              </span>
              <span
                aria-hidden="true"
                className={`inline-block text-au-white/65 text-[1.125rem] leading-none transition-transform duration-300 ${
                  coursesOpen ? "rotate-180" : ""
                }`}
              >
                ⌄
              </span>
            </button>
            <div
              id="mobile-nav-courses"
              hidden={!coursesOpen}
              className={`${coursesOpen ? "pb-4" : ""}`}
            >
              {/* Start free, pinned above the full list so visitors
                  see the lowest-friction path to trying a course
                  before any paid programme is in their eyeline. */}
              {freeCount > 0 && (
                <Link
                  href="/courses?filter=free"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-4 py-4 mb-2 px-4 -mx-4 rounded-[5px] bg-[var(--color-au-pink)]/12 hover:bg-[var(--color-au-pink)]/20 transition-colors"
                >
                  <div className="min-w-0">
                    <h3
                      className="font-display font-bold leading-tight"
                      style={{
                        fontSize: "1.0625rem",
                        color: "var(--color-au-pink)",
                        letterSpacing: "var(--tracking-tight-display)",
                      }}
                    >
                      Start free
                    </h3>
                    <p className="text-[0.8125rem] text-au-white/70 leading-snug mt-0.5">
                      {freeCount} taster {freeCount === 1 ? "course" : "courses"}, no card needed.
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="text-[1rem] leading-none shrink-0"
                    style={{ color: "var(--color-au-pink)" }}
                  >
                    →
                  </span>
                </Link>
              )}
              <ul className="flex flex-col">
                {COURSES.map((c) => {
                  const priceLabel =
                    c.price === undefined
                      ? "Free"
                      : `£${c.price.toLocaleString("en-GB")}`;
                  return (
                    <li
                      key={c.slug}
                      className="border-b border-au-white/15 first:border-t"
                    >
                      <Link
                        href={`/courses/${c.slug}`}
                        onClick={() => setOpen(false)}
                        className="group grid grid-cols-[auto_1fr_auto] gap-3 sm:gap-4 items-start py-4"
                      >
                        <div className="pt-1">
                          <CourseRowIcon slug={c.slug} open={coursesOpen} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-section font-semibold uppercase tracking-[0.15em] text-[0.625rem] text-au-white/55 mb-1">
                            {c.category} · {c.format}
                            {c.availability === "waitlist" && " · Waitlist"}
                          </p>
                          <h3
                            className="font-display font-bold leading-tight text-au-white"
                            style={{
                              fontSize: "1.125rem",
                              letterSpacing: "var(--tracking-tight-display)",
                            }}
                          >
                            {c.title}
                          </h3>
                        </div>
                        <span
                          className="font-display font-black leading-none whitespace-nowrap pt-1"
                          style={{
                            fontSize: "1rem",
                            color: "var(--color-au-pink)",
                            letterSpacing: "var(--tracking-tight-display)",
                          }}
                        >
                          {priceLabel}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                href="/courses"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 font-section font-semibold uppercase tracking-[0.15em] text-[0.75rem] text-au-white hover:text-[var(--color-au-pink)] transition-colors mt-5"
              >
                See all courses in detail <span aria-hidden="true">→</span>
              </Link>
            </div>
          </section>

          {/* MEMBERS' AREA, direct link, descriptor under. Surfaces
              the just-built /dashboard pitch high in the menu so
              visitors see what they get post-enrolment. */}
          <section className="border-b border-au-white/15">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="group flex items-start gap-4 py-5"
            >
              <MembersAreaIcon open={open} className="mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1.5">
                  <h3
                    className="font-display font-bold leading-tight text-au-white"
                    style={{
                      fontSize: "1.125rem",
                      letterSpacing: "var(--tracking-tight-display)",
                    }}
                  >
                    Members&apos; area
                  </h3>
                  <span
                    aria-hidden="true"
                    className="inline-block text-au-white/65 text-[1.125rem] leading-none mt-0.5"
                  >
                    →
                  </span>
                </div>
                <p className="text-[0.875rem] text-au-white/65 leading-snug">
                  Instant access to every course you own. On any device, any
                  time.
                </p>
              </div>
            </Link>
          </section>

          {/* BERNADETTE, accordion. The straight About link plus the
              authority signals visitors otherwise wouldn't reach from
              the burger: the published book, the awards, and the
              award-winning clinic she runs. */}
          <section className="border-b border-au-white/15">
            <button
              type="button"
              aria-expanded={aboutOpen}
              aria-controls="mobile-nav-about"
              onClick={() => setAboutOpen((v) => !v)}
              className="group w-full flex items-center gap-4 py-5"
            >
              <PersonIcon open={open} />
              <span
                className="font-display font-bold text-au-white text-left flex-1"
                style={{
                  fontSize: "1.125rem",
                  letterSpacing: "var(--tracking-tight-display)",
                }}
              >
                Bernadette
              </span>
              <span
                aria-hidden="true"
                className={`inline-block text-au-white/65 text-[1.125rem] leading-none transition-transform duration-300 ${
                  aboutOpen ? "rotate-180" : ""
                }`}
              >
                ⌄
              </span>
            </button>
            <div
              id="mobile-nav-about"
              hidden={!aboutOpen}
              className={`${aboutOpen ? "pb-4" : ""}`}
            >
              <ul className="flex flex-col">
                <li className="border-b border-au-white/15 first:border-t">
                  <Link
                    href="/about"
                    onClick={() => setOpen(false)}
                    className="block py-4"
                  >
                    <h3
                      className="font-display font-bold leading-tight text-au-white mb-1"
                      style={{ fontSize: "1.0625rem" }}
                    >
                      About Bernadette
                    </h3>
                    <p className="text-[0.875rem] text-au-white/65 leading-snug">
                      RN, MSc Advanced Practice. Twenty years on the ward.
                      Twelve in aesthetics. Educator of the Year 2026
                      Nominee.
                    </p>
                  </Link>
                </li>
                <li className="border-b border-au-white/15">
                  <a
                    href={BOOK_AMAZON_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="block py-4"
                  >
                    <h3
                      className="font-display font-bold leading-tight text-au-white mb-1"
                      style={{ fontSize: "1.0625rem" }}
                    >
                      The book, <em className="not-italic">Regulation to Reputation</em>{" "}
                      <span aria-hidden="true">↗</span>
                    </h3>
                    <p className="text-[0.875rem] text-au-white/65 leading-snug">
                      The reference Bernadette wrote for UK aesthetic
                      practitioners, on Amazon UK.
                    </p>
                  </a>
                </li>
                <li className="border-b border-au-white/15">
                  <Link
                    href="/about#awards"
                    onClick={() => setOpen(false)}
                    className="block py-4"
                  >
                    <h3
                      className="font-display font-bold leading-tight text-au-white mb-1"
                      style={{ fontSize: "1.0625rem" }}
                    >
                      Awards &amp; recognition
                    </h3>
                    <p className="text-[0.875rem] text-au-white/65 leading-snug">
                      Educator of the Year 2026 Nominee · Best Non-Surgical
                      Aesthetics Clinic 2026 (Essex).
                    </p>
                  </Link>
                </li>
                <li className="border-b border-au-white/15">
                  <a
                    href={VISAGE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="block py-4"
                  >
                    <h3
                      className="font-display font-bold leading-tight text-au-white mb-1"
                      style={{ fontSize: "1.0625rem" }}
                    >
                      Visage Aesthetics, the clinic{" "}
                      <span aria-hidden="true">↗</span>
                    </h3>
                    <p className="text-[0.875rem] text-au-white/65 leading-snug">
                      Bernadette&apos;s award-winning private clinic in
                      Braintree, Essex. Where the work happens.
                    </p>
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* TESTIMONIALS, top-level direct link. Promoted out of the
              Insights accordion so social proof is a single tap from
              the burger, matching the Members' area + Bernadette
              pattern. */}
          <section className="border-b border-au-white/15">
            <Link
              href="/testimonials"
              onClick={() => setOpen(false)}
              className="group flex items-start gap-4 py-5"
            >
              <QuoteIcon open={open} className="mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1.5">
                  <h3
                    className="font-display font-bold leading-tight text-au-white"
                    style={{
                      fontSize: "1.125rem",
                      letterSpacing: "var(--tracking-tight-display)",
                    }}
                  >
                    Our reviews
                  </h3>
                  <span
                    aria-hidden="true"
                    className="inline-block text-au-white/65 text-[1.125rem] leading-none mt-0.5"
                  >
                    →
                  </span>
                </div>
                <p className="text-[0.875rem] text-au-white/65 leading-snug">
                  Reviews from the cohort, grouped by course, so you
                  can hear from peers before you enrol.
                </p>
              </div>
            </Link>
          </section>

          {/* STANDARDS & REGULATION, collapsible group of three deep
              educational surfaces (Standards · UK Regulation · By UK
              nation & city). Default collapsed. */}
          <section className="border-b border-au-white/15">
            <button
              type="button"
              aria-expanded={referencesOpen}
              aria-controls="mobile-nav-references"
              onClick={() => setReferencesOpen((v) => !v)}
              className="group w-full flex items-center gap-4 py-5"
            >
              <ShieldIcon open={open} />
              <span
                className="font-display font-bold text-au-white text-left flex-1"
                style={{
                  fontSize: "1.125rem",
                  letterSpacing: "var(--tracking-tight-display)",
                }}
              >
                Standards &amp; regulation
              </span>
              <span
                aria-hidden="true"
                className={`inline-block text-au-white/65 text-[1.125rem] leading-none transition-transform duration-300 ${
                  referencesOpen ? "rotate-180" : ""
                }`}
              >
                ⌄
              </span>
            </button>
            <div
              id="mobile-nav-references"
              hidden={!referencesOpen}
              className={`${referencesOpen ? "pb-4" : ""}`}
            >
              <ul className="flex flex-col">
                <li className="border-b border-au-white/15 first:border-t">
                  <Link
                    href="/standards"
                    onClick={() => setOpen(false)}
                    className="block py-4"
                  >
                    <h3
                      className="font-display font-bold leading-tight text-au-white mb-1"
                      style={{ fontSize: "1.0625rem" }}
                    >
                      Standards we teach against
                    </h3>
                    <p className="text-[0.875rem] text-au-white/65 leading-snug">
                      NICE · JCCP · CPSA · MHRA · CQC · NMC · RCN · ASA.
                      Eight bodies. Every course anchored.
                    </p>
                  </Link>
                </li>
                <li className="border-b border-au-white/15">
                  <Link
                    href="/regulation"
                    onClick={() => setOpen(false)}
                    className="block py-4"
                  >
                    <h3
                      className="font-display font-bold leading-tight text-au-white mb-1"
                      style={{ fontSize: "1.0625rem" }}
                    >
                      UK aesthetics regulation
                    </h3>
                    <p className="text-[0.875rem] text-au-white/65 leading-snug">
                      The current regulatory landscape, JCCP, CPSA, MHRA,
                      CQC, ASA, explained in plain English.
                    </p>
                  </Link>
                </li>
                <li className="border-b border-au-white/15">
                  <Link
                    href="/for"
                    onClick={() => setOpen(false)}
                    className="block py-4"
                  >
                    <h3
                      className="font-display font-bold leading-tight text-au-white mb-1"
                      style={{ fontSize: "1.0625rem" }}
                    >
                      By UK nation &amp; city
                    </h3>
                    <p className="text-[0.875rem] text-au-white/65 leading-snug">
                      Tailored notes for England, Scotland, Wales, Northern
                      Ireland, and the practitioner-density cities.
                    </p>
                  </Link>
                </li>
              </ul>
            </div>
          </section>

          {/* BLOG & FAQs accordion. Default collapsed. */}
          <section className="border-b border-au-white/15">
            <button
              type="button"
              aria-expanded={insightsOpen}
              aria-controls="mobile-nav-insights"
              onClick={() => setInsightsOpen((v) => !v)}
              className="group w-full flex items-center gap-4 py-5"
            >
              <InsightsIcon open={open} />
              <span
                className="font-display font-bold text-au-white text-left flex-1"
                style={{
                  fontSize: "1.125rem",
                  letterSpacing: "var(--tracking-tight-display)",
                }}
              >
                Blog &amp; FAQs
              </span>
              <span
                aria-hidden="true"
                className={`inline-block text-au-white/65 text-[1.125rem] leading-none transition-transform duration-300 ${
                  insightsOpen ? "rotate-180" : ""
                }`}
              >
                ⌄
              </span>
            </button>
            <div
              id="mobile-nav-insights"
              hidden={!insightsOpen}
              className={`${insightsOpen ? "pb-4" : ""}`}
            >
              <ul className="flex flex-col">
                <li className="border-b border-au-white/15 first:border-t">
                  <Link
                    href="/blog"
                    onClick={() => setOpen(false)}
                    className="block py-4"
                  >
                    <h3
                      className="font-display font-bold leading-tight text-au-white mb-1"
                      style={{ fontSize: "1.0625rem" }}
                    >
                      The blog
                    </h3>
                    <p className="text-[0.875rem] text-au-white/65 leading-snug">
                      Working analysis of clinical practice, regulation, and
                      the business of running a clinic.
                    </p>
                  </Link>
                </li>
                <li className="border-b border-au-white/15">
                  <Link
                    href="/faqs"
                    onClick={() => setOpen(false)}
                    className="block py-4"
                  >
                    <h3
                      className="font-display font-bold leading-tight text-au-white mb-1"
                      style={{ fontSize: "1.0625rem" }}
                    >
                      FAQs
                    </h3>
                    <p className="text-[0.875rem] text-au-white/65 leading-snug">
                      The questions practitioners actually ask before
                      enrolling, answered straight.
                    </p>
                  </Link>
                </li>
              </ul>
            </div>
          </section>

          {/* CONNECT, Contact + email + Instagram. Default collapsed. */}
          <section className="border-b border-au-white/15">
            <button
              type="button"
              aria-expanded={connectOpen}
              aria-controls="mobile-nav-connect"
              onClick={() => setConnectOpen((v) => !v)}
              className="group w-full flex items-center gap-4 py-5"
            >
              <MailIcon open={open} />
              <span
                className="font-display font-bold text-au-white text-left flex-1"
                style={{
                  fontSize: "1.125rem",
                  letterSpacing: "var(--tracking-tight-display)",
                }}
              >
                Connect
              </span>
              <span
                aria-hidden="true"
                className={`inline-block text-au-white/65 text-[1.125rem] leading-none transition-transform duration-300 ${
                  connectOpen ? "rotate-180" : ""
                }`}
              >
                ⌄
              </span>
            </button>
            <div
              id="mobile-nav-connect"
              hidden={!connectOpen}
              className={`${connectOpen ? "pb-4" : ""}`}
            >
              <ul className="flex flex-col">
                <li className="border-b border-au-white/15 first:border-t">
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="block py-4 font-display font-bold text-au-white hover:text-[var(--color-au-pink)] transition-colors"
                    style={{ fontSize: "1.0625rem" }}
                  >
                    Contact
                  </Link>
                </li>
                <li className="border-b border-au-white/15">
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="block py-4 font-display font-bold text-au-white hover:text-[var(--color-au-pink)] transition-colors"
                    style={{ fontSize: "1.0625rem" }}
                  >
                    Email · {BRAND.email}
                  </a>
                </li>
                <li className="border-b border-au-white/15">
                  <a
                    href={BRAND.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-4 font-display font-bold text-au-white hover:text-[var(--color-au-pink)] transition-colors"
                    style={{ fontSize: "1.0625rem" }}
                  >
                    Instagram · @{BRAND.instagram.handle}{" "}
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* CREDENTIAL STRIP, drives home the educator's authority. */}
          <section className="mt-8 pt-8 border-t border-au-white/15">
            <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.625rem] text-au-white/55 mb-2">
              Built and taught by
            </p>
            <p
              className="font-display font-black leading-tight mb-3"
              style={{
                fontSize: "1.25rem",
                color: "var(--color-au-pink)",
                letterSpacing: "var(--tracking-tight-display)",
              }}
            >
              {FOUNDER.fullName}, {FOUNDER.shortCredentials}.
            </p>
            <p className="text-[0.8125rem] text-au-white/75 leading-relaxed mb-2">
              NMC Pin{" "}
              <a
                href={NMC_REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold hover:underline transition-colors"
                style={{ color: "var(--color-au-pink)" }}
              >
                {FOUNDER.nmcPin}
              </a>
              {" "}· Registered with the Royal College of Nursing
            </p>
            <p className="text-[0.8125rem] text-au-white/65 leading-relaxed">
              Educator of the Year 2026 Nominee. MSc Advanced Practice. Author,
              lecturer, working clinic owner.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

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
 *   - All 6 courses with category + format + price
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
import { MEMBERS_URL, NMC_REGISTER_URL } from "@/lib/links";

const PRIMARY_LINKS = [
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/standards", label: "Standards" },
  { href: "/contact", label: "Contact" },
] as const;

type Props = {
  /** Force the light state regardless of scroll position. */
  forceLight?: boolean;
};

export function Nav({ forceLight = false }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        {/* Logo — pink "aesthetics" + white "unlocked" on dark hero,
            pink + charcoal primary on light scrolled state. Sized
            bigger per Giles' "make this bigger" call. */}
        <Link
          href="/"
          aria-label="Aesthetics Unlocked — home"
          className="flex items-center"
          onClick={() => setOpen(false)}
        >
          {/* Logo always pink-on-dark — header bar is dark in both
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
          <a
            href={MEMBERS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[0.75rem] uppercase tracking-[0.15em] transition-colors ${membersColour}`}
          >
            Members ↗
          </a>
        </nav>

        {/* Mobile menu trigger */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden h-12 w-12 flex flex-col items-center justify-center gap-[5px] -mr-2 z-10"
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
    </header>

      {/* ============================================================
          MOBILE DRAWER — full-screen panel with course depth surfaced.
          Rendered as a sibling of <header> (not inside it) so the
          header's `backdrop-blur` doesn't establish a containing block
          for this fixed-position drawer — without that, the drawer's
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
        <div className="px-[35px] py-8 flex flex-col gap-10">
          {/* COURSES — surfaced with full depth */}
          <section>
            <p
              className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] mb-4"
              style={{ color: "var(--color-au-pink)" }}
            >
              Courses · {COURSES.length} programmes
            </p>
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
                      className="grid grid-cols-[1fr_auto] gap-4 items-baseline py-4"
                    >
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
                        className="font-display font-black leading-none whitespace-nowrap"
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
          </section>

          {/* LEARN ABOUT — about / standards */}
          <section>
            <p
              className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] mb-4"
              style={{ color: "var(--color-au-pink)" }}
            >
              The educator
            </p>
            <ul className="flex flex-col">
              <li className="border-b border-au-white/15 first:border-t">
                <Link
                  href="/about"
                  onClick={() => setOpen(false)}
                  className="block py-4"
                >
                  <h3
                    className="font-display font-bold leading-tight text-au-white mb-1"
                    style={{ fontSize: "1.125rem" }}
                  >
                    About Bernadette
                  </h3>
                  <p className="text-[0.875rem] text-au-white/65 leading-snug">
                    RN, MSc Advanced Practice. Twenty years on the ward. Twelve
                    in aesthetics. Educator of the Year 2026 Nominee.
                  </p>
                </Link>
              </li>
              <li className="border-b border-au-white/15">
                <Link
                  href="/standards"
                  onClick={() => setOpen(false)}
                  className="block py-4"
                >
                  <h3
                    className="font-display font-bold leading-tight text-au-white mb-1"
                    style={{ fontSize: "1.125rem" }}
                  >
                    Standards we teach against
                  </h3>
                  <p className="text-[0.875rem] text-au-white/65 leading-snug">
                    NICE · JCCP · CPSA · MHRA · CQC · NMC · RCN · ASA. Eight
                    bodies. Every course anchored.
                  </p>
                </Link>
              </li>
            </ul>
          </section>

          {/* CONNECT */}
          <section>
            <p
              className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] mb-4"
              style={{ color: "var(--color-au-pink)" }}
            >
              Connect
            </p>
            <ul className="flex flex-col">
              <li className="border-b border-au-white/15 first:border-t">
                <Link
                  href="/faqs"
                  onClick={() => setOpen(false)}
                  className="block py-4 font-display font-bold text-au-white hover:text-[var(--color-au-pink)] transition-colors"
                  style={{ fontSize: "1.125rem" }}
                >
                  FAQs
                </Link>
              </li>
              <li className="border-b border-au-white/15">
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="block py-4 font-display font-bold text-au-white hover:text-[var(--color-au-pink)] transition-colors"
                  style={{ fontSize: "1.125rem" }}
                >
                  Contact
                </Link>
              </li>
              <li className="border-b border-au-white/15">
                <a
                  href={`mailto:${BRAND.email}`}
                  className="block py-4 font-display font-bold text-au-white hover:text-[var(--color-au-pink)] transition-colors"
                  style={{ fontSize: "1.125rem" }}
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
                  style={{ fontSize: "1.125rem" }}
                >
                  Instagram · @{BRAND.instagram.handle}{" "}
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li className="border-b border-au-white/15">
                <a
                  href={MEMBERS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-4 font-display font-bold text-au-white hover:text-[var(--color-au-pink)] transition-colors"
                  style={{ fontSize: "1.125rem" }}
                >
                  Members log-in <span aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </section>

          {/* CREDENTIAL STRIP — drives home the educator's authority. */}
          <section className="border-t border-au-white/15 pt-6">
            <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.625rem] text-au-white/55 mb-2">
              Built and taught by
            </p>
            <p
              className="font-display font-black leading-tight mb-3"
              style={{
                fontSize: "1.25rem",
                color: "var(--color-au-charcoal)",
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

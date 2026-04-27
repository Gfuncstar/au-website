/**
 * Global 404 / not-found page.
 *
 * Built per the seo-audit.md call: the live Kartra site returns a soft
 * 404 with the homepage HTML for any unknown URL — bad for SEO and
 * confusing for users. This proper 404 returns the right HTTP status
 * (Next handles that) and gives the visitor a real path forward
 * instead of a dead end.
 *
 * Voice: first-person Bernadette, same as the rest of the site.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PosterBlock } from "@/components/PosterBlock";
import { Eyebrow } from "@/components/Eyebrow";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page doesn't exist on Aesthetics Unlocked. Try the courses, the regulation hub, or the about page.",
  // Don't index the 404 page itself.
  robots: { index: false, follow: true },
};

const SUGGESTIONS = [
  {
    href: "/",
    label: "Home",
    body: "The current site, its courses, and what I teach.",
  },
  {
    href: "/courses",
    label: "Courses",
    body: "All six AU courses, from free tasters to the 12-week business programme.",
  },
  {
    href: "/regulation",
    label: "UK aesthetics regulation",
    body: "The licensing scheme, the eight regulators, the devolved-nation rules.",
  },
  {
    href: "/about",
    label: "About me",
    body: "Bernadette Tobin RN, MSc — Educator of the Year 2026 Nominee.",
  },
] as const;

export default function NotFound() {
  return (
    <>
      <Nav forceLight />
      <main id="main" className="pt-16 sm:pt-20">
        <PosterBlock tone="cream" contained>
          <div className="max-w-3xl">
            <Eyebrow className="mb-6">404 · Not found</Eyebrow>
            <h1
              className="font-display font-black text-au-charcoal mb-8 sm:mb-10"
              style={{
                fontSize: "var(--text-poster)",
                lineHeight: "var(--leading-poster)",
                letterSpacing: "var(--tracking-tight-display)",
              }}
            >
              That page{" "}
              <span style={{ color: "var(--color-au-pink)" }}>
                isn&rsquo;t here
              </span>
              .
            </h1>
            <p className="max-w-2xl text-[1.0625rem] sm:text-[1.125rem] md:text-[1.25rem] text-au-charcoal/85 leading-relaxed mb-10">
              Either the link was wrong, or I&rsquo;ve moved the page since
              you last looked. Here&rsquo;s where to go next.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-10">
              {SUGGESTIONS.map((s) => (
                <li
                  key={s.href}
                  className="border border-au-charcoal/15 rounded-[5px] hover:border-[var(--color-au-pink)] transition-colors"
                >
                  <Link href={s.href} className="block p-5 sm:p-6">
                    <h2
                      className="font-display font-black text-au-charcoal mb-2"
                      style={{
                        fontSize: "1.125rem",
                        letterSpacing: "var(--tracking-tight-display)",
                      }}
                    >
                      {s.label}
                    </h2>
                    <p className="text-[0.9375rem] text-au-charcoal/75 leading-relaxed">
                      {s.body}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <Button href="/" variant="pink" size="sm">
                Back to home
              </Button>
              <Button href="/contact" variant="black" size="sm">
                Tell me what you were looking for
              </Button>
            </div>
          </div>
        </PosterBlock>
      </main>
      <Footer />
    </>
  );
}

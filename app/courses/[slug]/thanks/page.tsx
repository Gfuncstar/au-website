/**
 * /courses/[slug]/thanks — opt-in success page.
 *
 * Reached when someone completes an OptInForm OR (later in Phase 5)
 * when they finish a Stripe checkout. The form component already
 * shows an inline success state, but for cases where the form
 * redirects (e.g. webhook-triggered emails carry "click here to
 * confirm" links), this is the landing page.
 *
 * Voice + branding match the rest of the site — first-person
 * Bernadette welcome, soft cross-link to the rest of the catalogue.
 *
 * Robots: noindex — these are private confirmation pages, not
 * something we want in search results.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PosterBlock } from "@/components/PosterBlock";
import { Eyebrow } from "@/components/Eyebrow";
import { Button } from "@/components/Button";
import { COURSES, getCourse } from "@/lib/courses";

type Params = { slug: string };

export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  return {
    title: course
      ? `You're in — ${course.title}`
      : "Thank you",
    description: "Welcome to Aesthetics Unlocked.",
    robots: { index: false, follow: false },
  };
}

export default async function ThanksPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  return (
    <>
      <Nav forceLight />
      <main id="main" className="pt-16 sm:pt-20">
        <PosterBlock tone="cream" contained>
          <div className="max-w-3xl">
            <Eyebrow className="mb-6">You&rsquo;re in</Eyebrow>
            <h1
              className="font-display font-black text-au-charcoal mb-8 sm:mb-10"
              style={{
                fontSize: "var(--text-poster)",
                lineHeight: "var(--leading-poster)",
                letterSpacing: "var(--tracking-tight-display)",
              }}
            >
              Welcome to{" "}
              <span style={{ color: "var(--color-au-pink)" }}>
                {course.title}
              </span>
              .
            </h1>
            <p className="max-w-2xl text-[1.0625rem] sm:text-[1.125rem] md:text-[1.25rem] text-au-charcoal/85 leading-relaxed mb-8">
              Check your inbox in the next few minutes for the welcome
              email. If it doesn&rsquo;t arrive, look in your spam folder
              and add{" "}
              <code className="text-[1rem]">hello@aunlock.co.uk</code> to
              your safe senders so future emails come through cleanly.
            </p>
            <p className="max-w-2xl text-[1rem] sm:text-[1.0625rem] text-au-charcoal/75 leading-relaxed mb-10">
              While you wait, take a look at the rest of what I teach —
              there&rsquo;s usually one course that complements{" "}
              {course.title} naturally. Or read about{" "}
              <Link
                href="/about"
                className="underline decoration-[var(--color-au-pink)] underline-offset-4 hover:text-[var(--color-au-pink)] transition-colors"
              >
                why I built this
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/courses" variant="pink" size="sm">
                See my other courses
              </Button>
              <Button href="/regulation" variant="black" size="sm">
                UK regulation, decoded
              </Button>
            </div>
          </div>
        </PosterBlock>
      </main>
      <Footer />
    </>
  );
}

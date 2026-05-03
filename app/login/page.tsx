/**
 * /login — email + password sign-in for Aesthetics Unlocked members.
 *
 * Flow:
 *   1. Member enters email + password, hits "Sign in"
 *   2. POST /api/auth/login → Supabase verifies via signInWithPassword,
 *      sets session cookies server-side
 *   3. Hard navigation to /members (or `?next=` path) so the SSR layer
 *      reads the new session cookies
 *
 * If the member has forgotten their password, the "Forgot password?"
 * link sends them to /forgot-password where Supabase sends a reset
 * email.
 *
 * Visual: charcoal full-screen, pink accents, white type. Different
 * from the rest of the site so members feel they've stepped through
 * a doorway into the private portal.
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/members";
  const errorParam = params.get("error");
  const noticeParam = params.get("notice");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(
    errorParam === "auth_not_configured"
      ? "Sign-in isn't fully configured yet, please email hello@aunlock.co.uk."
      : "",
  );
  const [notice] = useState(
    noticeParam === "password_set"
      ? "Password set. Sign in below."
      : noticeParam === "password_reset"
        ? "Password updated. Sign in below."
        : "",
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Enter your email.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        setError(
          json.error === "invalid_credentials"
            ? "That email and password don't match. Try again, or reset your password."
            : json.error === "email_not_confirmed"
              ? "Please confirm your email first. Check your inbox for the confirmation link."
              : json.error === "auth_not_configured"
                ? "Sign-in isn't configured yet, please email hello@aunlock.co.uk."
                : json.error === "invalid_email"
                  ? "That doesn't look like a valid email."
                  : "Something went wrong. Try again in a moment.",
        );
        setSubmitting(false);
        return;
      }
      track("sign_in_success");
      // Hard navigation so the new session cookie is read by the
      // server on /members.
      window.location.href = next;
    } catch {
      setError("Network error. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.75rem] text-au-pink mb-5">
        Members area
      </p>
      <h1
        className="font-display font-black text-au-white leading-[0.95] mb-5"
        style={{
          fontSize: "clamp(2.25rem, 6.5vw, 4.5rem)",
          letterSpacing: "var(--tracking-tight-display)",
        }}
      >
        Sign in.
      </h1>
      <p className="text-au-white/70 text-[1rem] sm:text-[1.0625rem] leading-relaxed max-w-[44ch] mb-9">
        Enter your email and password to access your courses.
      </p>

      {notice && (
        <p
          role="status"
          className="font-section font-semibold uppercase tracking-[0.1em] text-[0.7rem] text-au-pink mb-7"
        >
          {notice}
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-7" noValidate>
        <label className="block" htmlFor="login-email">
          <span className="block font-section font-semibold uppercase tracking-[0.12em] text-[0.7rem] text-au-white/55 mb-2">
            Email address
          </span>
          <div className="relative flex items-center border-b-2 border-au-pink/40 focus-within:border-au-pink transition-colors">
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="you@yourclinic.co.uk"
              className="w-full bg-transparent border-0 focus:outline-none text-[1.0625rem] sm:text-[1.125rem] py-3 text-au-white placeholder:text-au-white/30"
            />
          </div>
        </label>

        <label className="block" htmlFor="login-password">
          <span className="flex items-baseline justify-between mb-2">
            <span className="font-section font-semibold uppercase tracking-[0.12em] text-[0.7rem] text-au-white/55">
              Password
            </span>
            <Link
              href="/forgot-password"
              className="font-section font-semibold uppercase tracking-[0.1em] text-[0.65rem] text-au-pink hover:text-au-white transition-colors"
            >
              Forgot password?
            </Link>
          </span>
          <div className="relative flex items-center border-b-2 border-au-pink/40 focus-within:border-au-pink transition-colors">
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="••••••••••"
              className="w-full bg-transparent border-0 focus:outline-none text-[1.0625rem] sm:text-[1.125rem] py-3 text-au-white placeholder:text-au-white/30"
            />
          </div>
        </label>

        {error && (
          <p
            role="alert"
            className="font-section font-semibold uppercase tracking-[0.1em] text-[0.7rem] text-[#FF1F8F]"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex items-center justify-center gap-2 bg-au-pink hover:bg-au-white text-au-charcoal font-display font-bold uppercase tracking-[0.05em] rounded-[5px] px-7 sm:px-8 py-3.5 sm:py-4 min-h-[48px] text-[0.875rem] sm:text-[0.9375rem] transition-colors disabled:opacity-50"
        >
          {submitting ? (
            <span>Signing in…</span>
          ) : (
            <>
              <span>Sign in</span>
              <span
                aria-hidden="true"
                className="inline-block transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </>
          )}
        </button>
      </form>

      {/* Not-a-member path — for visitors who clicked "Members log-in"
          before they actually have an account. Aesthetics Unlocked
          membership is created when someone buys a course or grabs a
          free taster (Kartra → IPN → public.members), so the right
          destination here is /courses, not a self-serve sign-up form. */}
      <div className="mt-9 pt-8 border-t border-au-white/10">
        <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] text-au-pink mb-3">
          Not a member yet?
        </p>
        <p className="text-[0.9375rem] sm:text-[1rem] text-au-white/85 leading-relaxed mb-5 max-w-[44ch]">
          Aesthetics Unlocked membership starts the moment you enrol on a
          course. Free tasters are one-tap. Paid courses give you lifetime
          access and a members&apos; area login by email.
        </p>
        <Link
          href="/courses"
          className="group inline-flex items-center gap-2 font-display font-bold uppercase tracking-[0.05em] text-[0.8125rem] sm:text-[0.875rem] text-au-pink hover:text-au-white transition-colors"
        >
          <span>Browse the courses</span>
          <span
            aria-hidden="true"
            className="inline-block transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>

      <p className="mt-10 font-section font-semibold uppercase tracking-[0.1em] text-[0.625rem] text-au-white/45">
        Trouble signing in?{" "}
        <a
          href="mailto:hello@aunlock.co.uk"
          className="text-au-pink hover:text-au-white transition-colors"
        >
          hello@aunlock.co.uk
        </a>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-[1.1fr_1fr] bg-au-charcoal text-au-white">
      <section className="relative flex flex-col justify-between px-7 sm:px-12 lg:px-16 py-8 lg:py-14 min-h-[80vh] lg:min-h-screen">
        <header className="flex items-center justify-between">
          <Link href="/" aria-label="Aesthetics Unlocked, home">
            <Image
              src="/brand/au-logo-pink-on-dark.png"
              alt="Aesthetics Unlocked"
              width={150}
              height={42}
              className="h-auto w-[140px] sm:w-[150px]"
              priority
            />
          </Link>
          <Link
            href="/"
            className="font-section font-semibold uppercase tracking-[0.1em] text-[0.6875rem] text-au-white/55 hover:text-au-pink transition-colors"
          >
            ← Back to site
          </Link>
        </header>

        <span
          aria-hidden="true"
          className="hidden lg:inline-block absolute right-6 top-1/2 -translate-y-1/2 text-vertical font-section font-semibold uppercase tracking-[0.3em] text-[0.7rem] text-au-white/15"
        >
          AESTHETICS UNLOCKED®
        </span>

        <div className="flex-1 flex items-center pt-10 lg:pt-0 max-w-[520px]">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <footer className="mt-10 lg:mt-0 font-section font-semibold uppercase tracking-[0.1em] text-[0.625rem] text-au-white/45">
          Beauty &amp; Aesthetics Awards · Educator of the Year 2026 Nominee
        </footer>
      </section>

      <aside
        aria-hidden="true"
        className="hidden lg:block relative bg-au-black overflow-hidden"
      >
        <Image
          src="/brand/bernadette-portrait-wide.jpg"
          alt=""
          fill
          sizes="50vw"
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-au-charcoal/70 via-au-charcoal/20 to-transparent" />
      </aside>
    </div>
  );
}

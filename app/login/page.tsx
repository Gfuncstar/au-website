/**
 * /login — passwordless sign-in for Aesthetics Unlocked members.
 *
 * Flow (OTP code, not magic-link click):
 *   1. Member enters email, hits "Send me a sign-in code"
 *   2. POST /api/auth/login → Supabase emails them a 6-digit code
 *      (Supabase sends both a code and a link in the same email; we
 *      use the code path because Microsoft 365 / Outlook pre-scans
 *      URLs in incoming mail, which consumes magic-link tokens
 *      before the human clicks them and breaks the flow)
 *   3. UI swaps to a 6-digit code input
 *   4. Member types code, hits "Sign in"
 *   5. POST /api/auth/verify → exchanges code for a session cookie →
 *      browser navigates to /members (or `?next=` path)
 *
 * Three states swapped client-side:
 *   - "form"   → email field + submit
 *   - "code"   → 6-digit code field + submit
 *   - "done"   → calm "you're in, redirecting..." (only briefly)
 *
 * Visual: charcoal full-screen, pink accents, white type — different
 * from the rest of the site so members feel they've stepped through
 * a doorway into the private portal.
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/members";
  const errorParam = params.get("error");

  const [mode, setMode] = useState<"form" | "code">("form");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(
    errorParam === "link_expired"
      ? "That link has expired. Send yourself a fresh code."
      : errorParam === "link_invalid"
        ? "That link wasn't valid. Send yourself a fresh code."
        : errorParam === "auth_not_configured"
          ? "Sign-in isn't fully configured yet, please email hello@aunlock.co.uk."
          : "",
  );

  async function onSendCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Enter your email first.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), next }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        setError(
          json.error === "auth_not_configured"
            ? "Sign-in isn't configured yet, please email hello@aunlock.co.uk."
            : json.error === "invalid_email"
              ? "That doesn't look like a valid email."
              : "Something went wrong. Try again in a moment.",
        );
        setSubmitting(false);
        return;
      }
      track("sign_in_request");
      setMode("code");
      setSubmitting(false);
    } catch {
      setError("Network error. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  async function onVerifyCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: code.trim() }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        setError(
          json.error === "invalid_code"
            ? "That code isn't valid, check the digits."
            : json.error === "auth_not_configured"
              ? "Sign-in isn't configured yet, please email hello@aunlock.co.uk."
              : json.error?.toLowerCase().includes("expired")
                ? "That code has expired. Send yourself a fresh one."
                : "That code didn't work. Try again or send a fresh one.",
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

  if (mode === "code") {
    return (
      <div className="w-full">
        <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.75rem] text-au-pink mb-5">
          Check your inbox
        </p>
        <h1
          className="font-display font-black text-au-white leading-[0.95] mb-5"
          style={{
            fontSize: "clamp(2.25rem, 6.5vw, 4.5rem)",
            letterSpacing: "var(--tracking-tight-display)",
          }}
        >
          Enter your code.
        </h1>
        <p className="text-au-white/70 text-[1rem] sm:text-[1.0625rem] leading-relaxed max-w-[44ch] mb-9">
          We&apos;ve sent a 6-digit code to{" "}
          <span className="font-bold text-au-white">{email}</span>. Type it
          below, it expires in 15 minutes.
        </p>

        <form onSubmit={onVerifyCode} className="space-y-7" noValidate>
          <label className="block" htmlFor="login-code">
            <span className="block font-section font-semibold uppercase tracking-[0.12em] text-[0.7rem] text-au-white/55 mb-2">
              6-digit code
            </span>
            <div className="relative flex items-center border-b-2 border-au-pink/40 focus-within:border-au-pink transition-colors">
              <input
                id="login-code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                autoComplete="one-time-code"
                maxLength={6}
                required
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                  if (error) setError("");
                }}
                placeholder="000000"
                className="w-full bg-transparent border-0 focus:outline-none text-[1.5rem] sm:text-[1.75rem] tracking-[0.4em] py-3 text-au-white placeholder:text-au-white/30 font-section tabular-nums"
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

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 sm:items-center">
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

            <button
              type="button"
              onClick={() => {
                setMode("form");
                setCode("");
                setError("");
              }}
              className="font-section font-semibold uppercase tracking-[0.1em] text-[0.7rem] text-au-white/65 hover:text-au-pink transition-colors min-h-[44px] inline-flex items-center"
            >
              ← Use a different email
            </button>
          </div>
        </form>

        <p className="mt-9 font-section font-semibold uppercase tracking-[0.1em] text-[0.625rem] text-au-white/45">
          Didn&apos;t get the code? Check spam, or{" "}
          <a
            href="mailto:hello@aunlock.co.uk"
            className="text-au-pink hover:text-au-white transition-colors"
          >
            email hello@aunlock.co.uk
          </a>
          .
        </p>
      </div>
    );
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
        Enter the email you used to enrol. We&apos;ll send a one-time 6-digit
        sign-in code, no password needed.
      </p>

      <form onSubmit={onSendCode} className="space-y-7" noValidate>
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
            <span>Sending…</span>
          ) : (
            <>
              <span>Send me a sign-in code</span>
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

      <p className="mt-9 font-section font-semibold uppercase tracking-[0.1em] text-[0.625rem] text-au-white/45">
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

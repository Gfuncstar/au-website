/**
 * /forgot-password — member enters email, Supabase sends a reset
 * link to /api/auth/callback?next=/reset-password.
 *
 * Always shows a success state after submit, even if the email isn't
 * on file. Account-enumeration safe.
 *
 * Visual: matches /login (charcoal + pink, portrait pane on lg).
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type FormEvent } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Enter your email.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
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
      setSent(true);
      setSubmitting(false);
    } catch {
      setError("Network error. Check your connection and try again.");
      setSubmitting(false);
    }
  }

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
            href="/login"
            className="font-section font-semibold uppercase tracking-[0.1em] text-[0.6875rem] text-au-white/55 hover:text-au-pink transition-colors"
          >
            ← Back to sign in
          </Link>
        </header>

        <div className="flex-1 flex items-center pt-10 lg:pt-0 max-w-[520px]">
          <div className="w-full">
            <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.75rem] text-au-pink mb-5">
              Reset password
            </p>

            {sent ? (
              <>
                <h1
                  className="font-display font-black text-au-white leading-[0.95] mb-5"
                  style={{
                    fontSize: "clamp(2.25rem, 6.5vw, 4.5rem)",
                    letterSpacing: "var(--tracking-tight-display)",
                  }}
                >
                  Check your inbox.
                </h1>
                <p className="text-au-white/70 text-[1rem] sm:text-[1.0625rem] leading-relaxed max-w-[44ch] mb-9">
                  If <span className="font-bold text-au-white">{email}</span> is
                  on file, we&apos;ve sent you a link to reset your password.
                  The link expires in an hour.
                </p>
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-2 bg-au-pink hover:bg-au-white text-au-charcoal font-display font-bold uppercase tracking-[0.05em] rounded-[5px] px-7 sm:px-8 py-3.5 sm:py-4 min-h-[48px] text-[0.875rem] sm:text-[0.9375rem] transition-colors"
                >
                  <span>Back to sign in</span>
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </>
            ) : (
              <>
                <h1
                  className="font-display font-black text-au-white leading-[0.95] mb-5"
                  style={{
                    fontSize: "clamp(2.25rem, 6.5vw, 4.5rem)",
                    letterSpacing: "var(--tracking-tight-display)",
                  }}
                >
                  Forgotten password?
                </h1>
                <p className="text-au-white/70 text-[1rem] sm:text-[1.0625rem] leading-relaxed max-w-[44ch] mb-9">
                  Enter the email you signed up with. We&apos;ll send you a
                  link to set a new one.
                </p>

                <form onSubmit={onSubmit} className="space-y-7" noValidate>
                  <label className="block" htmlFor="forgot-email">
                    <span className="block font-section font-semibold uppercase tracking-[0.12em] text-[0.7rem] text-au-white/55 mb-2">
                      Email address
                    </span>
                    <div className="relative flex items-center border-b-2 border-au-pink/40 focus-within:border-au-pink transition-colors">
                      <input
                        id="forgot-email"
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
                        <span>Send reset link</span>
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
              </>
            )}
          </div>
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

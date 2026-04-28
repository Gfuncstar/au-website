/**
 * /login — dark-mode sign-in for AU members.
 *
 * Three states swapped client-side:
 *   1. signin       → email + password fields (primary path)
 *   2. forgot       → email-only reset form (when user clicks "Forgot password?")
 *   3. sent         → "Check your inbox" confirmation (after either flow submits)
 *
 * Visual: charcoal full-screen, pink accents, white type — deliberately
 * different from the rest of the marketing site so members feel they've
 * stepped through a doorway into the private portal.
 *
 * Auth wiring (v1): server-action calls Supabase Auth's password sign-in
 * (or sends a reset email for the forgot flow). At v0 (now), the demo
 * accepts any credentials and routes to /members. Magic-link is offered
 * as a secondary "no password needed" alternative.
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type Mode = "signin" | "forgot" | "sent-magic" | "sent-reset";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function onSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setSubmitting(true);
    // Demo: accept anything, route to /members.
    setTimeout(() => {
      router.push("/members");
    }, 500);
  }

  function onSendMagicLink() {
    if (!email.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setMode("sent-magic");
      setSubmitting(false);
    }, 500);
  }

  function onForgotSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setMode("sent-reset");
      setSubmitting(false);
    }, 500);
  }

  return (
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-[1.1fr_1fr] bg-au-charcoal text-au-white">
      {/* ============================================================
          Left — the form
          ============================================================ */}
      <section className="relative flex flex-col justify-between px-7 sm:px-12 lg:px-16 py-8 lg:py-14 min-h-[80vh] lg:min-h-screen">
        <header className="flex items-center justify-between">
          <Link href="/" aria-label="Aesthetics Unlocked — home">
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

        {/* Vertical AESTHETICS UNLOCKED® mark, low-opacity */}
        <span
          aria-hidden="true"
          className="hidden lg:inline-block absolute right-6 top-1/2 -translate-y-1/2 text-vertical font-section font-semibold uppercase tracking-[0.3em] text-[0.7rem] text-au-white/15"
        >
          AESTHETICS UNLOCKED®
        </span>

        <div className="flex-1 flex items-center pt-10 lg:pt-0 max-w-[520px]">
          {mode === "signin" && (
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
                Welcome back. Sign in with your email and password — or send
                yourself a one-time link.
              </p>

              <form onSubmit={onSignIn} className="space-y-7">
                <DarkField
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@yourclinic.co.uk"
                  required
                />

                <DarkField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  required
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="font-section font-semibold uppercase tracking-[0.1em] text-[0.625rem] text-au-white/55 hover:text-au-pink transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  }
                />

                <div className="flex items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group inline-flex items-center justify-center gap-2 bg-au-pink hover:bg-au-white text-au-charcoal hover:text-au-charcoal font-display font-bold uppercase tracking-[0.05em] rounded-[5px] px-7 sm:px-8 py-3.5 sm:py-4 min-h-[48px] text-[0.875rem] sm:text-[0.9375rem] transition-colors disabled:opacity-50"
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
                    onClick={() => setMode("forgot")}
                    className="font-section font-semibold uppercase tracking-[0.1em] text-[0.6875rem] text-au-white/65 hover:text-au-pink transition-colors min-h-[44px] inline-flex items-center"
                  >
                    Forgot password?
                  </button>
                </div>
              </form>

              {/* Divider + magic-link alt */}
              <div className="mt-10 flex items-center gap-4">
                <span className="flex-1 h-px bg-au-white/15" />
                <span className="font-section font-semibold uppercase tracking-[0.15em] text-[0.625rem] text-au-white/45">
                  or
                </span>
                <span className="flex-1 h-px bg-au-white/15" />
              </div>

              <button
                type="button"
                onClick={onSendMagicLink}
                disabled={!email.trim() || submitting}
                className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-au-white/25 hover:border-au-pink hover:text-au-pink font-section font-semibold uppercase tracking-[0.1em] rounded-[5px] px-6 py-3 min-h-[44px] text-[0.75rem] text-au-white/85 transition-colors disabled:opacity-40"
                title={!email.trim() ? "Enter your email first" : "Send me a one-time sign-in link"}
              >
                Send me a magic login link instead →
              </button>

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
          )}

          {mode === "forgot" && (
            <div className="w-full">
              <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.75rem] text-au-pink mb-5">
                Reset password
              </p>
              <h1
                className="font-display font-black text-au-white leading-[0.95] mb-5"
                style={{
                  fontSize: "clamp(2.25rem, 6.5vw, 4.5rem)",
                  letterSpacing: "var(--tracking-tight-display)",
                }}
              >
                Reset your password.
              </h1>
              <p className="text-au-white/70 text-[1rem] sm:text-[1.0625rem] leading-relaxed max-w-[44ch] mb-9">
                Enter the email on your account and we&apos;ll send you a link
                to set a new password. The link expires in 30 minutes.
              </p>

              <form onSubmit={onForgotSubmit} className="space-y-7">
                <DarkField
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@yourclinic.co.uk"
                  required
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
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

                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="font-section font-semibold uppercase tracking-[0.1em] text-[0.6875rem] text-au-white/65 hover:text-au-pink transition-colors min-h-[44px] inline-flex items-center"
                  >
                    ← Back to sign in
                  </button>
                </div>
              </form>
            </div>
          )}

          {(mode === "sent-magic" || mode === "sent-reset") && (
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
                Check your inbox.
              </h1>
              <p className="text-au-white/70 text-[1rem] sm:text-[1.0625rem] leading-relaxed max-w-[44ch] mb-8">
                {mode === "sent-magic"
                  ? "We've sent a one-time sign-in link to "
                  : "We've sent a password reset link to "}
                <span className="font-bold text-au-white">
                  {email || "your inbox"}
                </span>
                . It expires in {mode === "sent-magic" ? "15" : "30"} minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                <Link
                  href="/members"
                  className="group inline-flex items-center gap-2 bg-au-pink hover:bg-au-white text-au-charcoal font-display font-bold uppercase tracking-[0.05em] rounded-[5px] px-7 sm:px-8 py-3.5 sm:py-4 min-h-[48px] text-[0.875rem] sm:text-[0.9375rem] transition-colors"
                >
                  <span>Demo · enter dashboard</span>
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setPassword("");
                  }}
                  className="font-section font-semibold uppercase tracking-[0.1em] text-[0.75rem] text-au-white/65 hover:text-au-pink transition-colors min-h-[48px] inline-flex items-center"
                >
                  ← Back to sign in
                </button>
              </div>
            </div>
          )}
        </div>

        <footer className="mt-10 lg:mt-0 font-section font-semibold uppercase tracking-[0.1em] text-[0.625rem] text-au-white/45">
          Beauty &amp; Aesthetics Awards · Educator of the Year 2026 Nominee
        </footer>
      </section>

      {/* ============================================================
          Right — editorial portrait, hidden on mobile
          ============================================================ */}
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

/* ============================================================
   DarkField — input styled for the dark login surface.
   Transparent bg + 2px pink underline that brightens on focus.
   ============================================================ */
function DarkField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  trailing,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block font-section font-semibold uppercase tracking-[0.12em] text-[0.7rem] text-au-white/55 mb-2">
        {label}
      </span>
      <div className="relative flex items-center border-b-2 border-au-pink/40 focus-within:border-au-pink transition-colors">
        <input
          type={type}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border-0 focus:outline-none text-[1.0625rem] sm:text-[1.125rem] py-3 text-au-white placeholder:text-au-white/30"
        />
        {trailing && <span className="shrink-0 ml-3">{trailing}</span>}
      </div>
    </label>
  );
}

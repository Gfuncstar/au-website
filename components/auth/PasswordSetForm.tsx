/**
 * Shared password-set form. Used by /reset-password (existing member
 * forgot password) and /set-password (first-time / migrated member).
 *
 * Submits to /api/auth/update-password which calls supabase.auth
 * .updateUser. The recovery session was established by /api/auth/
 * callback when the user clicked the email link.
 *
 * After success, hard-navigates to /login with a notice flag so the
 * sign-in page shows "Password set, sign in below."
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type FormEvent } from "react";

const MIN_PASSWORD_LENGTH = 10;

interface Props {
  /** Eyebrow label, e.g. "Reset password" or "Set password" */
  eyebrow: string;
  /** Big h1 line, e.g. "Choose a new password." */
  heading: string;
  /** Sub-text under the heading. */
  intro: string;
  /** "password_reset" or "password_set" — drives the toast on /login. */
  noticeFlag: "password_reset" | "password_set";
}

export function PasswordSetForm({
  eyebrow,
  heading,
  intro,
  noticeFlag,
}: Props) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Use at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        if (json.error === "no_session") {
          window.location.href = "/forgot-password";
          return;
        }
        setError(
          json.error === "password_too_short"
            ? `Use at least ${MIN_PASSWORD_LENGTH} characters.`
            : json.error === "auth_not_configured"
              ? "Password change isn't configured yet, please email hello@aunlock.co.uk."
              : "Something went wrong. Try again in a moment.",
        );
        setSubmitting(false);
        return;
      }
      // Sign the recovery session out and bounce to /login so the
      // member signs in fresh with the new password.
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = `/login?notice=${noticeFlag}`;
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
              {eyebrow}
            </p>
            <h1
              className="font-display font-black text-au-white leading-[0.95] mb-5"
              style={{
                fontSize: "clamp(2.25rem, 6.5vw, 4.5rem)",
                letterSpacing: "var(--tracking-tight-display)",
              }}
            >
              {heading}
            </h1>
            <p className="text-au-white/70 text-[1rem] sm:text-[1.0625rem] leading-relaxed max-w-[44ch] mb-9">
              {intro}
            </p>

            <form onSubmit={onSubmit} className="space-y-7" noValidate>
              <label className="block" htmlFor="new-password">
                <span className="block font-section font-semibold uppercase tracking-[0.12em] text-[0.7rem] text-au-white/55 mb-2">
                  New password
                </span>
                <div className="relative flex items-center border-b-2 border-au-pink/40 focus-within:border-au-pink transition-colors">
                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                    className="w-full bg-transparent border-0 focus:outline-none text-[1.0625rem] sm:text-[1.125rem] py-3 text-au-white placeholder:text-au-white/30"
                  />
                </div>
              </label>

              <label className="block" htmlFor="confirm-password">
                <span className="block font-section font-semibold uppercase tracking-[0.12em] text-[0.7rem] text-au-white/55 mb-2">
                  Confirm password
                </span>
                <div className="relative flex items-center border-b-2 border-au-pink/40 focus-within:border-au-pink transition-colors">
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                    value={confirm}
                    onChange={(e) => {
                      setConfirm(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Type it again"
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
                  <span>Saving…</span>
                ) : (
                  <>
                    <span>Save password</span>
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

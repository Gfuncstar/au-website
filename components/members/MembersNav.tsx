/**
 * MembersNav — persistent navigation for the dashboard.
 *
 * Charcoal chrome, white text, pink active state. Inverts the marketing
 * site's light voice into a dashboard-leaning "operator console" feel
 * while staying in the AU brand palette (no new colours).
 *
 * Desktop ≥ lg : 240px fixed left rail.
 * Below lg     : top bar with hamburger that pops a slide-down drawer.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { initials } from "@/lib/format";

type NavItem = {
  href: string;
  label: string;
};

const NAV: NavItem[] = [
  { href: "/members", label: "Dashboard" },
  { href: "/members/courses", label: "My courses" },
  { href: "/members/account", label: "Account" },
  { href: "/members/billing", label: "Billing" },
  { href: "/members/activity", label: "Activity" },
];

interface MembersNavProps {
  firstName: string;
  lastName: string;
  email: string;
}

export function MembersNav({ firstName, lastName, email }: MembersNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const fullName = `${firstName} ${lastName}`;
  const isActive = (href: string) =>
    href === "/members" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* ============================================================
          Desktop left rail (lg and up)
          ============================================================ */}
      <aside
        aria-label="Account navigation"
        className="hidden lg:flex fixed inset-y-0 left-0 w-[240px] flex-col bg-au-charcoal text-au-white z-30"
      >
        <Link
          href="/"
          className="block px-7 pt-7 pb-8"
          aria-label="Aesthetics Unlocked — back to home"
        >
          <Image
            src="/brand/au-logo-pink-on-dark.png"
            alt="Aesthetics Unlocked"
            width={140}
            height={40}
            className="h-auto w-[140px]"
            priority
          />
          <span className="mt-3 inline-block font-section font-semibold uppercase tracking-[0.18em] text-[0.625rem] text-au-white/55">
            Members area
          </span>
        </Link>

        <nav className="px-3 flex-1">
          <ul className="flex flex-col gap-0.5">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={
                      "group relative flex items-center px-4 py-3 font-section " +
                      "font-semibold uppercase tracking-[0.05em] text-[0.85rem] " +
                      "transition-colors " +
                      (active
                        ? "text-au-pink"
                        : "text-au-white/80 hover:text-au-pink")
                    }
                  >
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-2 bottom-2 w-[3px] bg-au-pink"
                      />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-5 pb-7 pt-5 border-t border-au-white/10">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-[5px] bg-au-pink text-au-charcoal font-section font-semibold text-[0.75rem] tracking-[0.05em]">
              {initials(firstName, lastName)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold text-[0.875rem] text-au-white leading-tight truncate">
                {fullName}
              </p>
              <p className="text-[0.75rem] text-au-white/55 truncate">{email}</p>
            </div>
          </div>
          <Link
            href="/login"
            className="mt-4 inline-block font-section font-semibold uppercase tracking-[0.1em] text-[0.6875rem] text-au-white/55 hover:text-au-pink transition-colors"
          >
            Sign out →
          </Link>
        </div>
      </aside>

      {/* ============================================================
          Mobile top bar (below lg)
          ============================================================ */}
      <header className="lg:hidden sticky top-0 z-30 bg-au-charcoal text-au-white">
        <div className="flex items-center justify-between px-5 py-3.5">
          <Link href="/" aria-label="Aesthetics Unlocked — back to home">
            <Image
              src="/brand/au-logo-pink-on-dark.png"
              alt="Aesthetics Unlocked"
              width={120}
              height={34}
              className="h-auto w-[110px]"
              priority
            />
          </Link>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-[5px] bg-au-pink text-au-charcoal font-section font-semibold text-[0.7rem] tracking-[0.05em]">
              {initials(firstName, lastName)}
            </span>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="members-mobile-menu"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="font-section font-semibold uppercase tracking-[0.1em] text-[0.7rem] text-au-white px-2 py-1"
            >
              {mobileOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav
            id="members-mobile-menu"
            aria-label="Account navigation"
            className="border-t border-au-white/10 bg-au-charcoal"
          >
            <ul className="flex flex-col">
              {NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <li
                    key={item.href}
                    className="border-b border-au-white/10 last:border-b-0"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={
                        "block px-5 py-4 font-section font-semibold uppercase " +
                        "tracking-[0.05em] text-[0.8125rem] " +
                        (active ? "text-au-pink" : "text-au-white")
                      }
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-5 py-4 font-section font-semibold uppercase tracking-[0.1em] text-[0.7rem] text-au-white/55 border-t border-au-white/10"
                >
                  Sign out →
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}

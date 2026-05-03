/**
 * scripts/migrate-members-set-password.ts
 *
 * One-off migration: every existing Aesthetics Unlocked member who has
 * an email on file in Kartra needs a Supabase auth.users row + a
 * password-setup invite, so they can sign in to the new dashboard.
 *
 * What this script does, per email:
 *   1. Tries `admin.createUser({ email, email_confirm: true })`
 *      - If created → send a "set your password" email via
 *        `resetPasswordForEmail` so the link lands at /set-password
 *      - If already registered → skip silently (they already have a
 *        Supabase account, presumably with a password)
 *   2. Throttles to respect Supabase email-send rate limits.
 *
 * What this script does NOT do:
 *   - It doesn't sync memberships rows. Those are handled by
 *     `scripts/backfill-memberships.ts` (run AFTER members have signed
 *     in and their `members` row exists).
 *   - It doesn't pull from Kartra's API. It reads emails from a CSV
 *     so you can pre-filter (e.g. paid customers only) before running.
 *
 * --------------------------------------------------------------
 * USAGE
 * --------------------------------------------------------------
 *   1. Export the right Kartra audience to CSV (e.g. "All Customers"
 *      or a specific tag-segment). Only the `email` column is used.
 *   2. Save anywhere, e.g. `~/Downloads/au-members.csv`
 *   3. Set required env in .env.local:
 *        NEXT_PUBLIC_SUPABASE_URL
 *        NEXT_PUBLIC_SUPABASE_ANON_KEY
 *        SUPABASE_SERVICE_ROLE_KEY
 *        AU_PUBLIC_BASE_URL  (e.g. https://aestheticsunlocked.co.uk)
 *   4. Dry-run first to count and spot bad rows:
 *        npx tsx scripts/migrate-members-set-password.ts <csv> --dry-run
 *   5. Real run:
 *        npx tsx scripts/migrate-members-set-password.ts <csv>
 *
 * --------------------------------------------------------------
 * RATE LIMITS — IMPORTANT
 * --------------------------------------------------------------
 * Supabase's built-in SMTP caps password-reset emails at ~30/hour
 * (sometimes lower). For more than a handful of members, switch the
 * Supabase project to **custom SMTP** (Resend, Postmark, SES) before
 * running. Otherwise the script will appear to succeed but silently
 * drop most emails on the floor.
 *
 * The default throttle below is 1.5s/email. Bump up if you see 429s.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

type CliOptions = {
  csvPath: string;
  dryRun: boolean;
  throttleMs: number;
  limit: number | null;
};

function parseArgs(argv: string[]): CliOptions {
  const args = argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const throttleArg = args.find((a) => a.startsWith("--throttle="));
  const throttleMs = throttleArg ? Number(throttleArg.split("=")[1]) : 1500;
  const limitArg = args.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : null;
  const csvPath = args.find((a) => !a.startsWith("--"));
  if (!csvPath) {
    console.error(
      "Usage: npx tsx scripts/migrate-members-set-password.ts <csv-path> [--dry-run] [--throttle=1500] [--limit=N]",
    );
    process.exit(1);
  }
  return { csvPath: path.resolve(csvPath), dryRun, throttleMs, limit };
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing required env var: ${name}.`);
    process.exit(1);
  }
  return v;
}

async function readEmails(csvPath: string): Promise<string[]> {
  const raw = await fs.readFile(csvPath, "utf8");
  const lines = raw.replace(/^﻿/, "").split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const header = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/"/g, "").toLowerCase());
  const emailIdx = header.findIndex(
    (h) => h === "email" || h === "lead_email",
  );
  if (emailIdx === -1) {
    console.error(
      `No "email" column found in ${csvPath}. Header was: ${header.join(",")}`,
    );
    process.exit(1);
  }

  const emails: string[] = [];
  for (const line of lines.slice(1)) {
    const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    const email = cols[emailIdx]?.toLowerCase();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) emails.push(email);
  }
  return Array.from(new Set(emails));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function loadDotEnv() {
  try {
    const envPath = path.resolve(".env.local");
    const envRaw = await fs.readFile(envPath, "utf8");
    for (const line of envRaw.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^"|"$/g, "");
      }
    }
  } catch {
    // .env.local missing is fine.
  }
}

async function main() {
  const opts = parseArgs(process.argv);
  await loadDotEnv();

  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const baseUrl = requireEnv("AU_PUBLIC_BASE_URL").replace(/\/$/, "");

  const admin = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const anon = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const allEmails = await readEmails(opts.csvPath);
  const emails =
    opts.limit !== null ? allEmails.slice(0, opts.limit) : allEmails;
  console.log(
    `Loaded ${allEmails.length} unique email(s)` +
      (opts.limit !== null ? ` (limited to ${emails.length})` : "") +
      (opts.dryRun ? " — DRY RUN, no writes" : ""),
  );

  const redirectTo = `${baseUrl}/api/auth/callback?next=/set-password`;

  let created = 0;
  let alreadyExisted = 0;
  let emailFailed = 0;
  let createFailed = 0;

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    const prefix = `[${i + 1}/${emails.length}] ${email}`;

    if (opts.dryRun) {
      console.log(`${prefix}  would create + email`);
      continue;
    }

    const { error: createErr } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
    });

    if (createErr) {
      const msg = createErr.message.toLowerCase();
      if (msg.includes("already")) {
        console.log(`${prefix}  ↷ already registered, skipped`);
        alreadyExisted++;
        await sleep(opts.throttleMs);
        continue;
      }
      console.log(`${prefix}  ✗ create failed: ${createErr.message}`);
      createFailed++;
      await sleep(opts.throttleMs);
      continue;
    }

    const { error: emailErr } = await anon.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (emailErr) {
      console.log(`${prefix}  ⚠ created, email failed: ${emailErr.message}`);
      emailFailed++;
    } else {
      console.log(`${prefix}  ✓ created + emailed`);
      created++;
    }

    await sleep(opts.throttleMs);
  }

  console.log("\n────────────────────────────────────────");
  console.log(`Total emails processed:        ${emails.length}`);
  console.log(`Newly created + emailed:       ${created}`);
  console.log(`Already registered (skipped):  ${alreadyExisted}`);
  console.log(`Created but email failed:      ${emailFailed}`);
  console.log(`Failed to create:              ${createFailed}`);
  console.log("────────────────────────────────────────");
  if (emailFailed > 0) {
    console.log(
      "\nNote: rows that created but failed to email can be retried by " +
        "running the script again — already-registered users are skipped, " +
        "so they won't be re-emailed unless you trigger /forgot-password " +
        "from the website manually.",
    );
  }
}

main().catch((err) => {
  console.error("\nFatal error:", err);
  process.exit(1);
});

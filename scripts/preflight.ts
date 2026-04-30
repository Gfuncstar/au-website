/**
 * scripts/preflight.ts
 *
 * Go / no-go check for launch day. Runs every load-bearing dependency
 * and prints a coloured ✓ / ✗ checklist. Exit 0 if every check passes;
 * exit 1 if anything fails. Intended to be run as the very last step
 * before declaring launch complete.
 *
 * USAGE
 *   npx tsx scripts/preflight.ts
 *
 * Or after `npm run preflight` is wired in package.json (suggested):
 *   "scripts": { "preflight": "tsx scripts/preflight.ts" }
 *
 * What's checked:
 *   1. Required env vars present
 *   2. Supabase reachable + service-role key valid
 *   3. `members`, `memberships`, `pending_memberships` tables exist
 *   4. Kartra credentials valid (probe by lookup of Bernadette's email)
 *   5. Production website returns 200 (HTTP)
 *   6. /api/kartra/ipn rejects unauthenticated calls (returns 401)
 *
 * Reads ENV directly. Run with the production env loaded into shell
 * (e.g. `vercel env pull .env.production` first, then export them) OR
 * locally against `.env.local`.
 */

import { createClient } from "@supabase/supabase-js";

type CheckResult = { name: string; ok: boolean; detail: string };

const ANSI = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  dim: "\x1b[2m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

const PROD_HOST =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://au-website-one.vercel.app";

async function check(
  name: string,
  fn: () => Promise<{ ok: boolean; detail: string } | string | void>,
): Promise<CheckResult> {
  try {
    const res = await fn();
    if (typeof res === "string") return { name, ok: true, detail: res };
    if (!res) return { name, ok: true, detail: "" };
    return { name, ok: res.ok, detail: res.detail };
  } catch (err) {
    return {
      name,
      ok: false,
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}

async function main() {
  const checks: CheckResult[] = [];

  /* -----------------------------------------------------------
     1. Env-var presence — fail fast if anything is missing
  ----------------------------------------------------------- */
  const envVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "KARTRA_APP_ID",
    "KARTRA_API_KEY",
    "KARTRA_API_PASSWORD",
    "KARTRA_IPN_SECRET",
  ];
  for (const v of envVars) {
    checks.push(
      await check(`env: ${v}`, async () => {
        const val = process.env[v];
        if (!val) return { ok: false, detail: "missing" };
        return { ok: true, detail: `set (${val.length} chars)` };
      }),
    );
  }
  // Optional but recommended
  for (const v of ["NEXT_PUBLIC_PLAUSIBLE_DOMAIN", "AU_PREVIEW_TOKEN"]) {
    checks.push(
      await check(`env (optional): ${v}`, async () => {
        const val = process.env[v];
        return val
          ? { ok: true, detail: `set (${val.length} chars)` }
          : { ok: true, detail: "unset (optional)" };
      }),
    );
  }

  /* -----------------------------------------------------------
     2. Supabase admin client + table existence
  ----------------------------------------------------------- */
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceRole) {
    const admin = createClient(supabaseUrl, serviceRole, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    for (const table of ["members", "memberships", "pending_memberships"]) {
      checks.push(
        await check(`supabase: table ${table}`, async () => {
          const { error, count } = await admin
            .from(table)
            .select("*", { count: "exact", head: true });
          if (error) return { ok: false, detail: error.message };
          return { ok: true, detail: `exists (rows: ${count ?? "?"})` };
        }),
      );
    }
  } else {
    checks.push({
      name: "supabase: admin client",
      ok: false,
      detail: "Supabase env vars missing — skipping table checks",
    });
  }

  /* -----------------------------------------------------------
     3. Kartra credentials valid
  ----------------------------------------------------------- */
  const kartraConfigured =
    !!process.env.KARTRA_APP_ID &&
    !!process.env.KARTRA_API_KEY &&
    !!process.env.KARTRA_API_PASSWORD;

  if (kartraConfigured) {
    checks.push(
      await check("kartra: credentials valid (probe)", async () => {
        const body = new URLSearchParams({
          app_id: process.env.KARTRA_APP_ID!,
          api_key: process.env.KARTRA_API_KEY!,
          api_password: process.env.KARTRA_API_PASSWORD!,
          "get_lead[email]": "ber.parsons@outlook.com",
        });
        const res = await fetch("https://app.kartra.com/api/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        });
        if (!res.ok) {
          return { ok: false, detail: `HTTP ${res.status}` };
        }
        const json = (await res.json()) as { status?: string; message?: string };
        if (json.status === "Success") {
          return { ok: true, detail: "Kartra responded Success" };
        }
        return {
          ok: false,
          detail: `Kartra status=${json.status} message=${json.message ?? ""}`,
        };
      }),
    );
  }

  /* -----------------------------------------------------------
     4. Production website 200
  ----------------------------------------------------------- */
  for (const path of ["/", "/courses", "/login"]) {
    checks.push(
      await check(`prod: GET ${path}`, async () => {
        const res = await fetch(`${PROD_HOST}${path}`, { redirect: "manual" });
        return res.ok || res.status === 200
          ? { ok: true, detail: `HTTP ${res.status}` }
          : { ok: false, detail: `HTTP ${res.status}` };
      }),
    );
  }

  /* -----------------------------------------------------------
     5. /members gated (expect 307 → /login)
  ----------------------------------------------------------- */
  checks.push(
    await check("prod: /members redirects when unauthenticated", async () => {
      const res = await fetch(`${PROD_HOST}/members`, { redirect: "manual" });
      if (res.status === 307 || res.status === 302) {
        return { ok: true, detail: `HTTP ${res.status} (redirect)` };
      }
      return { ok: false, detail: `expected 307, got ${res.status}` };
    }),
  );

  /* -----------------------------------------------------------
     6. /api/kartra/ipn rejects unauthenticated POST (401)
  ----------------------------------------------------------- */
  checks.push(
    await check("prod: /api/kartra/ipn rejects unauthenticated", async () => {
      const res = await fetch(`${PROD_HOST}/api/kartra/ipn`, {
        method: "POST",
      });
      return res.status === 401
        ? { ok: true, detail: "401 unauthorized (expected)" }
        : {
            ok: false,
            detail: `expected 401 (KARTRA_IPN_SECRET set), got ${res.status}`,
          };
    }),
  );

  /* -----------------------------------------------------------
     Print
  ----------------------------------------------------------- */
  const passed = checks.filter((c) => c.ok).length;
  const failed = checks.length - passed;

  console.log(`\n${ANSI.bold}Aesthetics Unlocked — preflight${ANSI.reset}\n`);
  for (const c of checks) {
    const mark = c.ok ? `${ANSI.green}✓${ANSI.reset}` : `${ANSI.red}✗${ANSI.reset}`;
    const colour = c.ok ? "" : ANSI.red;
    console.log(`  ${mark} ${colour}${c.name}${ANSI.reset}  ${ANSI.dim}${c.detail}${ANSI.reset}`);
  }

  console.log(
    `\n${passed}/${checks.length} passed${failed ? `, ${ANSI.red}${failed} failed${ANSI.reset}` : ""}.\n`,
  );

  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});

/**
 * Server-side Supabase client for use in Server Components, Server
 * Actions and Route Handlers. Reads the session cookie and lets
 * `auth.getUser()` resolve the signed-in user.
 *
 * Returns null when env vars are missing — callers should treat that
 * as "auth is not configured yet, run mock-mode".
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "./env";

/** One year, in seconds. Long enough that members effectively stay
 *  signed in until they explicitly sign out. The matching value also
 *  lives in middleware.ts — keep them in sync. */
const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured()) return null;
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, {
              ...options,
              // Override Supabase's default cookie lifetime so the
              // browser keeps the auth cookie around long enough that
              // members "stay signed in until they sign out". The
              // refresh-token TTL on the Supabase project also needs
              // to match (set in the Supabase dashboard).
              maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
            });
          }
        } catch {
          // setAll fails inside Server Components — that's expected.
          // Middleware refreshes the cookies separately.
        }
      },
    },
  });
}

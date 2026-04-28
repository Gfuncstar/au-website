/**
 * Root middleware — protects /members/* and refreshes Supabase session
 * cookies on every request so the SSR Server Components see a fresh
 * session.
 *
 * Behaviour:
 *   - If Supabase env vars are missing → middleware is a no-op (MOCK
 *     mode keeps working in dev / on previews).
 *   - If Supabase IS configured AND the request is to /members/* AND
 *     no session is found → redirect to /login?next=<original-path>.
 *   - Otherwise → just refresh cookies and let the request through.
 *
 * The entitlement check (does this signed-in member own this course?)
 * runs server-side in the page itself, not here. Middleware only does
 * "is the user signed in at all".
 */

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "@/lib/supabase/env";

const PROTECTED_PREFIX = "/members";

export async function middleware(request: NextRequest) {
  // No env vars → MOCK mode. Let everything through unmodified.
  if (!isSupabaseConfigured()) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Refresh the session if expired — required for SSR.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  if (path.startsWith(PROTECTED_PREFIX) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match every path except:
     *   - _next/static + _next/image (Next internals)
     *   - favicon, robots.txt, sitemap.xml, opengraph images
     *   - api/* (route handlers manage their own auth where relevant)
     *
     * We still need middleware to run on non-/members paths so the
     * session cookie refreshes anywhere the user navigates.
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|opengraph-image|api/).*)",
  ],
};

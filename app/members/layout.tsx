/**
 * Members area layout — wraps every /members/* page.
 *
 * Renders the persistent nav (charcoal left rail on desktop / sticky top
 * bar on mobile) and the content shell. Each page renders its own
 * MembersStatusStrip so the strip's position is page-specific:
 *   - dashboard home → greeting first, strip below
 *   - everywhere else → strip directly under the page label
 *
 * Auth: at v0 the dashboard runs against MOCK_LEAD with no real session
 * gating. When Supabase Auth is wired in, this layout is where the
 * server-side getUser() check + redirect-to-/login lives.
 */

import type { Metadata } from "next";
import { kartra } from "@/lib/kartra/client";
import { MembersNav } from "@/components/members/MembersNav";
import { Footer } from "@/components/Footer";

/** Until Supabase Auth + the Kartra entitlement gate are wired, the
 *  members area runs against MOCK_LEAD with no session check — anyone
 *  with the URL can read paid course content. Disallow indexing on
 *  the entire `/members/*` tree so Google doesn't crawl it before
 *  the auth wiring lands. */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lead = await kartra.getLead("");
  if (!lead) {
    // Real wiring will redirect to /login. For the demo we always have a lead.
    return null;
  }

  return (
    <div className="min-h-screen bg-au-white text-au-body">
      <MembersNav
        firstName={lead.first_name}
        lastName={lead.last_name}
        email={lead.email}
      />
      <main className="lg:pl-[240px]">
        <div className="px-4 sm:px-8 lg:px-12 pt-5 sm:pt-8 lg:pt-10 pb-12 lg:pb-16 max-w-[1100px]">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Permanent 301 redirects.
   *
   * Catches stale URLs from already-sent broadcasts, social posts, and
   * any deep-links that linger after the launch DNS flip from Kartra
   * hosting → this Next.js app. Add new entries here as Bernadette
   * remembers them, or as 404s show up in Plausible.
   */
  async redirects() {
    return [
      // Kartra-hosted member portal → new members area
      { source: "/portal", destination: "/members", permanent: true },
      { source: "/portal/:path*", destination: "/members/:path*", permanent: true },

      // Common Kartra-page slug patterns
      { source: "/login-page", destination: "/login", permanent: true },
      { source: "/sign-in", destination: "/login", permanent: true },
      { source: "/signin", destination: "/login", permanent: true },

      // Free taster legacy paths (Kartra default URLs sometimes used "free-X" without "courses/")
      { source: "/free-acne-decoded", destination: "/courses/free-acne-decoded", permanent: true },
      { source: "/free-rosacea-beyond-redness", destination: "/courses/free-rosacea-beyond-redness", permanent: true },
      { source: "/free-skin-specialist-mini", destination: "/courses/free-skin-specialist-mini", permanent: true },
      { source: "/free-2-day-rag", destination: "/courses/free-2-day-rag", permanent: true },
      { source: "/free-3-day-startup", destination: "/courses/free-3-day-startup", permanent: true },

      // Misspellings caught in past traffic / brand audit
      { source: "/aestetics", destination: "/about", permanent: true },
      { source: "/aestethics", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;

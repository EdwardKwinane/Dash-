import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Seeded demo imagery is hosted on Unsplash. Production should replace
    // these URLs with a catalogue-owned CDN.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  // The dev server only trusts the hostname it started on (`localhost`).
  // Playwright and `curl` use 127.0.0.1, so allow that origin explicitly;
  // otherwise dev-only asset requests are rejected and React never hydrates.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;

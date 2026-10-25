import type { Config } from "tailwindcss";

/**
 * Dash# design system tokens.
 * Canonical reference: engineering-os/DESIGN_SYSTEM.md
 * Visual rules: pure white canvas (#FFFFFF), #F9FAFB only for contained surfaces,
 * purple reserved for CTAs/active states/focus/links, 8px radii, pill badges.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#A855F7",
          hover: "#9333EA",
        },
        ink: {
          DEFAULT: "#0A0A0A",
          muted: "#52525B",
        },
        surface: "#F9FAFB",
        line: "#E5E7EB",
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
      },
      maxWidth: {
        content: "1440px",
      },
      borderRadius: {
        card: "8px",
        pill: "9999px",
      },
      keyframes: {
        // Navigation menu panels (navbar2): fade and settle over ~200ms.
        "menu-reveal": {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "menu-reveal": "menu-reveal 200ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;

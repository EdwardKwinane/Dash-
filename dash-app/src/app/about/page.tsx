import { InfoPage } from "@/components/layout/info-page";

export const metadata = { title: "About | Dash#" };

export default function AboutPage() {
  return (
    <InfoPage
      title="About Dash#"
      intro="Dash# is a multi-brand electronics retailer concept built for the South African market."
      sections={[
        {
          heading: "What this is",
          body: "A working storefront implementation: catalogue, product detail pages, cart, demo checkout and a shared design system. It is built as a portfolio-grade reference, not a live trading business.",
        },
        {
          heading: "What drives the catalogue",
          body: "Products are seeded sample records with realistic South African pricing in ZAR. Each record carries a SKU, stock level and specifications, and the same record is used by listings, product pages, the cart and the recommendation logic.",
        },
        {
          heading: "How it is built",
          body: "Next.js with TypeScript, a token-based Tailwind design system and server-enforced stock and price rules. Commerce, payment and AI services are integrated in later phases.",
        },
      ]}
    />
  );
}

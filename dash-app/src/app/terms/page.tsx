import { InfoPage } from "@/components/layout/info-page";

export const metadata = { title: "Terms | Dash#" };

export default function TermsPage() {
  return (
    <InfoPage
      title="Terms of use"
      intro="Dash# is a demonstration application provided for evaluation purposes."
      sections={[
        {
          heading: "No commercial offer",
          body: "Nothing in this application constitutes an offer to sell. Prices, stock levels, ratings and reviews are seeded sample data and may be inaccurate or out of date.",
        },
        {
          heading: "No transactions",
          body: "Orders placed through the demo checkout do not create a contract, take payment or reserve stock.",
        },
        {
          heading: "Use of the demonstration",
          body: "You may explore the storefront freely. Do not treat any content here as professional, legal or financial advice.",
        },
      ]}
    />
  );
}

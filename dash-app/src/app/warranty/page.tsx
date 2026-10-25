import { InfoPage } from "@/components/layout/info-page";

export const metadata = { title: "Warranty | Dash#" };

export default function WarrantyPage() {
  return (
    <InfoPage
      title="Warranty"
      intro="Warranty terms shown on product pages are sample catalogue attributes."
      sections={[
        {
          heading: "Where the text comes from",
          body: "Each seeded product may include a warranty line as part of its record. These are illustrative values describing the kind of information the catalogue supports, not an offer from Dash#.",
        },
        {
          heading: "Real coverage",
          body: "Any genuine warranty would come from the manufacturer or the retailer that sold the device. No warranty service is provided or administered here.",
        },
      ]}
    />
  );
}

import { InfoPage } from "@/components/layout/info-page";

export const metadata = { title: "Returns & Refunds | Dash#" };

export default function ReturnsPage() {
  return (
    <InfoPage
      title="Returns & refunds"
      intro="No returns or refunds are processed in this build."
      sections={[
        {
          heading: "Why",
          body: "Because no payment is captured and no goods are dispatched, there is nothing to return and no refund path exists in the application.",
        },
        {
          heading: "Designed for later",
          body: "Order state is modelled so a return lifecycle can be added without reworking the catalogue or cart, but that workflow is not implemented.",
        },
      ]}
    />
  );
}

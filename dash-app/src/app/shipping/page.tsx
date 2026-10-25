import { InfoPage } from "@/components/layout/info-page";

export const metadata = { title: "Shipping & Delivery | Dash#" };

export default function ShippingPage() {
  return (
    <InfoPage
      title="Shipping & delivery"
      intro="This build does not ship physical products."
      sections={[
        {
          heading: "Current behaviour",
          body: "Checkout is a demonstration flow. Placing an order clears the cart and shows a reference number; nothing is picked, packed or dispatched.",
        },
        {
          heading: "Delivery estimates",
          body: "The order summary shows a placeholder delivery charge. No courier integration, rate calculation or delivery promise is implemented, so no estimate here should be treated as a commitment.",
        },
        {
          heading: "Next step for production",
          body: "A production rollout requires a fulfilment provider, address validation, live delivery rates and webhook-verified order state.",
        },
      ]}
    />
  );
}

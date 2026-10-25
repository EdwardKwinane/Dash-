import { InfoPage } from "@/components/layout/info-page";

export const metadata = { title: "Privacy | Dash#" };

export default function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy"
      intro="This build collects as little as possible and sends nothing to a third party."
      sections={[
        {
          heading: "What is stored",
          body: "Cart contents are saved in your own browser's local storage so the cart survives a page reload. Checkout form values live in page memory only and are discarded when you leave the page.",
        },
        {
          heading: "What is not stored",
          body: "No account is created, no payment details are requested, and no analytics or advertising scripts are loaded.",
        },
        {
          heading: "Third-party images",
          body: "Product imagery is loaded from a remote image host, which means that host can see the request from your browser.",
        },
      ]}
    />
  );
}

import { InfoPage } from "@/components/layout/info-page";

export const metadata = { title: "Contact | Dash#" };

export default function ContactPage() {
  return (
    <InfoPage
      title="Contact us"
      intro="Support contact details will be published when Dash# opens to customers."
      sections={[
        {
          heading: "During the demo",
          body: "There is no support desk, phone line or email address connected to this build, so messages sent to any address would not be received or answered.",
        },
        {
          heading: "Reporting a problem",
          body: "Issues with the demonstration should be raised through the project repository so they are tracked alongside the code and engineering documentation.",
        },
      ]}
    />
  );
}

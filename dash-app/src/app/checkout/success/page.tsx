import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Demo order confirmation | Dash#",
  robots: { index: false, follow: false },
};

const REFERENCE_PATTERN = /^DASH-DEMO-[A-Z0-9]{6}$/;

type SuccessPageProps = {
  searchParams: Promise<{ ref?: string | string[] }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams;
  const rawReference = Array.isArray(params.ref) ? params.ref[0] : params.ref;
  const reference =
    rawReference && REFERENCE_PATTERN.test(rawReference)
      ? rawReference
      : null;

  if (!reference) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-content px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">
            No demo order found
          </h1>
          <p className="mx-auto mb-8 max-w-md text-ink-muted">
            This confirmation page only appears after completing the demo
            checkout. No order exists and no payment was taken.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="h-auto rounded-card bg-brand px-6 py-3 text-white hover:bg-brand-hover"
            >
              <Link href="/products">Browse products</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto rounded-card border-line px-6 py-3 text-ink hover:bg-surface"
            >
              <Link href="/cart">View cart</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-content px-4 py-16 text-center sm:px-6 lg:px-8">
        <CheckCircle
          className="mx-auto mb-6 h-16 w-16 text-[#15803d]"
          aria-hidden="true"
        />
        <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">
          Demo order confirmed
        </h1>
        <p className="mb-2 text-lg text-ink-muted">
          Your demo checkout completed successfully.
        </p>
        <p className="mb-8 text-ink-muted">
          Demo reference:{" "}
          <span className="font-mono font-medium text-ink">{reference}</span>
        </p>

        <div className="mx-auto mb-8 max-w-md rounded-card border border-line bg-surface p-6 text-left">
          <h2 className="mb-2 text-base font-semibold text-ink">
            What this confirmation means
          </h2>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li>No payment was charged or authorised.</li>
            <li>No order was sent to a server or stored in a database.</li>
            <li>No stock was reserved and no delivery is scheduled.</li>
            <li>No confirmation email was sent.</li>
          </ul>
          <p className="mt-4 text-sm text-ink-muted">
            This reference is a local demonstration identifier, not a payment
            receipt. Refreshing this page keeps the reference because it lives
            in the URL.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            asChild
            className="h-auto rounded-card bg-brand px-6 py-3 text-white hover:bg-brand-hover"
          >
            <Link href="/products">Continue shopping</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-auto rounded-card border-line px-6 py-3 text-ink hover:bg-surface"
          >
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

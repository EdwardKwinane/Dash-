"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

/**
 * Demo order confirmation.
 *
 * The reference arrives as a query parameter from the checkout flow, so the
 * page renders identical markup on the server and client (no Math.random()
 * during render, no hydration mismatch). Nothing here represents a real order.
 */
function OrderReference() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("ref");

  return (
    <span className="font-mono font-medium text-ink">
      {reference ?? "not available"}
    </span>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-content px-4 py-16 text-center sm:px-6 lg:px-8">
        <CheckCircle className="mx-auto mb-6 h-16 w-16 text-green-600" />
        <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">
          Order placed
        </h1>
        <p className="mb-2 text-lg text-ink-muted">Thank you for your order</p>
        <p className="mb-8 text-ink-muted">
          Order reference:{" "}
          <Suspense fallback={<span className="text-ink-muted">…</span>}>
            <OrderReference />
          </Suspense>
        </p>
        <p className="mx-auto mb-8 max-w-md text-ink-muted">
          This is a demo order. No payment was taken, no stock was reserved and
          no confirmation email is sent.
        </p>
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

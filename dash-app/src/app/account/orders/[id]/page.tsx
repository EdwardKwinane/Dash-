import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  await auth.protect();
  // Customer ownership enforcement: every request must verify that the
  // Clerk session user owns the order id server-side (Medusa mapping). Since
  // the Medusa backend does not provide customer/order endpoints in the
  // current scaffold, this route returns the safe unavailable state.
  const orderId = params.id;
  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-brand transition-colors mb-4"
        aria-label="Back to order history"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to orders
      </Link>
      <h1 className="text-3xl font-bold text-ink md:text-4xl">Order details</h1>
      <p className="mt-2 text-ink-muted">
        Order history is not available yet. Place an order on the storefront first; once the commerce backend is connected, this page will display the authenticated order record for your purchase.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center rounded-card border border-line bg-white p-8 text-center">
        <Package className="mb-4 h-10 w-10 text-ink-muted" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-ink">No order found for id: {orderId}</h2>
        <p className="mt-2 text-sm text-ink-muted">This route is currently unsupported. After the backend integration, every customer is authorized to view their own order by the order id they receive at checkout.</p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-block rounded-card bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Back to store
          </Link>
        </div>
      </div>
    </div>
  );
}

import { auth } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { OrderUnavailableState } from "@/components/ui/account-states";

export default async function OrdersPage() {
  await auth.protect();
  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/account"
        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-brand transition-colors mb-6"
        aria-label="Back to account overview"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to account
      </Link>
      <h1 className="text-3xl font-bold text-ink md:text-4xl">Orders</h1>
      <p className="mt-2 text-ink-muted">Order history and tracking will appear here once the commerce backend is connected.</p>
      <div className="mt-8">
        <OrderUnavailableState title="Order history" hint="No orders available yet. This storefront does not have a connected Medusa customer and order service." actionLabel="Back to store" />
      </div>
    </div>
  );
}

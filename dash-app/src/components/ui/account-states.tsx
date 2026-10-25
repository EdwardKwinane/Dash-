import Link from "next/link";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Polished, accessible placeholder for account sections that are not yet
 * connected to a commerce backend (e.g. customer order history when the
 * Medusa backend is not available). Never fabricates data, fulfilment
 * statuses, tracking numbers, or address records.
 */
export function OrderUnavailableState({
  title = "Orders",
  hint,
  actionLabel = "Back to store",
}: {
  title?: string;
  hint?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-line bg-surface p-8 text-center">
      <Package className="mb-4 h-10 w-10 text-ink-muted" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className={cn("mt-2 w-full text-sm text-ink-muted", hint)}>
        {hint ??
          "This feature will show your order history once the customer backend is connected. Customers cannot browse orders from this storefront until the integration is complete."}
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="inline-block rounded-card bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          {actionLabel}
        </Link>
      </div>
    </div>
  );
}



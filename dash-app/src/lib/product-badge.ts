import type { Product } from "@/types/product";

/**
 * Single source of truth for product badges, shared by the product card and
 * the product detail page so both surfaces always agree on the label.
 * Precedence: Sale (discounted) > New > Featured. Products may carry several
 * flags; the most commercially significant is shown, never combined.
 */
export function productBadgeLabel(product: Product): string | null {
  if (product.onSale) return "Sale";
  if (product.newArrival) return "New";
  if (product.featured) return "Featured";
  return null;
}

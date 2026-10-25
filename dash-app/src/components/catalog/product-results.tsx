import Link from "next/link";
import { SearchX } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import type { CatalogQuery } from "@/lib/catalog";
import type { Product } from "@/types/product";

type ProductResultsProps = {
  products: Product[];
  query: CatalogQuery;
  basePath: string;
  /** Shown when the catalogue is empty for a reason other than the query. */
  emptyHint?: string;
};

export function ProductResults({
  products,
  query,
  basePath,
  emptyHint,
}: ProductResultsProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-card border border-line bg-surface px-6 py-14 text-center">
        <SearchX
          className="mx-auto h-10 w-10 text-ink-muted"
          aria-hidden="true"
        />
        <h2 className="mt-4 text-xl font-semibold text-ink">
          No products found
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
          {query.q
            ? `Nothing in the catalogue matches “${query.q}” with the selected filters.`
            : "No products match the selected filters."}
          {emptyHint ? ` ${emptyHint}` : ""}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={basePath}
            className="rounded-card bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-hover"
          >
            Clear search and filters
          </Link>
          <Link
            href="/products"
            className="rounded-card border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface"
          >
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

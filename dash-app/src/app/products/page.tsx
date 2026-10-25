import type { Metadata } from "next";
import { CatalogFilters, CatalogSort } from "@/components/catalog/catalog-controls";
import { ProductResults } from "@/components/catalog/product-results";
import { categories, products } from "@/lib/data/products";
import {
  getBrands,
  parseCatalogQuery,
  queryCatalog,
  type RawSearchParams,
} from "@/lib/catalog";

export const metadata: Metadata = {
  title: "All products | Dash#",
  description:
    "Browse the Dash# demo catalogue of smartphones, laptops, tablets, audio and accessories. Filter by category, brand, price and availability.",
};

type ProductsPageProps = {
  searchParams: Promise<RawSearchParams>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const query = parseCatalogQuery(await searchParams);
  const results = queryCatalog(products, query);
  const brands = getBrands(products);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-bold text-ink md:text-4xl">
            All products
          </h1>
          <p className="mt-2 text-ink-muted">
            {products.length} seeded demo products across {categories.length}{" "}
            categories. Prices, stock and specifications are sample data.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <CatalogFilters
            query={query}
            basePath="/products"
            categories={categories}
            brands={brands}
          />

          <section aria-label="Products">
            <CatalogSort
              query={query}
              basePath="/products"
              resultCount={results.length}
            />
            <ProductResults
              products={results}
              query={query}
              basePath="/products"
            />
          </section>
        </div>
      </div>
    </div>
  );
}

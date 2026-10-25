import type { Metadata } from "next";
import { CatalogFilters, CatalogSort } from "@/components/catalog/catalog-controls";
import { ProductResults } from "@/components/catalog/product-results";
import { SearchBar } from "@/components/search/search-bar";
import { categories, products } from "@/lib/data/products";
import {
  getBrands,
  parseCatalogQuery,
  queryCatalog,
  type RawSearchParams,
} from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Search | Dash#",
  description:
    "Search the Dash# demo catalogue by product name, brand, category or specification.",
};

type SearchPageProps = {
  searchParams: Promise<RawSearchParams>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = parseCatalogQuery(await searchParams);
  const results = queryCatalog(products, query);
  const brands = getBrands(products);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 max-w-2xl">
          <h1 className="text-3xl font-bold text-ink md:text-4xl">
            {query.q ? "Search results" : "Search the catalogue"}
          </h1>
          <p className="mt-2 text-ink-muted">
            {query.q
              ? `Results for “${query.q}”.`
              : "Search by product name, brand, category or specification."}
          </p>
        </div>

        <div className="mb-8 max-w-2xl">
          <SearchBar
            initialQuery={query.q}
            autoFocus={query.q === ""}
            size="lg"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <CatalogFilters
            query={query}
            basePath="/search"
            categories={categories}
            brands={brands}
          />

          <section aria-label="Search results">
            <CatalogSort
              query={query}
              basePath="/search"
              resultCount={results.length}
            />
            <ProductResults
              products={results}
              query={query}
              basePath="/search"
            />
          </section>
        </div>
      </div>
    </div>
  );
}

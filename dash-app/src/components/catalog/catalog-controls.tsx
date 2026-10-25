"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { useId, useState, useTransition } from "react";
import type { Category } from "@/types/product";
import {
  PRICE_RANGES,
  SORT_OPTIONS,
  buildCatalogHref,
  hasActiveFilters,
  toggleFacet,
  withParam,
  type CatalogQuery,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";

type SharedProps = {
  query: CatalogQuery;
  basePath: string;
};

type CatalogFiltersProps = SharedProps & {
  categories: Category[];
  brands: string[];
};

const controlClass =
  "w-full rounded-card border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

const checkboxClass =
  "h-4 w-4 shrink-0 rounded border-line accent-brand focus:ring-2 focus:ring-brand/30";

function useCatalogNavigation(basePath: string) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (next: CatalogQuery) => {
    startTransition(() => {
      router.push(buildCatalogHref(basePath, next), { scroll: false });
    });
  };

  return { navigate, isPending };
}

/**
 * Category, brand, price and availability filters. Every change updates the
 * URL, so filtered views are shareable and survive a refresh.
 */
export function CatalogFilters({
  query,
  basePath,
  categories,
  brands,
}: CatalogFiltersProps) {
  const { navigate, isPending } = useCatalogNavigation(basePath);
  const [isOpen, setIsOpen] = useState(false);
  const priceId = useId();
  const panelId = useId();

  const activeCount =
    query.categories.length +
    query.brands.length +
    (query.priceRange ? 1 : 0) +
    (query.inStockOnly ? 1 : 0);

  return (
    <aside aria-label="Product filters" className="lg:sticky lg:top-40 lg:self-start">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-ink">Filters</h2>
        {hasActiveFilters(query) && (
          <Link
            href={basePath}
            className="text-sm font-medium text-brand hover:text-brand-hover"
          >
            Clear all
          </Link>
        )}
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="mt-3 flex w-full items-center justify-between rounded-card border border-line bg-surface px-4 py-3 text-sm font-medium text-ink lg:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          {isOpen ? "Hide filters" : "Show filters"}
        </span>
        <span className="text-ink-muted">
          {activeCount > 0 ? `${activeCount} active` : "None active"}
        </span>
      </button>

      <div
        id={panelId}
        aria-busy={isPending}
        className={cn(
          "mt-4 space-y-6 lg:mt-5",
          !isOpen && "hidden lg:block",
        )}
      >
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ink">Category</legend>
          <div className="space-y-2">
            {categories.map((category) => {
              const checked = query.categories.includes(category.slug);
              return (
                <label
                  key={category.id}
                  className="flex cursor-pointer items-center gap-2 text-sm text-ink"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      navigate(toggleFacet(query, "categories", category.slug))
                    }
                    className={checkboxClass}
                  />
                  {category.name}
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ink">Brand</legend>
          <div className="space-y-2">
            {brands.map((brand) => {
              const value = brand.toLowerCase();
              const checked = query.brands.includes(value);
              return (
                <label
                  key={brand}
                  className="flex cursor-pointer items-center gap-2 text-sm text-ink"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => navigate(toggleFacet(query, "brands", value))}
                    className={checkboxClass}
                  />
                  {brand}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label
            htmlFor={priceId}
            className="mb-2 block text-sm font-semibold text-ink"
          >
            Price
          </label>
          <select
            id={priceId}
            value={query.priceRange ?? ""}
            onChange={(event) =>
              navigate(
                withParam(query, "price", event.target.value || undefined),
              )
            }
            className={controlClass}
          >
            <option value="">Any price</option>
            {PRICE_RANGES.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={query.inStockOnly}
            onChange={(event) =>
              navigate(
                withParam(query, "stock", event.target.checked ? "1" : undefined),
              )
            }
            className={checkboxClass}
          />
          In stock only
        </label>
      </div>
    </aside>
  );
}

type CatalogSortProps = SharedProps & {
  resultCount: number;
};

/** Result count and sort control shown above the product grid. */
export function CatalogSort({ query, basePath, resultCount }: CatalogSortProps) {
  const { navigate, isPending } = useCatalogNavigation(basePath);
  const sortId = useId();

  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p
        role="status"
        aria-live="polite"
        className="text-sm text-ink-muted"
      >
        {resultCount === 1 ? "1 product" : `${resultCount} products`}
        {isPending && <span className="sr-only"> Updating results…</span>}
      </p>

      <div className="flex items-center gap-2">
        <label htmlFor={sortId} className="whitespace-nowrap text-sm text-ink-muted">
          Sort by
        </label>
        <select
          id={sortId}
          value={query.sort}
          onChange={(event) =>
            navigate(
              withParam(query, "sort", event.target.value || undefined),
            )
          }
          className="rounded-card border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

import type { Product } from "@/types/product";

/**
 * Catalogue querying: search, filtering and sorting over the in-repo
 * catalogue. All functions here are pure so they can be unit tested without a
 * browser and reused by both server and client components.
 */

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A–Z" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export type PriceRangeId =
  | "under-2000"
  | "2000-10000"
  | "10000-30000"
  | "over-30000";

type PriceRange = {
  id: PriceRangeId;
  label: string;
  minPrice: number;
  maxPrice?: number;
};

/** Preset price bands, expressed in integer cents like the product data. */
export const PRICE_RANGES: PriceRange[] = [
  { id: "under-2000", label: "Under R2,000", minPrice: 0, maxPrice: 199_999 },
  {
    id: "2000-10000",
    label: "R2,000 – R10,000",
    minPrice: 200_000,
    maxPrice: 999_999,
  },
  {
    id: "10000-30000",
    label: "R10,000 – R30,000",
    minPrice: 1_000_000,
    maxPrice: 2_999_999,
  },
  { id: "over-30000", label: "R30,000 and above", minPrice: 3_000_000 },
];

export type CatalogQuery = {
  q: string;
  categories: string[];
  brands: string[];
  priceRange?: PriceRangeId;
  inStockOnly: boolean;
  sort: SortOption;
};

export type RawSearchParams = Record<
  string,
  string | string[] | undefined
>;

export const EMPTY_CATALOG_QUERY: CatalogQuery = {
  q: "",
  categories: [],
  brands: [],
  priceRange: undefined,
  inStockOnly: false,
  sort: "featured",
};

/** Lowercase, strip diacritics and collapse whitespace for forgiving matching. */
export function normalize(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function listValue(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  const values = Array.isArray(value) ? value : [value];
  return values
    .flatMap((entry) => entry.split(","))
    .map((entry) => normalize(entry))
    .filter(Boolean);
}

function parsePriceRange(value: string): PriceRangeId | undefined {
  return PRICE_RANGES.some((range) => range.id === value)
    ? (value as PriceRangeId)
    : undefined;
}

function parseSort(value: string): SortOption {
  return SORT_OPTIONS.some((option) => option.value === value)
    ? (value as SortOption)
    : "featured";
}

/**
 * Turn raw Next.js `searchParams` into a validated, normalised query.
 * Unknown values are ignored rather than throwing, so hand-edited URLs and
 * stale links degrade to the default catalogue instead of an error page.
 */
export function parseCatalogQuery(
  searchParams: RawSearchParams = {},
): CatalogQuery {
  return {
    q: firstValue(searchParams.q).trim().replace(/\s+/g, " "),
    categories: listValue(searchParams.category),
    brands: listValue(searchParams.brand),
    priceRange: parsePriceRange(firstValue(searchParams.price)),
    inStockOnly: firstValue(searchParams.stock) === "1",
    sort: parseSort(firstValue(searchParams.sort)),
  };
}

export function hasActiveFilters(query: CatalogQuery): boolean {
  return (
    query.q !== "" ||
    query.categories.length > 0 ||
    query.brands.length > 0 ||
    query.priceRange !== undefined ||
    query.inStockOnly
  );
}

export function getPriceRange(id: PriceRangeId | undefined): PriceRange | undefined {
  return PRICE_RANGES.find((range) => range.id === id);
}

/** Everything a shopper could reasonably type, flattened into one string. */
function searchableText(product: Product): string {
  return [
    product.name,
    product.brand,
    product.category,
    product.subcategory ?? "",
    product.sku,
    product.description,
    ...product.keySellingPoints,
    ...Object.entries(product.specifications).flatMap(([key, value]) => [
      key,
      value,
    ]),
  ].join(" ");
}

/**
 * Match on name, brand, category and product metadata. Every whitespace-
 * separated token must appear somewhere, so "sony headphones" matches the Sony
 * WH-1000XM5 while "sony laptop" does not.
 */
export function matchesSearch(product: Product, query: string): boolean {
  const normalizedQuery = normalize(query);
  if (normalizedQuery === "") return true;

  const haystack = normalize(searchableText(product));
  return normalizedQuery
    .split(" ")
    .filter(Boolean)
    .every((token) => haystack.includes(token));
}

/** Compare a category slug from the URL with a product's category name. */
export function categoryNameToSlug(name: string): string {
  return normalize(name)
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function filterProducts(
  catalogue: Product[],
  query: CatalogQuery,
): Product[] {
  const range = getPriceRange(query.priceRange);

  return catalogue.filter((product) => {
    if (!matchesSearch(product, query.q)) return false;

    if (
      query.categories.length > 0 &&
      !query.categories.includes(categoryNameToSlug(product.category))
    ) {
      return false;
    }

    if (
      query.brands.length > 0 &&
      !query.brands.includes(normalize(product.brand))
    ) {
      return false;
    }

    if (range) {
      if (product.price < range.minPrice) return false;
      if (range.maxPrice !== undefined && product.price > range.maxPrice) {
        return false;
      }
    }

    if (query.inStockOnly && !product.inStock) return false;

    return true;
  });
}

/**
 * Sort a filtered list. "Featured" keeps the curated catalogue order, which is
 * deterministic and avoids inventing a popularity score.
 */
export function sortProducts(
  catalogue: Product[],
  sort: SortOption,
): Product[] {
  const sorted = [...catalogue];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "featured":
    default:
      return sorted;
  }
}

export function queryCatalog(
  catalogue: Product[],
  query: CatalogQuery,
): Product[] {
  return sortProducts(filterProducts(catalogue, query), query.sort);
}

export function getBrands(catalogue: Product[]): string[] {
  return [...new Set(catalogue.map((product) => product.brand))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function getPriceBounds(catalogue: Product[]): {
  min: number;
  max: number;
} {
  if (catalogue.length === 0) return { min: 0, max: 0 };
  const prices = catalogue.map((product) => product.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/**
 * Serialise a query back into URL parameters. Empty values are omitted so the
 * canonical catalogue URL stays clean and shareable.
 */
export function toSearchParams(query: CatalogQuery): URLSearchParams {
  const params = new URLSearchParams();
  const search = query.q.trim();

  if (search) params.set("q", search);
  for (const category of query.categories) params.append("category", category);
  for (const brand of query.brands) params.append("brand", brand);
  if (query.priceRange) params.set("price", query.priceRange);
  if (query.inStockOnly) params.set("stock", "1");
  if (query.sort !== "featured") params.set("sort", query.sort);

  return params;
}

export function buildCatalogHref(
  pathname: string,
  query: CatalogQuery,
): string {
  const params = toSearchParams(query).toString();
  return params ? `${pathname}?${params}` : pathname;
}

/** Apply a single-value change while preserving the rest of the query. */
export function withParam(
  query: CatalogQuery,
  key: "price" | "sort" | "stock",
  value: string | undefined,
): CatalogQuery {
  switch (key) {
    case "price":
      return {
        ...query,
        priceRange: value ? parsePriceRange(value) : undefined,
      };
    case "stock":
      return { ...query, inStockOnly: value === "1" };
    case "sort":
      return { ...query, sort: value ? parseSort(value) : "featured" };
    default:
      return query;
  }
}

/** Toggle a repeatable facet (category or brand). */
export function toggleFacet(
  query: CatalogQuery,
  key: "categories" | "brands",
  value: string,
): CatalogQuery {
  const current = query[key];
  const next = current.includes(value)
    ? current.filter((entry) => entry !== value)
    : [...current, value];
  return { ...query, [key]: next };
}

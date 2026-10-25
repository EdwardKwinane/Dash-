import { describe, expect, it } from "vitest";
import { products } from "@/lib/data/products";
import {
  EMPTY_CATALOG_QUERY,
  buildCatalogHref,
  categoryNameToSlug,
  filterProducts,
  getBrands,
  getPriceBounds,
  hasActiveFilters,
  matchesSearch,
  normalize,
  parseCatalogQuery,
  queryCatalog,
  sortProducts,
  toSearchParams,
  toggleFacet,
  withParam,
} from "@/lib/catalog";
import type { Product } from "@/types/product";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "test-1",
    slug: "test-product",
    name: "Test Product",
    brand: "Acme",
    category: "Smartphones",
    price: 100_000,
    images: ["https://example.com/test.jpg"],
    description: "A product used in tests.",
    keySellingPoints: [],
    specifications: {},
    sku: "ACM-TEST-1",
    stock: 5,
    inStock: true,
    ...overrides,
  };
}

describe("normalize", () => {
  it("lowercases, strips diacritics and collapses whitespace", () => {
    expect(normalize("  Café   Ünïcode  ")).toBe("cafe unicode");
  });
});

describe("matchesSearch", () => {
  it("matches name, brand, category, SKU and specifications", () => {
    const product = products[0];

    expect(matchesSearch(product, "galaxy")).toBe(true);
    expect(matchesSearch(product, "SAMSUNG")).toBe(true);
    expect(matchesSearch(product, "smartphones")).toBe(true);
    expect(matchesSearch(product, "sms-gs25u-256")).toBe(true);
    expect(matchesSearch(product, "snapdragon")).toBe(true);
  });

  it("requires every token to match and ignores extra whitespace", () => {
    expect(matchesSearch(products[0], "  samsung   ultra ")).toBe(true);
    expect(matchesSearch(products[0], "samsung laptop")).toBe(false);
  });

  it("treats an empty query as a match", () => {
    expect(matchesSearch(products[0], "")).toBe(true);
    expect(matchesSearch(products[0], "   ")).toBe(true);
  });

  it("is diacritic and case insensitive", () => {
    const product = makeProduct({ name: "Café Phone", brand: "Électron" });
    expect(matchesSearch(product, "cafe")).toBe(true);
    expect(matchesSearch(product, "electron")).toBe(true);
  });
});

describe("parseCatalogQuery", () => {
  it("returns defaults for empty or invalid params", () => {
    expect(parseCatalogQuery()).toEqual(EMPTY_CATALOG_QUERY);
    expect(
      parseCatalogQuery({ sort: "unknown", price: "not-a-range", stock: "0" }),
    ).toEqual(EMPTY_CATALOG_QUERY);
  });

  it("normalises search text and list params", () => {
    const query = parseCatalogQuery({
      q: "  Sony   Headphones ",
      category: ["laptops-computers", "tablets"],
      brand: "apple,sony",
      price: "2000-10000",
      stock: "1",
      sort: "price-asc",
    });

    expect(query.q).toBe("Sony Headphones");
    expect(query.categories).toEqual(["laptops-computers", "tablets"]);
    expect(query.brands).toEqual(["apple", "sony"]);
    expect(query.priceRange).toBe("2000-10000");
    expect(query.inStockOnly).toBe(true);
    expect(query.sort).toBe("price-asc");
  });
});

describe("filterProducts", () => {
  it("filters by category slug", () => {
    const results = filterProducts(products, {
      ...EMPTY_CATALOG_QUERY,
      categories: ["laptops-computers"],
    });

    expect(results.map((product) => product.slug)).toEqual([
      "macbook-pro-14-m4",
      "dell-xps-13-plus",
    ]);
  });

  it("filters by brand", () => {
    const results = filterProducts(products, {
      ...EMPTY_CATALOG_QUERY,
      brands: ["apple"],
    });

    expect(results).toHaveLength(2);
    expect(results.every((product) => product.brand === "Apple")).toBe(true);
  });

  it("filters by price band", () => {
    expect(
      filterProducts(products, {
        ...EMPTY_CATALOG_QUERY,
        priceRange: "under-2000",
      }).map((product) => product.brand),
    ).toEqual(["Logitech"]);

    expect(
      filterProducts(products, {
        ...EMPTY_CATALOG_QUERY,
        priceRange: "over-30000",
      }).map((product) => product.brand),
    ).toEqual(["Apple"]);
  });

  it("filters by availability using real stock data", () => {
    const catalogue = [
      makeProduct({ id: "in", inStock: true }),
      makeProduct({ id: "out", inStock: false }),
    ];

    const results = filterProducts(catalogue, {
      ...EMPTY_CATALOG_QUERY,
      inStockOnly: true,
    });

    expect(results.map((product) => product.id)).toEqual(["in"]);
  });

  it("combines search and filters", () => {
    const results = filterProducts(products, {
      ...EMPTY_CATALOG_QUERY,
      q: "apple",
      categories: ["tablets"],
    });

    expect(results.map((product) => product.name)).toEqual(['iPad Air 11" M3']);
  });
});

describe("sortProducts", () => {
  it("keeps the curated order for featured", () => {
    expect(sortProducts(products, "featured").map((product) => product.id)).toEqual(
      products.map((product) => product.id),
    );
  });

  it("sorts by price ascending and descending", () => {
    expect(sortProducts(products, "price-asc")[0].brand).toBe("Logitech");
    expect(sortProducts(products, "price-desc")[0].brand).toBe("Apple");
  });

  it("sorts by name", () => {
    expect(sortProducts(products, "name")[0].name).toBe("Dell XPS 13 Plus");
  });

  it("does not mutate the input array", () => {
    const original = [...products];
    sortProducts(products, "price-asc");
    expect(products).toEqual(original);
  });
});

describe("queryCatalog", () => {
  it("filters then sorts", () => {
    const results = queryCatalog(products, {
      ...EMPTY_CATALOG_QUERY,
      categories: ["laptops-computers"],
      sort: "price-asc",
    });

    expect(results.map((product) => product.brand)).toEqual(["Dell", "Apple"]);
  });
});

describe("facets and URLs", () => {
  it("builds unique, sorted brand facets", () => {
    expect(getBrands(products)).toEqual([
      "Apple",
      "Dell",
      "Logitech",
      "Samsung",
      "Sony",
    ]);
  });

  it("reports real price bounds", () => {
    expect(getPriceBounds(products)).toEqual({ min: 149900, max: 3999900 });
    expect(getPriceBounds([])).toEqual({ min: 0, max: 0 });
  });

  it("maps category names to the slugs used by routes", () => {
    expect(categoryNameToSlug("Laptops & Computers")).toBe("laptops-computers");
    expect(categoryNameToSlug("Headphones & Earbuds")).toBe(
      "headphones-earbuds",
    );
  });

  it("detects active filters but ignores sort", () => {
    expect(hasActiveFilters(EMPTY_CATALOG_QUERY)).toBe(false);
    expect(
      hasActiveFilters({ ...EMPTY_CATALOG_QUERY, sort: "price-asc" }),
    ).toBe(false);
    expect(hasActiveFilters({ ...EMPTY_CATALOG_QUERY, q: "sony" })).toBe(true);
  });

  it("serialises and parses a query round-trip", () => {
    const query = {
      ...EMPTY_CATALOG_QUERY,
      q: "sony headphones",
      categories: ["headphones-earbuds"],
      brands: ["sony"],
      priceRange: "2000-10000" as const,
      inStockOnly: true,
      sort: "price-asc" as const,
    };

    const params = Object.fromEntries(toSearchParams(query));
    const parsed = parseCatalogQuery(params);

    expect(parsed).toEqual(query);
  });

  it("omits default values from the URL", () => {
    expect(buildCatalogHref("/products", EMPTY_CATALOG_QUERY)).toBe(
      "/products",
    );
    expect(
      buildCatalogHref("/search", { ...EMPTY_CATALOG_QUERY, q: "ipad" }),
    ).toBe("/search?q=ipad");
  });

  it("toggles repeatable facets", () => {
    const added = toggleFacet(EMPTY_CATALOG_QUERY, "brands", "apple");
    expect(added.brands).toEqual(["apple"]);
    expect(toggleFacet(added, "brands", "apple").brands).toEqual([]);
  });

  it("applies single-value params and clears invalid prices", () => {
    expect(withParam(EMPTY_CATALOG_QUERY, "sort", "name").sort).toBe("name");
    expect(withParam(EMPTY_CATALOG_QUERY, "stock", "1").inStockOnly).toBe(true);
    expect(
      withParam(
        { ...EMPTY_CATALOG_QUERY, priceRange: "under-2000" },
        "price",
        undefined,
      ).priceRange,
    ).toBeUndefined();
  });
});

import { describe, expect, it } from "vitest";
import { productBadgeLabel } from "@/lib/product-badge";
import type { Product } from "@/types/product";

function makeProduct(overrides: Partial<Product>): Product {
  return {
    id: "test-id",
    slug: "test-slug",
    name: "Test Product",
    brand: "Test Brand",
    category: "Test Category",
    price: 100000,
    images: [],
    description: "",
    keySellingPoints: [],
    specifications: {},
    sku: "TEST-SKU",
    stock: 1,
    inStock: true,
    ...overrides,
  };
}

describe("productBadgeLabel", () => {
  it("returns no badge for a plain product", () => {
    expect(productBadgeLabel(makeProduct({}))).toBeNull();
  });

  it("prefers Sale over New and Featured", () => {
    expect(
      productBadgeLabel(makeProduct({ onSale: true, newArrival: true, featured: true })),
    ).toBe("Sale");
  });

  it("prefers New over Featured", () => {
    expect(productBadgeLabel(makeProduct({ newArrival: true, featured: true }))).toBe(
      "New",
    );
  });

  it("shows Featured on its own", () => {
    expect(productBadgeLabel(makeProduct({ featured: true }))).toBe("Featured");
  });
});

import { describe, expect, it } from "vitest";
import { categories, getProductsInCategory, products } from "@/lib/data/products";

/**
 * Catalogue consistency guardrails: every presentation surface (homepage,
 * category and search listings, product pages, cart, checkout) renders from
 * this seeded data, so structural mistakes here would surface as contradictions
 * between surfaces. These tests enforce the invariants the UI relies on.
 */

const APPROVED_IMAGE_HOST = "images.unsplash.com";

describe("category data", () => {
  it("has unique ids, names and slugs with route-safe slugs", () => {
    const ids = new Set<string>();
    const names = new Set<string>();
    const slugs = new Set<string>();

    for (const category of categories) {
      expect(category.id).not.toBe("");
      expect(category.name).not.toBe("");
      expect(category.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);

      expect(ids.has(category.id)).toBe(false);
      expect(names.has(category.name)).toBe(false);
      expect(slugs.has(category.slug)).toBe(false);
      ids.add(category.id);
      names.add(category.name);
      slugs.add(category.slug);
    }
  });
});

describe("product data", () => {
  it("has unique ids, slugs and SKU codes", () => {
    const ids = new Set<string>();
    const slugs = new Set<string>();
    const skus = new Set<string>();

    for (const product of products) {
      expect(ids.has(product.id)).toBe(false);
      expect(slugs.has(product.slug)).toBe(false);
      expect(skus.has(product.sku)).toBe(false);
      ids.add(product.id);
      slugs.add(product.slug);
      skus.add(product.sku);
    }
  });

  it("uses route-safe slugs, names, brands and SKUs", () => {
    for (const product of products) {
      expect(product.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(product.name).not.toBe("");
      expect(product.brand).not.toBe("");
      expect(product.sku).not.toBe("");
    }
  });

  it("prices are positive integer cents; compare-at prices exceed the price", () => {
    for (const product of products) {
      expect(product.price).toBeGreaterThan(0);
      expect(Number.isInteger(product.price)).toBe(true);

      if (product.compareAtPrice !== undefined) {
        expect(product.compareAtPrice).toBeGreaterThan(product.price);
        expect(Number.isInteger(product.compareAtPrice)).toBe(true);
      }
    }
  });

  it("stock and availability status agree", () => {
    for (const product of products) {
      expect(product.stock).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(product.stock)).toBe(true);
      expect(product.inStock).toBe(product.stock > 0);
    }
  });

  it("assigns every product to a real category", () => {
    const categoryNames = new Set(categories.map((category) => category.name));

    for (const product of products) {
      expect(categoryNames.has(product.category)).toBe(true);
    }
  });

  it("category helpers agree with the product records", () => {
    for (const category of categories) {
      for (const product of getProductsInCategory(category.name)) {
        expect(product.category).toBe(category.name);
      }
    }
    expect(getProductsInCategory("Nonexistent category")).toEqual([]);
  });

  it("serves images from the approved demo image host over https", () => {
    for (const product of products) {
      expect(product.images.length).toBeGreaterThan(0);
      for (const image of product.images) {
        expect(image.startsWith("https://")).toBe(true);
        expect(new URL(image).hostname).toBe(APPROVED_IMAGE_HOST);
      }
    }
  });

  it("describes each product completely enough to render trustfully", () => {
    for (const product of products) {
      expect(product.description.length).toBeGreaterThan(0);
      expect(product.keySellingPoints.length).toBeGreaterThan(0);
      expect(Object.keys(product.specifications).length).toBeGreaterThan(0);
      for (const point of product.keySellingPoints) {
        expect(point).not.toBe("");
      }
      for (const [key, value] of Object.entries(product.specifications)) {
        expect(key).not.toBe("");
        expect(value).not.toBe("");
      }
    }
  });

  it("only sets presentation flags the data actually earns", () => {
    for (const product of products) {
      // A compare-at price is what makes a discount claim plausible.
      if (product.onSale) {
        expect(product.compareAtPrice).toBeDefined();
      }
    }
  });
});

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductResults } from "@/components/catalog/product-results";
import { EMPTY_CATALOG_QUERY } from "@/lib/catalog";
import { products } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";

describe("ProductResults", () => {
  it("renders product links with names, prices and stock", () => {
    render(
      <ProductResults
        products={products.slice(0, 2)}
        query={EMPTY_CATALOG_QUERY}
        basePath="/products"
      />,
    );

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute(
      "href",
      `/products/${products[0].slug}`,
    );
    expect(links[0]).toHaveTextContent(products[0].name);
    expect(links[0]).toHaveTextContent(formatPrice(products[0].price));
    expect(links[0]).toHaveTextContent(/in stock/i);
  });

  it("shows an accurate empty state with a reset action", () => {
    render(
      <ProductResults
        products={[]}
        query={{ ...EMPTY_CATALOG_QUERY, q: "zzzz" }}
        basePath="/search"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "No products found" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/matches “zzzz”/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Clear search and filters" }),
    ).toHaveAttribute("href", "/search");
    expect(
      screen.getByRole("link", { name: "Browse all products" }),
    ).toHaveAttribute("href", "/products");
  });
});

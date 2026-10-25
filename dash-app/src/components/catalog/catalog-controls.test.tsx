import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  CatalogFilters,
  CatalogSort,
} from "@/components/catalog/catalog-controls";
import { categories } from "@/lib/data/products";
import { EMPTY_CATALOG_QUERY, getBrands } from "@/lib/catalog";
import { products } from "@/lib/data/products";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const brands = getBrands(products);

function renderFilters() {
  return render(
    <CatalogFilters
      query={EMPTY_CATALOG_QUERY}
      basePath="/products"
      categories={categories}
      brands={brands}
    />,
  );
}

describe("CatalogFilters", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("renders accessible filter groups", () => {
    renderFilters();

    expect(
      screen.getByRole("complementary", { name: "Product filters" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Category" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Brand" })).toBeInTheDocument();
    expect(screen.getByLabelText("Price")).toBeInTheDocument();
  });

  it("adds a category filter to the URL", async () => {
    const user = userEvent.setup();
    renderFilters();

    await user.click(
      screen.getByRole("checkbox", { name: "Laptops & Computers" }),
    );

    expect(push).toHaveBeenCalledWith(
      "/products?category=laptops-computers",
      { scroll: false },
    );
  });

  it("adds a brand filter to the URL", async () => {
    const user = userEvent.setup();
    renderFilters();

    await user.click(screen.getByRole("checkbox", { name: "Apple" }));

    expect(push).toHaveBeenCalledWith("/products?brand=apple", {
      scroll: false,
    });
  });

  it("applies a price band", async () => {
    const user = userEvent.setup();
    renderFilters();

    await user.selectOptions(screen.getByLabelText("Price"), "under-2000");

    expect(push).toHaveBeenCalledWith("/products?price=under-2000", {
      scroll: false,
    });
  });

  it("toggles the mobile filter panel accessibly", async () => {
    const user = userEvent.setup();
    renderFilters();

    const toggle = screen.getByRole("button", { name: /show filters/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    expect(
      screen.getByRole("button", { name: /hide filters/i }),
    ).toHaveAttribute("aria-expanded", "true");
  });
});

describe("CatalogSort", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("announces the result count and changes sort order", async () => {
    const user = userEvent.setup();
    render(
      <CatalogSort
        query={EMPTY_CATALOG_QUERY}
        basePath="/search"
        resultCount={6}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("6 products");

    await user.selectOptions(screen.getByLabelText("Sort by"), "price-desc");

    expect(push).toHaveBeenCalledWith("/search?sort=price-desc", {
      scroll: false,
    });
  });

  it("uses the singular label for one result", () => {
    render(
      <CatalogSort
        query={EMPTY_CATALOG_QUERY}
        basePath="/products"
        resultCount={1}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("1 product");
  });
});

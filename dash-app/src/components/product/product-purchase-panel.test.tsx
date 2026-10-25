import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { CartProvider } from "@/contexts/cart-context";
import { products } from "@/lib/data/products";
import { CART_STORAGE_KEY } from "@/lib/cart";

const samsung = products[0];

function renderPanel(product = samsung) {
  return render(
    <CartProvider>
      <ProductPurchasePanel product={product} />
    </CartProvider>,
  );
}

describe("ProductPurchasePanel", () => {
  it("adds the selected quantity and confirms it inline", async () => {
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByRole("button", { name: /increase quantity/i }));
    await user.click(screen.getByRole("button", { name: "Add to cart" }));

    expect(
      await screen.findByText(/Added 2 × Samsung Galaxy S25 Ultra/),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View cart" })).toHaveAttribute(
      "href",
      "/cart",
    );
  });

  it("persists the cart as product ids and quantities", async () => {
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByRole("button", { name: "Add to cart" }));

    await waitFor(() => {
      expect(
        JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]"),
      ).toEqual([{ productId: samsung.id, quantity: 1 }]);
    });
  });

  it("explains the stock limit instead of calling alert", async () => {
    const user = userEvent.setup();
    const lowStock = { ...samsung, stock: 2 };
    renderPanel(lowStock);

    const add = screen.getByRole("button", { name: "Add to cart" });
    await user.click(add);
    await user.click(add);
    await user.click(add);

    expect(
      await screen.findByText(/already have all 2 available units/i),
    ).toBeInTheDocument();
  });

  it("disables purchase controls for out-of-stock products", () => {
    renderPanel({ ...samsung, inStock: false, stock: 0 });

    expect(screen.getByRole("button", { name: "Out of stock" })).toBeDisabled();
    expect(
      screen.queryByRole("button", { name: /increase quantity/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/out of stock in this demo catalogue/i),
    ).toBeInTheDocument();
  });

  it("caps the quantity stepper at available stock", async () => {
    const user = userEvent.setup();
    renderPanel({ ...samsung, stock: 2 });

    const increase = screen.getByRole("button", {
      name: /increase quantity/i,
    });
    await user.click(increase);

    expect(increase).toBeDisabled();
  });
});

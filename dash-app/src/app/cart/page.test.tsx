import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CartPage from "@/app/cart/page";
import { CartProvider } from "@/contexts/cart-context";
import { CART_STORAGE_KEY } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { products } from "@/lib/data/products";

const samsung = products[0];

function seedCart(lines: Array<{ productId: string; quantity: number }>) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
}

function renderCart() {
  return render(
    <CartProvider>
      <CartPage />
    </CartProvider>,
  );
}

describe("CartPage", () => {
  it("shows an empty state with routes back to discovery", async () => {
    renderCart();

    expect(
      await screen.findByRole("heading", { name: "Your cart is empty" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse products" })).toHaveAttribute(
      "href",
      "/products",
    );
    expect(
      screen.getByRole("link", { name: "Search the catalogue" }),
    ).toHaveAttribute("href", "/search");
  });

  it("restores a persisted cart and calculates totals in cents", async () => {
    seedCart([{ productId: samsung.id, quantity: 2 }]);
    renderCart();

    expect(
      await screen.findByRole("link", { name: samsung.name }),
    ).toBeInTheDocument();
    expect(screen.getByText("Subtotal (2 items)")).toBeInTheDocument();
    expect(
      screen.getAllByText(formatPrice(samsung.price * 2)).length,
    ).toBeGreaterThan(0);
  });

  it("increments and decrements quantity with stock limits", async () => {
    const user = userEvent.setup();
    seedCart([{ productId: samsung.id, quantity: 2 }]);
    renderCart();

    const increase = await screen.findByRole("button", {
      name: new RegExp(`increase quantity of ${samsung.name}`, "i"),
    });
    await user.click(increase);

    expect(screen.getByText("Subtotal (3 items)")).toBeInTheDocument();
    expect(
      screen.getAllByText(formatPrice(samsung.price * 3)).length,
    ).toBeGreaterThan(0);

    const decrease = screen.getByRole("button", {
      name: new RegExp(`decrease quantity of ${samsung.name}`, "i"),
    });
    await user.click(decrease);

    expect(screen.getByText("Subtotal (2 items)")).toBeInTheDocument();
  });

  it("removes an item and returns to the empty state", async () => {
    const user = userEvent.setup();
    seedCart([{ productId: samsung.id, quantity: 1 }]);
    renderCart();

    const remove = await screen.findByRole("button", {
      name: new RegExp(`remove ${samsung.name}`, "i"),
    });
    await user.click(remove);

    expect(
      await screen.findByRole("heading", { name: "Your cart is empty" }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(window.localStorage.getItem(CART_STORAGE_KEY)).toBe("[]");
    });
  });

  it("does not render invalid persisted data", async () => {
    window.localStorage.setItem(CART_STORAGE_KEY, "not-json");
    renderCart();

    expect(
      await screen.findByRole("heading", { name: "Your cart is empty" }),
    ).toBeInTheDocument();
  });
});

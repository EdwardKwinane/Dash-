import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider, useCart } from "@/contexts/cart-context";
import { CART_STORAGE_KEY } from "@/lib/cart";
import { products } from "@/lib/data/products";

const samsung = products[0];
const logitech = products[5];

function Consumer() {
  const { state, isHydrated, addItem } = useCart();

  return (
    <div>
      <p data-testid="hydrated">{isHydrated ? "yes" : "no"}</p>
      <p data-testid="items">{state.totalItems}</p>
      <button type="button" onClick={() => addItem(logitech, 1)}>
        Add Logitech
      </button>
      <button type="button" onClick={() => addItem(samsung, samsung.stock + 1)}>
        Over-order Samsung
      </button>
    </div>
  );
}

function renderProvider() {
  return render(
    <CartProvider>
      <Consumer />
    </CartProvider>,
  );
}

describe("CartProvider", () => {
  it("restores a saved cart without wiping storage on first paint", async () => {
    const saved = JSON.stringify([{ productId: samsung.id, quantity: 2 }]);
    window.localStorage.setItem(CART_STORAGE_KEY, saved);

    renderProvider();

    expect(await screen.findByTestId("hydrated")).toHaveTextContent("yes");
    await waitFor(() => {
      expect(screen.getByTestId("items")).toHaveTextContent("2");
    });
    expect(window.localStorage.getItem(CART_STORAGE_KEY)).toBe(saved);
  });

  it("persists every accepted mutation and ignores rejected ones", async () => {
    const user = userEvent.setup();
    renderProvider();

    await screen.findByTestId("hydrated");

    await user.click(screen.getByRole("button", { name: "Add Logitech" }));
    await waitFor(() => {
      expect(
        JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]"),
      ).toEqual([{ productId: logitech.id, quantity: 1 }]);
    });

    await user.click(screen.getByRole("button", { name: "Over-order Samsung" }));
    expect(screen.getByTestId("items")).toHaveTextContent("1");
    expect(
      JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]"),
    ).toEqual([{ productId: logitech.id, quantity: 1 }]);
  });
});

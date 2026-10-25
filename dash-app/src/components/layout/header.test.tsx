import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/layout/header";
import { CartProvider } from "@/contexts/cart-context";
import { CART_STORAGE_KEY } from "@/lib/cart";
import { products } from "@/lib/data/products";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/",
}));

function renderHeader() {
  return render(
    <CartProvider>
      <Header />
    </CartProvider>,
  );
}

describe("Header", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("renders the brand logo and primary navigation", () => {
    renderHeader();

    expect(screen.getByRole("img", { name: "Dash#" })).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Primary" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "All products" }),
    ).toHaveAttribute("href", "/products");
  });

  it("does not expose links to routes that do not exist", () => {
    renderHeader();

    expect(
      screen.queryByRole("link", { name: /account/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /wishlist/i }),
    ).not.toBeInTheDocument();
  });

  it("labels the cart with its item count", async () => {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify([{ productId: products[0].id, quantity: 2 }]),
    );
    renderHeader();

    expect(
      await screen.findByRole("link", { name: "Cart, 2 items" }),
    ).toHaveAttribute("href", "/cart");
  });

  it("toggles the mobile menu with accessible state", async () => {
    const user = userEvent.setup();
    renderHeader();

    const menu = document.getElementById("mobile-menu");
    expect(menu).toHaveAttribute("hidden");

    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    expect(
      screen.getByRole("button", { name: "Close menu" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(menu).not.toHaveAttribute("hidden");
  });

  it("closes the mobile menu on Escape", async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Open menu" }),
      ).toHaveAttribute("aria-expanded", "false");
    });
  });
});

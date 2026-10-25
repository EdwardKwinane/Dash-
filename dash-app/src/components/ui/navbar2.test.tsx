import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider } from "@/contexts/cart-context";
import { Navbar2 } from "@/components/ui/navbar2";
import { CART_STORAGE_KEY } from "@/lib/cart";
import { categories, products } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/",
}));

function renderNavbar() {
  return render(
    <CartProvider>
      <Navbar2 />
    </CartProvider>,
  );
}

describe("Navbar2", () => {
  beforeEach(() => {
    push.mockClear();
    window.localStorage.clear();
  });

  it("renders the real logo and primary navigation landmarks", () => {
    renderNavbar();

    expect(screen.getByRole("img", { name: "Dash#" })).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Primary" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Mobile", hidden: true }),
    ).toBeInTheDocument();
  });

  it("links only to routes that exist", () => {
    renderNavbar();

    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));

    for (const href of hrefs) {
      expect(href).not.toBe("#");
      expect(href?.startsWith("/")).toBe(true);
    }
    expect(screen.queryByRole("link", { name: /account/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /wishlist/i })).not.toBeInTheDocument();
  });

  it("links the fixed category entries to real category routes", () => {
    renderNavbar();

    expect(
      screen.getByRole("link", { name: "Laptops" }),
    ).toHaveAttribute("href", "/categories/laptops-computers");
    expect(
      screen.getByRole("link", { name: "Smartphones" }),
    ).toHaveAttribute("href", "/categories/smartphones");
    expect(
      screen.getByRole("link", { name: "Audio" }),
    ).toHaveAttribute("href", "/categories/headphones-earbuds");
    expect(
      screen.getByRole("link", { name: "Accessories" }),
    ).toHaveAttribute("href", "/categories/accessories");
  });

  it("labels the cart with its item count and links to the cart", async () => {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify([{ productId: products[0].id, quantity: 2 }]),
    );
    renderNavbar();

    expect(
      await screen.findByRole("link", { name: "Cart, 2 items" }),
    ).toHaveAttribute("href", "/cart");
  });

  it("toggles the Shop mega-menu with a real disclosure button", async () => {
    const user = userEvent.setup();
    renderNavbar();

    const shop = screen.getByRole("button", { name: "Shop" });
    expect(shop).toHaveAttribute("aria-expanded", "false");
    expect(shop).toHaveAttribute("aria-controls", "shop-menu");
    expect(document.getElementById("shop-menu")).toHaveAttribute("hidden");

    await user.click(shop);

    expect(shop).toHaveAttribute("aria-expanded", "true");
    const panel = document.getElementById("shop-menu");
    expect(panel).not.toHaveAttribute("hidden");

    // Every real category is present, one link per category. The accessible
    // name of a category link starts with the category name.
    await waitFor(() => {
      for (const category of categories) {
        expect(
          screen.getAllByRole("link", {
            name: new RegExp(`^${category.name}`),
          }).length,
        ).toBeGreaterThan(0);
      }
    });

    await user.click(shop);
    expect(shop).toHaveAttribute("aria-expanded", "false");
    expect(panel).toHaveAttribute("hidden");
  });

  it("closes the mega-menu on Escape and returns focus to its trigger", async () => {
    const user = userEvent.setup();
    renderNavbar();

    const shop = screen.getByRole("button", { name: "Shop" });
    await user.click(shop);
    await user.keyboard("{Escape}");

    expect(shop).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("shop-menu")).toHaveAttribute("hidden");
    expect(document.activeElement).toBe(shop);
  });

  it("closes the mega-menu when the pointer goes down outside the header", async () => {
    const user = userEvent.setup();
    renderNavbar();

    const shop = screen.getByRole("button", { name: "Shop" });
    await user.click(shop);
    expect(shop).toHaveAttribute("aria-expanded", "true");

    fireEvent.pointerDown(document.body);

    await waitFor(() => {
      expect(shop).toHaveAttribute("aria-expanded", "false");
    });
    expect(document.getElementById("shop-menu")).toHaveAttribute("hidden");
  });

  it("closes the mega-menu after choosing a destination", async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(screen.getByRole("button", { name: "Shop" }));
    await user.click(screen.getByRole("link", { name: "Browse all products →" }));

    expect(
      screen.getByRole("button", { name: "Shop" }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("features a real product from the catalogue with price and image", async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(screen.getByRole("button", { name: "Shop" }));

    const featured = products.find((product) => product.featured);
    expect(featured).toBeDefined();

    const link = screen.getByRole("link", {
      name: new RegExp(featured!.name),
    });
    expect(link).toHaveAttribute("href", `/products/${featured!.slug}`);
    expect(screen.getByText(formatPrice(featured!.price))).toBeInTheDocument();
  });

  it("submits the desktop search to the search route", async () => {
    const user = userEvent.setup();
    renderNavbar();

    const search = screen.getAllByRole("searchbox")[0]!;
    await user.type(search, "ipad");
    await user.keyboard("{Enter}");

    expect(push).toHaveBeenCalledWith("/search?q=ipad");
  });

  it("toggles the mobile menu with accessible state and closes on Escape", async () => {
    const user = userEvent.setup();
    renderNavbar();

    const toggle = screen.getByRole("button", { name: "Open menu" });
    const menu = document.getElementById("mobile-menu");
    expect(menu).toHaveAttribute("hidden");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-controls", "mobile-menu");

    await user.click(toggle);

    expect(
      screen.getByRole("button", { name: "Close menu" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(menu).not.toHaveAttribute("hidden");

    // All seven real categories are reachable from the mobile menu.
    for (const category of categories) {
      const mobileMenu = screen.getByRole("navigation", { name: "Mobile" });
      expect(
        [
          ...mobileMenu.querySelectorAll("a"),
        ].some((link) => link.textContent === category.name),
      ).toBe(true);
    }

    await user.keyboard("{Escape}");
    expect(
      screen.getByRole("button", { name: "Open menu" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(menu).toHaveAttribute("hidden");
  });

  it("closes the mobile menu after navigating via a link", async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("link", { name: "All products" }));

    expect(
      screen.getByRole("button", { name: "Open menu" }),
    ).toHaveAttribute("aria-expanded", "false");
  });
});

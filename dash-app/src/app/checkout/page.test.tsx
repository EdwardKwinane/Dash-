import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CheckoutPage from "@/app/checkout/page";
import { CartProvider } from "@/contexts/cart-context";
import { CART_STORAGE_KEY } from "@/lib/cart";
import { products } from "@/lib/data/products";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const logitech = products[5];

function renderCheckout() {
  return render(
    <CartProvider>
      <CheckoutPage />
    </CartProvider>,
  );
}

function seedCart() {
  window.localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify([{ productId: logitech.id, quantity: 1 }]),
  );
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Email address"), "shopper@example.co.za");
  await user.type(screen.getByLabelText("First name"), "Thandi");
  await user.type(screen.getByLabelText("Last name"), "Mokoena");
  await user.type(screen.getByLabelText("Street address"), "12 Loop Street");
  await user.type(screen.getByLabelText("City or town"), "Cape Town");
  await user.selectOptions(screen.getByLabelText("Province"), "Western Cape");
  await user.type(screen.getByLabelText("Postal code"), "8001");
  await user.type(screen.getByLabelText("Phone number"), "082 123 4567");
}

describe("CheckoutPage", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("prevents checkout when the cart is empty", async () => {
    renderCheckout();

    expect(
      await screen.findByRole("heading", { name: "Your cart is empty" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Place demo order" }),
    ).not.toBeInTheDocument();
  });

  it("shows accessible field-level validation errors", async () => {
    const user = userEvent.setup();
    seedCart();
    renderCheckout();

    await screen.findByRole("heading", { name: "Demo checkout" });
    await user.click(screen.getByRole("button", { name: "Place demo order" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      /correct the highlighted 8 fields/i,
    );
    expect(screen.getByText("Enter your email address.")).toBeInTheDocument();

    const email = screen.getByLabelText("Email address");
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveFocus();
    expect(email).toHaveAttribute("aria-describedby", "email-error");
  });

  it("rejects an invalid South African address", async () => {
    const user = userEvent.setup();
    seedCart();
    renderCheckout();

    await screen.findByRole("heading", { name: "Demo checkout" });
    await user.type(screen.getByLabelText("Email address"), "not-an-email");
    await user.type(screen.getByLabelText("Postal code"), "123");
    await user.type(screen.getByLabelText("Phone number"), "12345");
    await user.click(screen.getByRole("button", { name: "Place demo order" }));

    expect(
      screen.getByText(/valid email address/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Enter a 4-digit postal code.")).toBeInTheDocument();
    expect(
      screen.getByText("Enter a valid South African phone number."),
    ).toBeInTheDocument();
  });

  it("completes the demo flow once and navigates with a demo reference", async () => {
    const user = userEvent.setup();
    seedCart();
    renderCheckout();

    await screen.findByRole("heading", { name: "Demo checkout" });
    await fillValidForm(user);

    const submit = screen.getByRole("button", { name: "Place demo order" });
    await user.click(submit);
    await user.click(submit);

    await waitFor(
      () => {
        expect(push).toHaveBeenCalledTimes(1);
        expect(push).toHaveBeenCalledWith(
          expect.stringMatching(
            /^\/checkout\/success\?ref=DASH-DEMO-[A-Z0-9]{6}$/,
          ),
        );
      },
      { timeout: 4000 },
    );

    await waitFor(() => {
      expect(window.localStorage.getItem(CART_STORAGE_KEY)).toBe("[]");
    });
  });
});

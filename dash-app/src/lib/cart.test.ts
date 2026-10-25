import { describe, expect, it } from "vitest";
import { products } from "@/lib/data/products";
import {
  EMPTY_CART_STATE,
  cartReducer,
  createCartState,
  parseStoredCart,
  resolveAddItem,
  serializeCart,
  type CartItem,
} from "@/lib/cart";
import type { Product } from "@/types/product";

const samsung = products[0];
const macbook = products[1];
const logitech = products[5];

function line(product: Product, quantity: number): CartItem {
  return { product, quantity };
}

describe("createCartState", () => {
  it("derives item count and subtotal in integer cents", () => {
    const state = createCartState([line(samsung, 2), line(logitech, 3)]);

    expect(state.totalItems).toBe(5);
    expect(state.subtotal).toBe(samsung.price * 2 + logitech.price * 3);
  });

  it("drops unavailable products and clamps quantities to stock", () => {
    const outOfStock = { ...macbook, inStock: false };
    const state = createCartState([
      line(outOfStock, 1),
      line(logitech, 999),
    ]);

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(logitech.stock);
    expect(state.totalItems).toBe(logitech.stock);
  });
});

describe("resolveAddItem", () => {
  it("rejects out-of-stock products", () => {
    const result = resolveAddItem(
      EMPTY_CART_STATE,
      { ...samsung, inStock: false },
    );

    expect(result).toEqual({
      ok: false,
      reason: "out-of-stock",
      available: 0,
    });
  });

  it("rejects quantities above stock", () => {
    const result = resolveAddItem(EMPTY_CART_STATE, samsung, 16);

    expect(result).toEqual({
      ok: false,
      reason: "stock-limit",
      available: samsung.stock,
    });
  });

  it("accounts for units already in the cart", () => {
    const state = createCartState([line(samsung, 14)]);
    const result = resolveAddItem(state, samsung, 2);

    expect(result).toEqual({ ok: false, reason: "stock-limit", available: 1 });
  });

  it("accepts a valid request and normalises fractions", () => {
    expect(resolveAddItem(EMPTY_CART_STATE, samsung, 2)).toEqual({
      ok: true,
      quantity: 2,
    });
    expect(resolveAddItem(EMPTY_CART_STATE, samsung, 1.8)).toEqual({
      ok: true,
      quantity: 1,
    });
  });
});

describe("cartReducer", () => {
  it("adds a new line and increments an existing one", () => {
    const once = cartReducer(EMPTY_CART_STATE, {
      type: "ADD_ITEM",
      payload: { product: samsung, quantity: 1 },
    });
    const twice = cartReducer(once, {
      type: "ADD_ITEM",
      payload: { product: samsung, quantity: 2 },
    });

    expect(once.items).toHaveLength(1);
    expect(twice.items).toHaveLength(1);
    expect(twice.items[0].quantity).toBe(3);
    expect(twice.totalItems).toBe(3);
    expect(twice.subtotal).toBe(samsung.price * 3);
  });

  it("never exceeds stock when adding repeatedly", () => {
    const state = cartReducer(EMPTY_CART_STATE, {
      type: "ADD_ITEM",
      payload: { product: logitech, quantity: logitech.stock + 10 },
    });

    expect(state.items[0].quantity).toBe(logitech.stock);
  });

  it("does not mutate the previous state", () => {
    const before = createCartState([line(samsung, 1)]);
    const snapshot = JSON.parse(JSON.stringify(before));
    const after = cartReducer(before, {
      type: "UPDATE_QUANTITY",
      payload: { productId: samsung.id, quantity: 2 },
    });

    expect(before).toEqual(snapshot);
    expect(after).not.toBe(before);
    expect(after.items[0].quantity).toBe(2);
  });

  it("clamps updates to stock and removes at zero", () => {
    const state = createCartState([line(samsung, 1)]);
    const clamped = cartReducer(state, {
      type: "UPDATE_QUANTITY",
      payload: { productId: samsung.id, quantity: 999 },
    });
    expect(clamped.items[0].quantity).toBe(samsung.stock);

    const removed = cartReducer(clamped, {
      type: "UPDATE_QUANTITY",
      payload: { productId: samsung.id, quantity: 0 },
    });
    expect(removed.items).toEqual([]);
    expect(removed.subtotal).toBe(0);
  });

  it("ignores invalid and unknown updates", () => {
    const state = createCartState([line(samsung, 1)]);
    expect(
      cartReducer(state, {
        type: "UPDATE_QUANTITY",
        payload: { productId: samsung.id, quantity: Number.NaN },
      }).items,
    ).toEqual([]);

    expect(
      cartReducer(state, {
        type: "UPDATE_QUANTITY",
        payload: { productId: "missing", quantity: 2 },
      }),
    ).toBe(state);
  });

  it("removes lines and clears the cart", () => {
    const state = createCartState([line(samsung, 1), line(macbook, 1)]);
    const removed = cartReducer(state, {
      type: "REMOVE_ITEM",
      payload: { productId: samsung.id },
    });

    expect(removed.items.map((item) => item.product.id)).toEqual([macbook.id]);
    expect(cartReducer(removed, { type: "CLEAR_CART" })).toEqual(
      EMPTY_CART_STATE,
    );
  });
});

describe("persistence", () => {
  const lookup = (id: string) => products.find((product) => product.id === id);

  it("round-trips only the product id and quantity", () => {
    const items = [line(samsung, 2), line(logitech, 1)];
    const raw = serializeCart(items);

    expect(JSON.parse(raw)).toEqual([
      { productId: samsung.id, quantity: 2 },
      { productId: logitech.id, quantity: 1 },
    ]);
    expect(parseStoredCart(raw, lookup)).toEqual([
      { product: samsung, quantity: 2, selectedVariant: undefined },
      { product: logitech, quantity: 1, selectedVariant: undefined },
    ]);
  });

  it("recovers the legacy shape that persisted whole products", () => {
    const raw = JSON.stringify([{ product: samsung, quantity: 2 }]);

    expect(parseStoredCart(raw, lookup)).toEqual([
      { product: samsung, quantity: 2, selectedVariant: undefined },
    ]);
  });

  it("returns an empty cart for malformed or unexpected data", () => {
    expect(parseStoredCart(null, lookup)).toEqual([]);
    expect(parseStoredCart("not json", lookup)).toEqual([]);
    expect(parseStoredCart("{}", lookup)).toEqual([]);
    expect(parseStoredCart("[]", lookup)).toEqual([]);
  });

  it("drops unknown products, unavailable products and bad quantities", () => {
    const unavailable = { ...samsung, inStock: false };
    const raw = JSON.stringify([
      { productId: "does-not-exist", quantity: 1 },
      { productId: unavailable.id, quantity: 1 },
      { productId: macbook.id, quantity: 0 },
      { productId: macbook.id, quantity: "many" },
      { productId: logitech.id, quantity: 3 },
    ]);

    expect(parseStoredCart(raw, (id) =>
      id === unavailable.id ? unavailable : lookup(id),
    )).toEqual([
      { product: logitech, quantity: 3, selectedVariant: undefined },
    ]);
  });

  it("clamps persisted quantities and merges duplicate lines", () => {
    const raw = JSON.stringify([
      { productId: logitech.id, quantity: 40 },
      { productId: logitech.id, quantity: 40 },
    ]);

    expect(parseStoredCart(raw, lookup)).toEqual([
      { product: logitech, quantity: logitech.stock, selectedVariant: undefined },
    ]);
  });
});

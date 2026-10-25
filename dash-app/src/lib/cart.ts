import type { Product } from "@/types/product";

/**
 * Cart domain logic.
 *
 * The cart stores whole products for rendering convenience, but only
 * `{ productId, quantity }` is persisted. Stock rules live here (not in the
 * UI) so every entry point — product page, cart page, restored storage — is
 * validated the same way.
 */

export const CART_STORAGE_KEY = "dash-cart";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export type AddFailureReason = "out-of-stock" | "stock-limit";

export type AddItemResult =
  | { ok: true; quantity: number }
  | { ok: false; reason: AddFailureReason; available: number };

export type CartAction =
  | {
      type: "ADD_ITEM";
      payload: { product: Product; quantity: number; variant?: string };
    }
  | {
      type: "REMOVE_ITEM";
      payload: { productId: string; variant?: string };
    }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number; variant?: string };
    }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

export const EMPTY_CART_STATE: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
};

function toWholeQuantity(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.floor(value));
}

function clampQuantity(quantity: number, stock: number): number {
  return Math.min(toWholeQuantity(quantity), Math.max(0, stock));
}

function sameLine(
  item: CartItem,
  productId: string,
  variant?: string,
): boolean {
  return item.product.id === productId && item.selectedVariant === variant;
}

/** Recalculate derived totals from the lines. Single source of truth. */
export function createCartState(items: CartItem[]): CartState {
  const sanitized = items
    .filter((item) => item.product.inStock && item.product.stock > 0)
    .map((item) => ({
      ...item,
      quantity: clampQuantity(item.quantity, item.product.stock),
    }));

  return {
    items: sanitized,
    totalItems: sanitized.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: sanitized.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    ),
  };
}

/**
 * Decide whether an add-to-cart request can be satisfied. Returning a result
 * (rather than throwing or calling `alert`) lets the UI show accessible,
 * contextual feedback.
 */
export function resolveAddItem(
  state: CartState,
  product: Product,
  quantity = 1,
  variant?: string,
): AddItemResult {
  if (!product.inStock || product.stock <= 0) {
    return { ok: false, reason: "out-of-stock", available: 0 };
  }

  const existing = state.items.find((item) =>
    sameLine(item, product.id, variant),
  );
  const requested = toWholeQuantity(quantity);
  const available = Math.max(0, product.stock - (existing?.quantity ?? 0));

  if (available === 0 || requested > available) {
    return { ok: false, reason: "stock-limit", available };
  }

  return { ok: true, quantity: requested };
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity, variant } = action.payload;
      if (!product.inStock || product.stock <= 0) return state;

      const existing = state.items.find((item) =>
        sameLine(item, product.id, variant),
      );
      const nextQuantity = clampQuantity(
        (existing?.quantity ?? 0) + toWholeQuantity(quantity),
        product.stock,
      );

      if (nextQuantity === (existing?.quantity ?? 0)) return state;

      const nextItems = existing
        ? state.items.map((item) =>
            sameLine(item, product.id, variant)
              ? { ...item, quantity: nextQuantity }
              : item,
          )
        : [...state.items, { product, quantity: nextQuantity, selectedVariant: variant }];

      return createCartState(nextItems);
    }

    case "REMOVE_ITEM": {
      const nextItems = state.items.filter(
        (item) =>
          !sameLine(item, action.payload.productId, action.payload.variant),
      );
      return nextItems.length === state.items.length
        ? state
        : createCartState(nextItems);
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity, variant } = action.payload;
      const existing = state.items.find((item) =>
        sameLine(item, productId, variant),
      );
      if (!existing) return state;

      if (!Number.isFinite(quantity) || quantity <= 0) {
        return createCartState(
          state.items.filter((item) => !sameLine(item, productId, variant)),
        );
      }

      const nextQuantity = clampQuantity(quantity, existing.product.stock);
      if (nextQuantity === existing.quantity) return state;

      return createCartState(
        state.items.map((item) =>
          sameLine(item, productId, variant)
            ? { ...item, quantity: nextQuantity }
            : item,
        ),
      );
    }

    case "CLEAR_CART":
      return EMPTY_CART_STATE;

    case "LOAD_CART":
      return createCartState(action.payload);

    default:
      return state;
  }
}

type StoredCartLine = {
  productId?: unknown;
  quantity?: unknown;
  selectedVariant?: unknown;
  /** Legacy shape: the full product object was persisted. */
  product?: { id?: unknown };
};

/**
 * Read persisted cart data defensively. Malformed JSON, unknown products,
 * deleted products and out-of-range quantities are dropped or clamped instead
 * of crashing the provider.
 */
export function parseStoredCart(
  raw: string | null,
  lookup: (productId: string) => Product | undefined,
): CartItem[] {
  if (!raw) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  const items: CartItem[] = [];

  for (const entry of parsed as StoredCartLine[]) {
    if (!entry || typeof entry !== "object") continue;

    const productId =
      typeof entry.productId === "string"
        ? entry.productId
        : typeof entry.product?.id === "string"
          ? entry.product.id
          : undefined;
    if (!productId) continue;

    const product = lookup(productId);
    if (!product || !product.inStock || product.stock <= 0) continue;

    const rawQuantity =
      typeof entry.quantity === "number" ? entry.quantity : Number(entry.quantity);
    if (!Number.isFinite(rawQuantity) || rawQuantity <= 0) continue;

    const selectedVariant =
      typeof entry.selectedVariant === "string"
        ? entry.selectedVariant
        : undefined;

    const existing = items.find((item) =>
      sameLine(item, productId, selectedVariant),
    );
    const quantity = clampQuantity(
      (existing?.quantity ?? 0) + rawQuantity,
      product.stock,
    );

    if (existing) {
      existing.quantity = quantity;
    } else {
      items.push({ product, quantity, selectedVariant });
    }
  }

  return items;
}

/** Persist the minimum needed to rebuild the cart: product id and quantity. */
export function serializeCart(items: CartItem[]): string {
  return JSON.stringify(
    items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      ...(item.selectedVariant ? { selectedVariant: item.selectedVariant } : {}),
    })),
  );
}

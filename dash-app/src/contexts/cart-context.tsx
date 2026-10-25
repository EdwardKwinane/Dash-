"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useSyncExternalStore,
} from "react";
import type { Product } from "@/types/product";
import { getProductById } from "@/lib/data/products";
import {
  CART_STORAGE_KEY,
  EMPTY_CART_STATE,
  cartReducer,
  parseStoredCart,
  resolveAddItem,
  serializeCart,
  type AddItemResult,
  type CartAction,
  type CartState,
} from "@/lib/cart";

interface CartContextValue {
  state: CartState;
  /** False during the first paint so UI can avoid acting on the empty cart. */
  isHydrated: boolean;
  addItem: (
    product: Product,
    quantity?: number,
    variant?: string,
  ) => AddItemResult;
  removeItem: (productId: string, variant?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    variant?: string,
  ) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const noopSubscribe = () => () => {};

/**
 * Hydration flag without a `setState` effect: the server snapshot is `false`,
 * the client snapshot is `true`. UI can therefore avoid acting on the empty
 * server-rendered cart without causing a cascading render.
 */
function useIsHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, rawDispatch] = useReducer(cartReducer, EMPTY_CART_STATE);
  const isHydrated = useIsHydrated();
  const hasRestored = useRef(false);

  // Keep an always-current snapshot so rapid clicks validate against the
  // latest state rather than the state captured by the last render.
  const stateRef = useRef(state);

  // Persist from the dispatch itself rather than from an effect. An effect
  // would fire once with the empty server-rendered cart (and again under
  // StrictMode) and could overwrite a returning shopper's saved cart before
  // the restore lands.
  const dispatch = useCallback((action: CartAction) => {
    const next = cartReducer(stateRef.current, action);
    stateRef.current = next;
    rawDispatch(action);

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(next.items));
    } catch {
      // Storage can be unavailable (private mode, quota). The cart still works
      // for this session; persistence is a convenience, not a requirement.
    }
  }, []);

  useEffect(() => {
    if (hasRestored.current) return;
    hasRestored.current = true;

    const items = parseStoredCart(
      window.localStorage.getItem(CART_STORAGE_KEY),
      getProductById,
    );

    if (items.length > 0) {
      dispatch({ type: "LOAD_CART", payload: items });
    }
  }, [dispatch]);

  const addItem = useCallback(
    (product: Product, quantity = 1, variant?: string): AddItemResult => {
      const result = resolveAddItem(
        stateRef.current,
        product,
        quantity,
        variant,
      );

      if (result.ok) {
        dispatch({
          type: "ADD_ITEM",
          payload: { product, quantity: result.quantity, variant },
        });
      }

      return result;
    },
    [dispatch],
  );

  const removeItem = useCallback(
    (productId: string, variant?: string) => {
      dispatch({ type: "REMOVE_ITEM", payload: { productId, variant } });
    },
    [dispatch],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, variant?: string) => {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { productId, quantity, variant },
      });
    },
    [dispatch],
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, [dispatch]);

  const value = useMemo(
    () => ({
      state,
      isHydrated,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [state, isHydrated, addItem, removeItem, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

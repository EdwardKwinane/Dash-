"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number; variant?: string } }
  | { type: "REMOVE_ITEM"; payload: { productId: string; variant?: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number; variant?: string } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

const CartContext = createContext<{
  state: CartState;
  addItem: (product: Product, quantity?: number, variant?: string) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
} | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity, variant } = action.payload;
      const existingIndex = state.items.findIndex(
        item => item.product.id === product.id && item.selectedVariant === variant
      );

      let newItems: CartItem[];
      if (existingIndex > -1) {
        newItems = [...state.items];
        newItems[existingIndex].quantity += quantity;
      } else {
        newItems = [...state.items, { product, quantity, selectedVariant: variant }];
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

      return { items: newItems, totalItems, subtotal };
    }
    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        item => !(item.product.id === action.payload.productId && item.selectedVariant === action.payload.variant)
      );
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      return { items: newItems, totalItems, subtotal };
    }
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        const newItems = state.items.filter(
          item => !(item.product.id === action.payload.productId && item.selectedVariant === action.payload.variant)
        );
        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        return { items: newItems, totalItems, subtotal };
      }

      const newItems = state.items.map(item =>
        item.product.id === action.payload.productId && item.selectedVariant === action.payload.variant
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      return { items: newItems, totalItems, subtotal };
    }
    case "CLEAR_CART":
      return { items: [], totalItems: 0, subtotal: 0 };
    case "LOAD_CART": {
      const items = action.payload;
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      return { items, totalItems, subtotal };
    }
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], totalItems: 0, subtotal: 0 });

  useEffect(() => {
    const savedCart = localStorage.getItem("dash-cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: parsed });
      } catch {
        console.error("Failed to load cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dash-cart", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product: Product, quantity = 1, variant?: string) => {
    if (quantity > product.stock) {
      alert("Not enough stock available");
      return;
    }
    dispatch({ type: "ADD_ITEM", payload: { product, quantity, variant } });
  };

  const removeItem = (productId: string, variant?: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId, variant } });
  };

  const updateQuantity = (productId: string, quantity: number, variant?: string) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity, variant } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

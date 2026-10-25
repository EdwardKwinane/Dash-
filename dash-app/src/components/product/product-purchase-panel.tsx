"use client";

import Link from "next/link";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import type { Product } from "@/types/product";

type Feedback = {
  tone: "success" | "error";
  message: string;
};

/**
 * Quantity and add-to-cart controls. Stock limits are enforced by the cart
 * domain layer; this component surfaces the outcome inline instead of using
 * `alert()`, so the message is announced and stays on screen.
 */
export function ProductPurchasePanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const quantityLabelId = useId();

  const maxQuantity = Math.max(0, product.stock);
  const canPurchase = product.inStock && maxQuantity > 0;

  const handleAdd = () => {
    const result = addItem(product, quantity);

    if (result.ok) {
      setFeedback({
        tone: "success",
        message: `Added ${result.quantity} × ${product.name} to your cart.`,
      });
      return;
    }

    if (result.reason === "stock-limit") {
      setFeedback({
        tone: "error",
        message:
          result.available > 0
            ? `Only ${result.available} more can be added — this demo has ${maxQuantity} in stock.`
            : `You already have all ${maxQuantity} available units in your cart.`,
      });
      return;
    }

    setFeedback({
      tone: "error",
      message: "This product is out of stock in the demo catalogue.",
    });
  };

  return (
    <div className="space-y-4">
      <p
        className={`text-sm font-medium ${
          canPurchase ? "text-[#15803d]" : "text-[#b91c1c]"
        }`}
      >
        {canPurchase
          ? `In stock — ${maxQuantity} available`
          : "Out of stock in this demo catalogue"}
      </p>

      {canPurchase && (
        <div className="flex flex-wrap items-center gap-4">
          <span id={quantityLabelId} className="text-sm text-ink-muted">
            Quantity
          </span>
          <div
            role="group"
            aria-labelledby={quantityLabelId}
            className="flex items-center rounded-card border border-line"
          >
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              disabled={quantity <= 1}
              aria-label={`Decrease quantity of ${product.name}`}
              className="px-4 py-2 text-ink hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <span
              aria-live="polite"
              aria-atomic="true"
              className="min-w-12 border-x border-line px-4 py-2 text-center"
            >
              <span className="sr-only">Quantity: </span>
              {quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                setQuantity((current) => Math.min(maxQuantity, current + 1))
              }
              disabled={quantity >= maxQuantity}
              aria-label={`Increase quantity of ${product.name}`}
              className="px-4 py-2 text-ink hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <Button
        type="button"
        onClick={handleAdd}
        disabled={!canPurchase}
        className="h-12 w-full rounded-card bg-brand text-white hover:bg-brand-hover"
      >
        <ShoppingCart className="h-5 w-5" aria-hidden="true" />
        {canPurchase ? "Add to cart" : "Out of stock"}
      </Button>

      <div aria-live="polite" role="status">
        {feedback && (
          <p
            className={`flex items-start gap-2 rounded-card border px-4 py-3 text-sm ${
              feedback.tone === "success"
                ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
                : "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]"
            }`}
          >
            {feedback.tone === "success" && (
              <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span>
              {feedback.message}
              {feedback.tone === "success" && (
                <>
                  {" "}
                  <Link href="/cart" className="font-medium underline">
                    View cart
                  </Link>
                </>
              )}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

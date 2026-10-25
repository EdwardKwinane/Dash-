"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { state, isHydrated, updateQuantity, removeItem } = useCart();

  if (!isHydrated) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold text-ink">Shopping cart</h1>
          <p role="status" className="text-ink-muted">
            Loading your cart…
          </p>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-content px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-3xl font-bold text-ink">
            Your cart is empty
          </h1>
          <p className="mb-8 text-ink-muted">
            Add a product to start a demo order. Nothing is charged or shipped
            in this build.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="h-auto rounded-card bg-brand px-6 py-3 text-white hover:bg-brand-hover"
            >
              <Link href="/products">Browse products</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto rounded-card border-line px-6 py-3 text-ink hover:bg-surface"
            >
              <Link href="/search">Search the catalogue</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-ink">Shopping cart</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <ul className="space-y-4 lg:col-span-2">
            {state.items.map((item) => {
              const atMax = item.quantity >= item.product.stock;
              return (
                <li
                  key={item.product.id}
                  className="flex gap-4 rounded-card border border-line bg-white p-4"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-card bg-surface">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.altText?.[0] ?? item.product.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold text-ink">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="line-clamp-2 hover:text-brand"
                      >
                        {item.product.name}
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm text-ink-muted">
                      {item.product.brand}
                    </p>
                    <p className="mt-1 text-sm text-ink-muted">
                      {formatPrice(item.product.price)} each
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div
                        role="group"
                        aria-label={`Quantity of ${item.product.name}`}
                        className="flex items-center rounded-card border border-line"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedVariant,
                            )
                          }
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${item.product.name}`}
                          className="px-3 py-1.5 text-ink hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <span className="min-w-10 border-x border-line px-3 py-1.5 text-center">
                          <span className="sr-only">Quantity: </span>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedVariant,
                            )
                          }
                          disabled={atMax}
                          aria-label={`Increase quantity of ${item.product.name}`}
                          className="px-3 py-1.5 text-ink hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeItem(
                            item.product.id,
                            item.selectedVariant,
                          )
                        }
                        className="text-[#b91c1c] hover:bg-[#fef2f2] hover:text-[#991b1b]"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        Remove{" "}
                        <span className="sr-only">{item.product.name}</span>
                      </Button>
                    </div>

                    {atMax && (
                      <p className="mt-2 text-xs text-ink-muted">
                        Maximum available quantity reached ({item.product.stock}).
                      </p>
                    )}
                  </div>

                  <p className="shrink-0 self-start font-bold text-ink">
                    <span className="sr-only">Line total: </span>
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-card border border-line bg-surface p-6">
              <h2 className="mb-4 text-xl font-bold text-ink">Order summary</h2>
              <dl className="space-y-3">
                <div className="flex justify-between gap-4 text-ink">
                  <dt>
                    Subtotal ({state.totalItems}{" "}
                    {state.totalItems === 1 ? "item" : "items"})
                  </dt>
                  <dd aria-live="polite">{formatPrice(state.subtotal)}</dd>
                </div>
                <div className="flex justify-between gap-4 text-ink-muted">
                  <dt>Delivery</dt>
                  <dd className="text-right text-sm">
                    Not configured in this demo
                  </dd>
                </div>
                <div className="flex justify-between gap-4 text-ink-muted">
                  <dt>Tax</dt>
                  <dd className="text-right text-sm">
                    Not configured in this demo
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-line pt-3 text-lg font-bold text-ink">
                  <dt>Total</dt>
                  <dd>{formatPrice(state.subtotal)}</dd>
                </div>
              </dl>

              <Button
                asChild
                className="mt-5 h-12 w-full rounded-card bg-brand text-white hover:bg-brand-hover"
              >
                <Link href="/checkout">Continue to demo checkout</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="mt-3 w-full rounded-card border-line"
              >
                <Link href="/products">Continue shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

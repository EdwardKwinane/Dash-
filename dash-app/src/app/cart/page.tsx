"use client";

import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/data/products";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { state, updateQuantity, removeItem } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-[#0A0A0A] mb-4">Your Cart is Empty</h1>
          <p className="text-[#52525B] mb-8">Add some products to get started</p>
          <Button asChild className="bg-[#A855F7] hover:bg-[#9333EA] text-white">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#0A0A0A] mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item, idx) => (
              <div key={`${item.product.id}-${item.selectedVariant}-${idx}`} className="flex gap-4 p-4 border border-[#E5E7EB] rounded-lg bg-white">
                <div className="w-24 h-24 bg-[#F9FAFB] rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.slug}`} className="font-semibold text-[#0A0A0A] hover:text-[#A855F7] line-clamp-2">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-[#52525B] mt-1">{item.product.brand}</p>
                  <p className="font-bold text-[#0A0A0A] mt-2">{formatPrice(item.product.price)}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-[#E5E7EB] rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant)}
                        className="px-3 py-1 hover:bg-[#F9FAFB]"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-x border-[#E5E7EB]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1), item.selectedVariant)}
                        className="px-3 py-1 hover:bg-[#F9FAFB]"
                      >
                        +
                      </button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.product.id, item.selectedVariant)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-[#0A0A0A]">
                  <span>Subtotal ({state.totalItems} items)</span>
                  <span>{formatPrice(state.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#0A0A0A]">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-[#E5E7EB] pt-3 flex justify-between font-bold text-[#0A0A0A] text-lg">
                  <span>Total</span>
                  <span>{formatPrice(state.subtotal)}</span>
                </div>
              </div>
              <Button asChild className="w-full bg-[#A855F7] hover:bg-[#9333EA] text-white h-12 mb-3">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-[#E5E7EB]">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

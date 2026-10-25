"use client";

import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/data/products";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    phone: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const isEmpty = state.items.length === 0;

  // Redirect in an effect, never during render: running router.push() while
  // rendering breaks server prerendering (location is not defined).
  useEffect(() => {
    if (isEmpty) {
      router.push("/cart");
    }
  }, [isEmpty, router]);

  if (isEmpty) {
    return (
      <div className="bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-[#0A0A0A] mb-4">
            Your cart is empty
          </h1>
          <p className="text-[#52525B] mb-8">
            Add a product before continuing to checkout.
          </p>
          <Button asChild className="bg-[#A855F7] hover:bg-[#9333EA] text-white">
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // The reference is created here, in an event handler, so the confirmation
    // page can render a stable value during prerendering and hydration.
    const orderReference = `DASH-${Math.random()
      .toString(36)
      .slice(2, 11)
      .toUpperCase()}`;

    // Simulate processing
    setTimeout(() => {
      clearCart();
      router.push(`/checkout/success?ref=${orderReference}`);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#0A0A0A] mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="border border-[#E5E7EB] rounded-lg p-6 bg-white">
                <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Contact Information</h2>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
                />
              </div>

              <div className="border border-[#E5E7EB] rounded-lg p-6 bg-white">
                <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="md:col-span-2 px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
                  />
                  <input
                    type="text"
                    name="province"
                    placeholder="Province"
                    value={formData.province}
                    onChange={handleChange}
                    required
                    className="px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
                  />
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal code"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    className="px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="md:col-span-2 px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
                  />
                </div>
              </div>

              <div className="border border-[#E5E7EB] rounded-lg p-6 bg-white">
                <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Payment</h2>
                <p className="text-[#52525B] mb-4">Demo Checkout - No real payment will be processed</p>
                <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                  <p className="text-sm text-[#52525B]">This is a demo checkout. In production, this would integrate with Yoco or PayFast for South African payments.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {state.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-16 h-16 bg-white rounded overflow-hidden flex-shrink-0 border border-[#E5E7EB]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0A0A0A] line-clamp-2">{item.product.name}</p>
                        <p className="text-sm text-[#52525B]">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-[#0A0A0A]">{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#E5E7EB] pt-3 space-y-2 mb-4">
                  <div className="flex justify-between text-[#0A0A0A]">
                    <span>Subtotal</span>
                    <span>{formatPrice(state.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#0A0A0A]">
                    <span>Shipping</span>
                    <span>R150.00</span>
                  </div>
                  <div className="border-t border-[#E5E7EB] pt-2 flex justify-between font-bold text-[#0A0A0A] text-lg">
                    <span>Total</span>
                    <span>{formatPrice(state.subtotal + 15000)}</span>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full bg-[#A855F7] hover:bg-[#9333EA] text-white h-12"
                >
                  {isProcessing ? "Processing..." : "Place Order (Demo)"}
                </Button>
                <p className="text-xs text-[#52525B] text-center mt-2">
                  By placing this order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

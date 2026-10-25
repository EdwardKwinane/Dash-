"use client";

import { useParams } from "next/navigation";
import { products, formatPrice } from "@/lib/data/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { ShoppingCart, Heart, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = products.find(p => p.slug === slug);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Button asChild>
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product.inStock) return;
    if (quantity > product.stock) {
      alert("Not enough stock available");
      return;
    }
    addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-[#F9FAFB] rounded-lg overflow-hidden border border-[#E5E7EB]">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[#52525B] mb-2">{product.brand}</p>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0A0A0A] mb-4">{product.name}</h1>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl md:text-3xl font-bold text-[#0A0A0A]">{formatPrice(product.price)}</span>
                {product.compareAtPrice && (
                  <span className="text-xl text-[#52525B] line-through">{formatPrice(product.compareAtPrice)}</span>
                )}
              </div>
              {product.rating && (
                <p className="text-[#52525B]">★ {product.rating} ({product.reviewCount} reviews)</p>
              )}
            </div>

            <div className="border-t border-[#E5E7EB] pt-6">
              <p className="text-[#0A0A0A] mb-4">{product.description}</p>
              <ul className="space-y-2">
                {product.keySellingPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[#0A0A0A]">
                    <Check className="h-5 w-5 text-[#A855F7] mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[#E5E7EB] pt-6 space-y-4">
              <div>
                <p className="text-sm text-[#52525B] mb-1">SKU: {product.sku}</p>
                <p className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </p>
              </div>

              {product.inStock && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#E5E7EB] rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-[#F9FAFB]"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-[#E5E7EB]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2 hover:bg-[#F9FAFB]"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-[#A855F7] hover:bg-[#9333EA] text-white rounded-lg h-12"
                >
                  {addedToCart ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </>
                  )}
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 border-[#E5E7EB]">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {product.warranty && (
                <p className="text-sm text-[#52525B]">✓ {product.warranty}</p>
              )}
            </div>

            <div className="border-t border-[#E5E7EB] pt-6">
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Specifications</h2>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-[#E5E7EB] last:border-0">
                    <span className="text-[#52525B]">{key}</span>
                    <span className="text-[#0A0A0A] font-medium text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { products, formatPrice } from "@/lib/data/products";

export default function ProductsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A0A0A] mb-2">All Products</h1>
          <p className="text-[#52525B]">{products.length} products</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="group">
              <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="aspect-square bg-[#F9FAFB] relative overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.onSale && (
                    <span className="absolute top-2 left-2 bg-[#A855F7] text-white px-2 py-1 rounded-full text-xs">
                      Sale
                    </span>
                  )}
                  {product.newArrival && !product.onSale && (
                    <span className="absolute top-2 left-2 bg-[#A855F7] text-white px-2 py-1 rounded-full text-xs">
                      New
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-sm text-[#52525B] mb-1">{product.brand}</p>
                  <h3 className="font-semibold text-[#0A0A0A] mb-2 line-clamp-2 flex-1">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-lg font-bold text-[#0A0A0A]">{formatPrice(product.price)}</span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-[#52525B] line-through">{formatPrice(product.compareAtPrice)}</span>
                    )}
                  </div>
                  {!product.inStock && (
                    <p className="text-sm text-red-600 mt-2">Out of Stock</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

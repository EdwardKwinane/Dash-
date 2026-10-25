import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

/**
 * Shared product card used by the homepage, category and search listings.
 * Keeps price/badge/stock presentation consistent across routes.
 */
export function ProductCard({ product }: ProductCardProps) {
  const badge = product.onSale
    ? "Sale"
    : product.newArrival
      ? "New"
      : product.featured
        ? "Featured"
        : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white transition-colors hover:border-brand"
    >
      <div className="relative aspect-square overflow-hidden bg-surface">
        {/* Seeded demo imagery served from the configured Unsplash host. */}
        <Image
          src={product.images[0]}
          alt={product.altText?.[0] ?? product.name}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
        />
        {badge && (
          <span className="absolute left-3 top-3 rounded-pill bg-brand px-2.5 py-1 text-xs font-medium text-white">
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-sm text-ink-muted">{product.brand}</p>
        <h3 className="mb-3 line-clamp-2 flex-1 font-semibold text-ink">
          {product.name}
        </h3>

        <div className="mt-auto flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-bold text-ink">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-ink-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {product.inStock ? (
          <p className="mt-2 text-xs text-[#15803d]">
            In stock · {product.stock} available
          </p>
        ) : (
          <p className="mt-2 text-xs font-medium text-[#b91c1c]">Out of stock</p>
        )}
      </div>
    </Link>
  );
}

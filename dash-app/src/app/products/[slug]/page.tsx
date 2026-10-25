import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { categories, getProductBySlug, products } from "@/lib/data/products";
import { categoryNameToSlug } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

// Only slugs in the seeded catalogue exist. Without this, an unknown slug is
// rendered on demand and the not-found response can be streamed as 200.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found | Dash#" };
  }

  return {
    title: `${product.name} | Dash#`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  // Unknown slugs render the branded not-found page with a real 404 status.
  if (!product) notFound();

  const category = categories.find((entry) => entry.name === product.category);
  const categoryHref = `/categories/${category?.slug ?? categoryNameToSlug(product.category)}`;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            <li>
              <Link href="/" className="hover:text-brand">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/products" className="hover:text-brand">
                Products
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={categoryHref} className="hover:text-brand">
                {product.category}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-square overflow-hidden rounded-card border border-line bg-surface">
            <Image
              src={product.images[0]}
              alt={product.altText?.[0] ?? product.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="mb-2 text-ink-muted">{product.brand}</p>
              <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">
                {product.name}
              </h1>
              <div className="mb-4 flex flex-wrap items-baseline gap-3">
                <span className="text-2xl font-bold text-ink md:text-3xl">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-xl text-ink-muted line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
              {product.rating !== undefined && (
                <p className="text-ink-muted">
                  <span aria-hidden="true">★ </span>
                  {product.rating}
                  {product.reviewCount !== undefined &&
                    ` (${product.reviewCount} reviews in demo data)`}
                </p>
              )}
            </div>

            <div className="border-t border-line pt-6">
              <p className="mb-4 text-ink">{product.description}</p>
              <ul className="space-y-2">
                {product.keySellingPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-ink">
                    <Check
                      className="mt-0.5 h-5 w-5 shrink-0 text-brand"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 border-t border-line pt-6">
              <p className="text-sm text-ink-muted">SKU: {product.sku}</p>

              <ProductPurchasePanel product={product} />

              {product.warranty && (
                <p className="text-sm text-ink-muted">{product.warranty}</p>
              )}

              <p className="text-sm text-ink-muted">
                Demo pricing in South African rand. Delivery and tax are not
                configured in this build.
              </p>
            </div>

            <div className="border-t border-line pt-6">
              <h2 className="mb-4 text-xl font-bold text-ink">Specifications</h2>
              <dl className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between gap-4 border-b border-line py-2 last:border-0"
                  >
                    <dt className="text-ink-muted">{key}</dt>
                    <dd className="text-right font-medium text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

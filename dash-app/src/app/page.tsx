import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Lock, PackageCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { SearchBar } from "@/components/search/search-bar";
import { NewsletterSignup } from "@/components/home/newsletter";
import { categories, getProductsInCategory, products } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";

export default function Home() {
  const featured = products.filter((product) => product.featured).slice(0, 3);
  const newArrivals = products
    .filter((product) => product.newArrival)
    .slice(0, 3);
  const heroProduct = products.find((product) => product.featured);

  return (
    <div className="bg-white">
      {/* Demo data disclosure — required until a live product feed exists. */}
      <div className="border-b border-line bg-surface">
        <p className="mx-auto max-w-content px-4 py-2 text-center text-sm text-ink-muted sm:px-6 lg:px-8">
          Demo storefront — products, prices and stock are seeded sample data,
          not live inventory.
        </p>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-content px-4 pb-12 pt-10 sm:px-6 md:pb-14 md:pt-14 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex items-center rounded-pill border border-line bg-surface px-3 py-1 text-xs font-medium text-ink-muted">
              South African electronics retailer
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
              Premium electronics, chosen with confidence.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-muted">
              Smartphones, laptops, audio and accessories from the brands that
              matter — with clear specifications, honest availability and
              search and filters that work on the real catalogue.
            </p>

            <div className="mt-6 max-w-lg">
              <SearchBar size="lg" />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-auto rounded-card bg-brand px-6 py-3 text-white hover:bg-brand-hover"
              >
                <Link href="/products">
                  Shop all products
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto rounded-card border-line px-6 py-3 text-ink hover:bg-surface"
              >
                <Link href="/categories/laptops-computers">
                  Browse laptops
                </Link>
              </Button>
            </div>

            {/* Honest catalogue facts, folded compactly instead of a stat panel. */}
            <p className="mt-8 text-sm text-ink-muted">
              {categories.length} categories · {products.length} products ·
              prices in ZAR · seeded demo data
            </p>
          </div>

          {heroProduct ? (
            <Link
              href={`/products/${heroProduct.slug}`}
              className="group overflow-hidden rounded-card border border-line bg-white transition-colors hover:border-brand focus-visible:border-brand"
            >
              <span className="relative block aspect-[16/10] overflow-hidden bg-surface sm:aspect-[4/3] lg:aspect-square">
                <Image
                  src={heroProduct.images[0]}
                  alt={heroProduct.altText?.[0] ?? heroProduct.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 640px, (min-width: 640px) 60vw, 100vw"
                  className="object-cover transition-transform duration-300 motion-reduce:transform-none group-hover:scale-[1.02]"
                />
              </span>
              <span className="block border-t border-line p-5">
                <span className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Featured product
                </span>
                <span className="mt-1 block font-semibold text-ink transition-colors group-hover:text-brand">
                  {heroProduct.name}
                </span>
                <span className="mt-1 block text-ink-muted">
                  {formatPrice(heroProduct.price)}
                </span>
                <span className="mt-3 inline-flex items-center text-sm font-medium text-brand transition-colors group-hover:text-brand-hover">
                  View product
                  <ArrowRight
                    className="ml-1 h-4 w-4"
                    aria-hidden="true"
                  />
                </span>
              </span>
            </Link>
          ) : null}
        </div>
      </section>

      {/* Categories */}
      <section
        aria-labelledby="categories-heading"
        className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mb-6 max-w-2xl">
          <h2
            id="categories-heading"
            className="text-2xl font-bold text-ink md:text-3xl"
          >
            Shop by category
          </h2>
          <p className="mt-2 text-ink-muted">
            Seven real category routes across the catalogue, from flagships to
            peripherals.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((category) => {
            const categoryProducts = getProductsInCategory(category.name);
            const representative = categoryProducts[0];
            const countLabel = `${categoryProducts.length} ${
              categoryProducts.length === 1 ? "product" : "products"
            }`;

            return (
              <li key={category.id}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white transition-colors hover:border-brand focus-visible:border-brand"
                >
                  {representative ? (
                    <span className="relative block aspect-[4/3] overflow-hidden bg-surface">
                      {/* The adjacent heading conveys the meaning; the image is
                          illustrative, so it is decorative to screen readers. */}
                      <Image
                        src={representative.images[0]}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
                        className="object-cover transition-transform duration-300 motion-reduce:transform-none group-hover:scale-105"
                      />
                    </span>
                  ) : (
                    <span className="flex aspect-[4/3] items-center justify-center bg-surface px-6 text-center">
                      <span className="text-sm text-ink-muted">
                        New products arrive here first
                      </span>
                    </span>
                  )}
                  <span className="flex flex-1 flex-col p-4">
                    <span className="font-semibold text-ink transition-colors group-hover:text-brand">
                      {category.name}
                    </span>
                    {category.description && (
                      <span className="mt-1 line-clamp-2 text-xs text-ink-muted sm:text-sm">
                        {category.description}
                      </span>
                    )}
                    <span className="mt-auto pt-3 text-xs font-medium text-brand">
                      {countLabel}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Featured */}
      <section
        aria-labelledby="featured-heading"
        className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2
              id="featured-heading"
              className="text-2xl font-bold text-ink md:text-3xl"
            >
              Featured products
            </h2>
            <p className="mt-2 text-ink-muted">
              Hand-picked from the seeded catalogue.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center text-sm font-medium text-brand hover:text-brand-hover"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {featured.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index === 0}
            />
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section
        aria-labelledby="new-arrivals-heading"
        className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2
              id="new-arrivals-heading"
              className="text-2xl font-bold text-ink md:text-3xl"
            >
              New arrivals
            </h2>
            <p className="mt-2 text-ink-muted">
              The latest records added to the catalogue.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center text-sm font-medium text-brand hover:text-brand-hover"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust / capability statements — only claims the build actually honours. */}
      <section
        aria-labelledby="assurance-heading"
        className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8"
      >
        <h2 id="assurance-heading" className="sr-only">
          How Dash# works
        </h2>
        <div className="grid gap-6 rounded-card border border-line bg-surface p-6 sm:p-10 md:grid-cols-3">
          <div>
            <Lock className="h-5 w-5 text-brand" aria-hidden="true" />
            <h3 className="mt-3 font-semibold text-ink">
              No card details collected
            </h3>
            <p className="mt-2 text-sm text-ink-muted">
              Checkout in this build is a demo. Card data is never requested or
              stored in the application.
            </p>
          </div>
          <div>
            <PackageCheck className="h-5 w-5 text-brand" aria-hidden="true" />
            <h3 className="mt-3 font-semibold text-ink">
              Stock rules enforced
            </h3>
            <p className="mt-2 text-sm text-ink-muted">
              Quantity is capped by available stock on product pages and in the
              cart, so unavailable items cannot be added.
            </p>
          </div>
          <div>
            <Sparkles className="h-5 w-5 text-brand" aria-hidden="true" />
            <h3 className="mt-3 font-semibold text-ink">
              Planned: catalogue assistant
            </h3>
            <p className="mt-2 text-sm text-ink-muted">
              A catalogue-grounded shopping assistant is planned, not built. No
              assistant answers are shown in this version.
            </p>
          </div>
        </div>
      </section>

      <NewsletterSignup />
    </div>
  );
}

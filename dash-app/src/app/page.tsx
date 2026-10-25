import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { NewsletterSignup } from "@/components/home/newsletter";
import { categories, products } from "@/lib/data/products";

export default function Home() {
  const featured = products.filter((product) => product.featured).slice(0, 3);
  const newArrivals = products.filter((product) => product.newArrival).slice(0, 4);

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
      <section className="mx-auto max-w-content px-4 pb-10 pt-12 sm:px-6 md:pt-16 lg:px-8">
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
              matter — with clear specifications, honest availability and a
              shopping assistant that only recommends what is actually in
              catalogue.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
          </div>

          {/* Contained surface — never the page canvas. */}
          <div className="rounded-card border border-line bg-surface p-6">
            <dl className="grid grid-cols-2 gap-6">
              <div>
                <dt className="text-sm text-ink-muted">Categories</dt>
                <dd className="mt-1 text-2xl font-bold text-ink">
                  {categories.length}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-ink-muted">Products in catalogue</dt>
                <dd className="mt-1 text-2xl font-bold text-ink">
                  {products.length}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-ink-muted">Currency</dt>
                <dd className="mt-1 text-2xl font-bold text-ink">ZAR</dd>
              </div>
              <div>
                <dt className="text-sm text-ink-muted">Pricing model</dt>
                <dd className="mt-1 text-2xl font-bold text-ink">Incl. VAT</dd>
              </div>
            </dl>
            <p className="mt-6 border-t border-line pt-4 text-sm text-ink-muted">
              Every product record carries SKU, stock and specifications so the
              same data drives listings, search, cart and recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
        aria-labelledby="categories-heading"
        className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 id="categories-heading" className="text-2xl font-bold text-ink md:text-3xl">
            Shop by category
          </h2>
        </div>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/categories/${category.slug}`}
                className="flex h-full flex-col rounded-card border border-line bg-white p-5 transition-colors hover:border-brand hover:bg-surface"
              >
                <span className="font-semibold text-ink">{category.name}</span>
                {category.description && (
                  <span className="mt-1 text-sm text-ink-muted">
                    {category.description}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured */}
      <section
        aria-labelledby="featured-heading"
        className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 id="featured-heading" className="text-2xl font-bold text-ink md:text-3xl">
            Featured products
          </h2>
          <Link
            href="/products"
            className="inline-flex items-center text-sm font-medium text-brand hover:text-brand-hover"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section
        aria-labelledby="new-arrivals-heading"
        className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2
            id="new-arrivals-heading"
            className="text-2xl font-bold text-ink md:text-3xl"
          >
            New arrivals
          </h2>
          <Link
            href="/products"
            className="inline-flex items-center text-sm font-medium text-brand hover:text-brand-hover"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust / capability statements — only claims the build actually honours. */}
      <section
        aria-labelledby="assurance-heading"
        className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8"
      >
        <h2 id="assurance-heading" className="sr-only">
          How Dash# works
        </h2>
        <div className="grid gap-6 rounded-card border border-line bg-surface p-6 sm:p-10 md:grid-cols-3">
          <div>
            <h3 className="font-semibold text-ink">No card details collected</h3>
            <p className="mt-2 text-sm text-ink-muted">
              Checkout in this build is a demo. Card data is never requested or
              stored in the application.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-ink">Stock rules enforced</h3>
            <p className="mt-2 text-sm text-ink-muted">
              Quantity is capped by available stock on product pages and in the
              cart, so unavailable items cannot be added.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-ink">Grounded recommendations</h3>
            <p className="mt-2 text-sm text-ink-muted">
              The assistant is designed to answer only from catalogue records,
              with links back to the product page.
            </p>
          </div>
        </div>
      </section>

      <NewsletterSignup />
    </div>
  );
}

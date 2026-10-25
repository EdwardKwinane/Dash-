import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { categories, products } from "@/lib/data/products";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categories.find((entry) => entry.slug === slug);

  if (!category) {
    notFound();
  }

  // Category membership is derived from the product record, so listings and
  // product pages can never disagree about where a product belongs.
  const categoryProducts = products.filter(
    (product) => product.category === category.name,
  );

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-ink-muted">
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
            <li aria-current="page" className="font-medium text-ink">
              {category.name}
            </li>
          </ol>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-ink md:text-4xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-2 text-ink-muted">{category.description}</p>
          )}
          <p className="mt-2 text-sm text-ink-muted">
            {categoryProducts.length}{" "}
            {categoryProducts.length === 1 ? "product" : "products"} · seeded
            demo catalogue
          </p>
          <Link
            href={`/products?category=${category.slug}`}
            className="mt-3 inline-block text-sm font-medium text-brand hover:text-brand-hover"
          >
            Filter and sort this category
          </Link>
        </header>

        {categoryProducts.length === 0 ? (
          <div className="rounded-card border border-line bg-surface p-10 text-center">
            <h2 className="text-lg font-semibold text-ink">
              Nothing in this category yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-ink-muted">
              No seeded products are assigned to {category.name}. Browse the
              full catalogue to see what is available.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block rounded-card bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-hover"
            >
              Browse all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

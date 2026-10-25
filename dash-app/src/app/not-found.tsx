import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search/search-bar";

export default function NotFound() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            404
          </p>
          <h1 className="mt-2 text-3xl font-bold text-ink md:text-4xl">
            We couldn’t find that page
          </h1>
          <p className="mt-4 text-ink-muted">
            The page or product may have been removed, or the link may be
            incorrect. Try searching the catalogue instead.
          </p>

          <div className="mx-auto mt-6 max-w-md">
            <SearchBar size="lg" />
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="h-auto rounded-card bg-brand px-6 py-3 text-white hover:bg-brand-hover"
            >
              <Link href="/products">Browse all products</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto rounded-card border-line px-6 py-3 text-ink hover:bg-surface"
            >
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

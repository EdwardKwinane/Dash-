"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep the failure visible to developers without exposing internals to
    // shoppers. Production would forward this to an error reporter.
    console.error(error);
  }, [error]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-content px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-ink md:text-4xl">
          Something went wrong
        </h1>
        <p className="mx-auto mt-4 max-w-md text-ink-muted">
          This page could not be displayed. You can try again, or continue
          browsing the catalogue.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={reset}
            className="h-auto rounded-card bg-brand px-6 py-3 text-white hover:bg-brand-hover"
          >
            Try again
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-auto rounded-card border-line px-6 py-3 text-ink hover:bg-surface"
          >
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

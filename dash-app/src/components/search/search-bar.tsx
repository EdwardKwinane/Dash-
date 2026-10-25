"use client";

import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  /** Current query from the URL, so the input stays in sync on navigation. */
  initialQuery?: string;
  /** Called after a successful navigation (used to close the mobile menu). */
  onNavigate?: () => void;
  className?: string;
  autoFocus?: boolean;
  size?: "sm" | "lg";
};

/**
 * Catalogue search. Submitting performs a client-side navigation to
 * `/search?q=...`, which keeps the query shareable and avoids a full reload.
 */
export function SearchBar({
  initialQuery = "",
  onNavigate,
  className,
  autoFocus = false,
  size = "sm",
}: SearchBarProps) {
  const router = useRouter();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(initialQuery);
  const [lastQuery, setLastQuery] = useState(initialQuery);

  // Adjust state during render (React's documented pattern) instead of in an
  // effect, so the input follows the URL without an extra render pass.
  if (initialQuery !== lastQuery) {
    setLastQuery(initialQuery);
    setValue(initialQuery);
  }

  const goToSearch = (query: string) => {
    const trimmed = query.trim().replace(/\s+/g, " ");
    router.push(
      trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search",
    );
    onNavigate?.();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    goToSearch(value);
  };

  const clear = () => {
    setValue("");
    inputRef.current?.focus();
    if (initialQuery) {
      router.push("/search");
      onNavigate?.();
    }
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("relative w-full", className)}
    >
      <label htmlFor={inputId} className="sr-only">
        Search products by name, brand or category
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        id={inputId}
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search products, brands or categories"
        autoComplete="off"
        autoFocus={autoFocus}
        enterKeyHint="search"
        className={cn(
          "w-full rounded-card border border-line bg-white pl-10 pr-10 text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 [&::-webkit-search-cancel-button]:hidden",
          size === "lg" ? "py-3 text-base" : "py-2 text-sm",
        )}
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ink-muted hover:bg-surface hover:text-ink"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Clear search</span>
        </button>
      )}
    </form>
  );
}

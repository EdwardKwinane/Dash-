"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search/search-bar";
import { useCart } from "@/contexts/cart-context";
import { categories } from "@/lib/data/products";
import { useEffect, useState } from "react";

export function Header() {
  const { state } = useCart();
  const pathname = usePathname();
  // The menu records the route it was opened on, so navigating (including
  // back/forward) closes it without an effect that writes state on every
  // route change.
  const [menu, setMenu] = useState({ open: false, pathname });
  const isMenuOpen = menu.open && menu.pathname === pathname;

  const setIsMenuOpen = (open: boolean) => setMenu({ open, pathname });

  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // `pathname` is intentionally excluded: the handler only closes the menu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuOpen]);

  const cartLabel =
    state.totalItems === 0
      ? "Cart, empty"
      : `Cart, ${state.totalItems} item${state.totalItems === 1 ? "" : "s"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          <Link href="/" className="flex shrink-0 items-center">
            {/* `fill` keeps the logo's aspect ratio at both header heights
                without Next.js warning that only one dimension was changed. */}
            <span className="relative block h-8 w-12 md:h-10 md:w-[60px]">
              <Image
                src="/logo.jpg"
                alt="Dash#"
                fill
                sizes="120px"
                className="object-contain object-left"
                priority
              />
            </span>
          </Link>

          {/* Desktop search */}
          <div className="mx-8 hidden max-w-xl flex-1 md:block">
            <SearchBar />
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart" aria-label={cartLabel}>
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                {state.totalItems > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs text-white"
                  >
                    {state.totalItems}
                  </span>
                )}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Desktop navigation */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 border-t border-line py-3 md:flex"
        >
          <Link
            href="/products"
            aria-current={pathname === "/products" ? "page" : undefined}
            className="text-sm text-ink transition-colors hover:text-brand aria-[current=page]:font-semibold aria-[current=page]:text-brand"
          >
            All products
          </Link>
          {categories.map((category) => {
            const href = `/categories/${category.slug}`;
            return (
              <Link
                key={category.id}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className="text-sm text-ink transition-colors hover:text-brand aria-[current=page]:font-semibold aria-[current=page]:text-brand"
              >
                {category.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!isMenuOpen}
        className="border-t border-line bg-white md:hidden"
      >
        <div className="px-4 py-4">
          <div className="mb-4">
            <SearchBar onNavigate={() => setIsMenuOpen(false)} />
          </div>
          <nav aria-label="Mobile" className="flex flex-col">
            <Link
              href="/products"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-line py-3 text-sm font-medium text-ink hover:text-brand"
            >
              All products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                onClick={() => setIsMenuOpen(false)}
                className="border-b border-line py-3 text-sm text-ink hover:text-brand"
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/search"
              onClick={() => setIsMenuOpen(false)}
              className="py-3 text-sm font-medium text-brand hover:text-brand-hover"
            >
              Search the catalogue
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { SearchBar } from "@/components/search/search-bar";
import { useCart } from "@/contexts/cart-context";
import { categories, products } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Storefront navigation ("navbar2"): single-row premium navbar with a
 * disclosure mega-menu for Shop and a small support menu.
 *
 * Interaction model: explicit click toggles (never hover-only), Escape closes
 * and returns focus to the trigger, a pointer-down outside the header closes,
 * and navigation closes both menus via the route snapshot recorded when the
 * menu was opened.
 */

const DESKTOP_LINKS = [
  { label: "Laptops", href: "/categories/laptops-computers" },
  { label: "Smartphones", href: "/categories/smartphones" },
  { label: "Audio", href: "/categories/headphones-earbuds" },
  { label: "Accessories", href: "/categories/accessories" },
] as const;

const SUPPORT_LINKS = [
  { label: "Contact us", href: "/contact" },
  { label: "Shipping & delivery", href: "/shipping" },
  { label: "Returns & refunds", href: "/returns" },
  { label: "Warranty", href: "/warranty" },
] as const;

const PANEL_ANIMATION =
  "animate-[menu-reveal_200ms_ease-out] motion-reduce:animate-none";

type DesktopMenu = "shop" | "support" | null;

export function Navbar2() {
  const pathname = usePathname();
  const { state } = useCart();

  // Menus record the route they were opened on, so navigating (including
  // back/forward) closes them without an effect that writes state on every
  // route change.
  const [desktop, setDesktop] = useState<{
    type: DesktopMenu;
    pathname: string;
  }>({ type: null, pathname });
  const [mobile, setMobile] = useState({ open: false, pathname });

  const openDesktopMenu =
    desktop.pathname === pathname ? desktop.type : null;
  const isMobileOpen = mobile.open && mobile.pathname === pathname;

  const headerRef = useRef<HTMLElement>(null);
  const shopTriggerRef = useRef<HTMLButtonElement>(null);
  const supportTriggerRef = useRef<HTMLButtonElement>(null);

  const toggleDesktopMenu = (type: Exclude<DesktopMenu, null>) => {
    // Opening one menu closes the other, and any open mobile menu.
    setDesktop({
      type: openDesktopMenu === type ? null : type,
      pathname,
    });
    setMobile({ open: false, pathname });
  };

  const toggleMobileMenu = () => {
    setDesktop({ type: null, pathname });
    setMobile({ open: !isMobileOpen, pathname });
  };

  const closeMenus = () => {
    setDesktop({ type: null, pathname });
    setMobile({ open: false, pathname });
  };

  useEffect(() => {
    if (!openDesktopMenu && !isMobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      // Return focus to the control that opened the menu before dismissing it.
      if (openDesktopMenu === "shop") shopTriggerRef.current?.focus();
      if (openDesktopMenu === "support") supportTriggerRef.current?.focus();
      closeMenus();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) closeMenus();
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
    // Handlers close the menus and must see the latest open state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDesktopMenu, isMobileOpen]);

  // A real launched product from the seeded catalogue, used to make the Shop
  // panel concrete without inventing content.
  const featuredProduct = products.find((product) => product.featured);

  const cartLabel =
    state.totalItems === 0
      ? "Cart, empty"
      : `Cart, ${state.totalItems} item${state.totalItems === 1 ? "" : "s"}`;

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-line bg-white"
    >
      <div className="mx-auto flex h-16 max-w-content items-center gap-2 px-4 sm:px-6 md:h-20 lg:gap-6">
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

        {/* Desktop navigation */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 lg:flex"
        >
          <div className="relative">
            <button
              ref={shopTriggerRef}
              type="button"
              onClick={() => toggleDesktopMenu("shop")}
              aria-expanded={openDesktopMenu === "shop"}
              aria-controls="shop-menu"
              aria-current={pathname.startsWith("/categories") ? "true" : undefined}
              className={cn(
                "flex items-center gap-1 rounded-card px-3 py-2 text-sm font-medium transition-colors hover:bg-surface hover:text-brand",
                openDesktopMenu === "shop" || pathname.startsWith("/categories")
                  ? "text-brand"
                  : "text-ink",
              )}
            >
              Shop
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200 motion-reduce:transition-none",
                  openDesktopMenu === "shop" && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>

            <div
              id="shop-menu"
              hidden={openDesktopMenu !== "shop"}
              className={cn(
                "absolute left-0 top-full z-10 mt-2 w-[680px] max-w-[calc(100vw-2rem)] rounded-card border border-line bg-white p-6 shadow-lg shadow-black/5",
                PANEL_ANIMATION,
              )}
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_240px]">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Categories
                  </p>
                  <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/categories/${category.slug}`}
                          onClick={closeMenus}
                          aria-current={
                            pathname.startsWith(`/categories/${category.slug}`)
                              ? "page"
                              : undefined
                          }
                          className="group block rounded-card p-2 transition-colors hover:bg-surface"
                        >
                          <span className="block text-sm font-medium text-ink transition-colors group-hover:text-brand">
                            {category.name}
                          </span>
                          <span className="mt-0.5 block text-xs text-ink-muted">
                            {category.description}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {featuredProduct ? (
                  <Link
                    href={`/products/${featuredProduct.slug}`}
                    onClick={closeMenus}
                    className="rounded-card bg-surface p-3 transition-colors hover:bg-line/40"
                  >
                    <span className="relative mb-3 block aspect-square w-full overflow-hidden rounded-card bg-white">
                      <Image
                        src={featuredProduct.images[0]}
                        alt={featuredProduct.altText?.[0] ?? featuredProduct.name}
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    </span>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Featured
                    </span>
                    <span className="mt-1 block text-sm font-medium text-ink transition-colors hover:text-brand">
                      {featuredProduct.name}
                    </span>
                    <span className="mt-1 block text-sm text-ink-muted">
                      {formatPrice(featuredProduct.price)}
                    </span>
                  </Link>
                ) : null}
              </div>

              <div className="mt-4 border-t border-line pt-4">
                <Link
                  href="/products"
                  onClick={closeMenus}
                  aria-current={pathname === "/products" ? "page" : undefined}
                  className="text-sm font-medium text-brand hover:text-brand-hover"
                >
                  Browse all products →
                </Link>
              </div>
            </div>
          </div>

          {DESKTOP_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={
                pathname.startsWith(link.href) ? "page" : undefined
              }
              className={cn(
                "rounded-card px-3 py-2 text-sm transition-colors hover:bg-surface hover:text-brand",
                pathname.startsWith(link.href) ? "text-brand" : "text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}

          <div className="relative">
            <button
              ref={supportTriggerRef}
              type="button"
              onClick={() => toggleDesktopMenu("support")}
              aria-expanded={openDesktopMenu === "support"}
              aria-controls="support-menu"
              aria-current={
                SUPPORT_LINKS.some((link) => pathname.startsWith(link.href))
                  ? "true"
                  : undefined
              }
              className={cn(
                "flex items-center gap-1 rounded-card px-3 py-2 text-sm font-medium transition-colors hover:bg-surface hover:text-brand",
                openDesktopMenu === "support" ||
                  SUPPORT_LINKS.some((link) => pathname.startsWith(link.href))
                  ? "text-brand"
                  : "text-ink",
              )}
            >
              Support
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200 motion-reduce:transition-none",
                  openDesktopMenu === "support" && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>

            <div
              id="support-menu"
              hidden={openDesktopMenu !== "support"}
              className={cn(
                "absolute right-0 top-full z-10 mt-2 w-56 rounded-card border border-line bg-white p-2 shadow-lg shadow-black/5",
                PANEL_ANIMATION,
              )}
            >
              <ul>
                {SUPPORT_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMenus}
                      aria-current={
                        pathname.startsWith(link.href) ? "page" : undefined
                      }
                      className="block rounded-card px-3 py-2 text-sm text-ink transition-colors hover:bg-surface hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        <div className="flex-1" />

        {/* Desktop search */}
        <div className="hidden w-full max-w-sm lg:block">
          <SearchBar />
        </div>

        <div className="flex items-center gap-1 lg:gap-2">
          <Link
            href="/cart"
            aria-label={cartLabel}
            className="relative flex h-10 w-10 items-center justify-center rounded-card text-ink transition-colors hover:bg-surface hover:text-brand"
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            {state.totalItems > 0 && (
              <span
                aria-hidden="true"
                className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-pill bg-brand px-1 text-[11px] font-semibold text-white"
              >
                {state.totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-card text-ink transition-colors hover:bg-surface hover:text-brand lg:hidden"
          >
            <span
              aria-hidden="true"
              className="flex flex-col justify-center gap-[5px]"
            >
              {[0, 1, 2].map((line) => (
                <span
                  key={line}
                  className="block h-0.5 w-5 rounded-pill bg-current transition-colors"
                />
              ))}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu (below lg) */}
      <div
        id="mobile-menu"
        hidden={!isMobileOpen}
        className="border-t border-line bg-white lg:hidden"
      >
        <div className="px-4 py-4 sm:px-6">
          <div className="mb-4">
            <SearchBar onNavigate={closeMenus} />
          </div>

          <nav aria-label="Mobile" className="flex flex-col">
            <Link
              href="/products"
              onClick={closeMenus}
              className="border-b border-line py-3 text-sm font-medium text-ink hover:text-brand"
            >
              All products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                onClick={closeMenus}
                className="border-b border-line py-3 text-sm text-ink transition-colors hover:text-brand"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          <p className="mb-1 mt-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Support
          </p>
          <ul className="grid grid-cols-1 gap-1 pb-2 sm:grid-cols-2">
            {SUPPORT_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMenus}
                  className="block rounded-card py-2 text-sm text-ink transition-colors hover:text-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}

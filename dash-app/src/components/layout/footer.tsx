import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const year = 2026;
  return (
    <footer className="bg-surface border-t border-line mt-16">
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <span className="relative mb-4 block h-10 w-[60px]">
              <Image
                src="/logo.jpg"
                alt="Dash#"
                fill
                sizes="120px"
                className="object-contain object-left"
              />
            </span>
            <p className="max-w-md text-ink-muted">
              South Africa&apos;s multi-brand electronics retailer. Quality
              products, competitive prices, and clear product information.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-ink">Customer Service</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-ink-muted hover:text-brand">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-ink-muted hover:text-brand">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-ink-muted hover:text-brand">
                  Returns &amp; Refunds
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-ink-muted hover:text-brand">
                  Warranty
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-ink">Company</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-ink-muted hover:text-brand">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-ink-muted hover:text-brand">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-ink-muted hover:text-brand">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-line pt-8 text-center text-ink-muted">
          <p>&copy; {year} Dash#. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

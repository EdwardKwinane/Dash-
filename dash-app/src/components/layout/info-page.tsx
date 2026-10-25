import Link from "next/link";

type InfoPageProps = {
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
};

/**
 * Shared shell for informational/policy routes.
 *
 * Content is intentionally factual about what this build does. It does not
 * invent legal commitments, delivery promises or payment guarantees.
 */
export function InfoPage({ title, intro, sections }: InfoPageProps) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-ink-muted">
            <li>
              <Link href="/" className="hover:text-brand">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-ink">
              {title}
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-ink md:text-4xl">{title}</h1>
          <p className="mt-4 text-lg text-ink-muted">{intro}</p>

          <div className="mt-8 rounded-card border border-line bg-surface p-5 text-sm text-ink-muted">
            Dash# is currently a demonstration storefront. Orders are not
            fulfilled, no payment is taken, and no customer data is transmitted
            to a third party.
          </div>

          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-semibold text-ink">
                  {section.heading}
                </h2>
                <p className="mt-2 text-ink-muted">{section.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-12 border-t border-line pt-6">
            <Link
              href="/products"
              className="inline-block rounded-card bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-hover"
            >
              Browse products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

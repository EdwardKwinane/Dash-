import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { AccountNav } from "@/components/ui/account-nav";

export default async function AccountPage() {
  await auth.protect();
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const firstName = user.firstName || "there";
  const email = user.emailAddresses[0]?.emailAddress ?? "No email set";

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        <aside aria-label="Account navigation" className="order-2 lg:order-1 lg:w-56 shrink-0">
          <AccountNav />
        </aside>

        <main className="order-1 lg:order-2 flex-1 min-w-0" aria-label="Account overview">
          <h1 className="text-3xl font-bold text-ink md:text-4xl">My Account</h1>
          <p className="mt-2 text-ink-muted">Welcome back, {firstName}.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-card border border-line bg-surface p-6 transition-colors hover:bg-line/40">
              <Link href="/account/profile" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-card" aria-label="Go to profile">
                <h2 className="font-semibold text-ink">Profile</h2>
                <p className="mt-1 text-sm text-ink-muted">{email}</p>
              </Link>
            </div>
            <div className="rounded-card border border-line bg-surface p-6 transition-colors hover:bg-line/40">
              <Link href="/account/orders" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-card" aria-label="Go to orders">
                <h2 className="font-semibold text-ink">Orders</h2>
                <p className="mt-1 text-sm text-ink-muted">Not yet connected — coming with Medusa.</p>
              </Link>
            </div>
            <div className="rounded-card border border-line bg-surface p-6 transition-colors hover:bg-line/40">
              <h2 className="font-semibold text-ink">Security</h2>
              <p className="mt-1 text-sm text-ink-muted">Managed by Clerk. No local password stored.</p>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-block rounded-card bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              Back to store
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

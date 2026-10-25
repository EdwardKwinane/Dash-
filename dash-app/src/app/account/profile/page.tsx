import { auth, currentUser } from "@clerk/nextjs/server";
import { UserProfile } from "@clerk/nextjs";

export default async function ProfilePage() {
  await auth.protect();
  const user = await currentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-ink md:text-4xl">Profile</h1>
      <p className="mt-2 text-ink-muted">Manage your account information securely with Clerk.</p>

      <div className="mt-8 rounded-card border border-line bg-white p-6 shadow-sm">
        <UserProfile
          appearance={{
            elements: {
              card: "shadow-none rounded-card border-0 bg-transparent",
              navbar: "hidden",
            },
          }}
        />
      </div>
    </div>
  );
}

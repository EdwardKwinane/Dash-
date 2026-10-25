"use client";

import { UserButton, SignInButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function UserPanel() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <span aria-label="Loading account" className="flex h-10 w-10 items-center justify-center rounded-card text-ink-muted">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      </span>
    );
  }

  const buttonClass =
    "inline-flex h-10 w-10 items-center justify-center rounded-card text-ink transition-colors hover:bg-surface hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

  return (
    <div className="flex items-center gap-2" aria-label="Account">
      {isSignedIn ? (
        <UserButton
          appearance={{
            elements: {
              userButtonBox: "h-10 w-10 rounded-card",
              userButtonTrigger: "h-10 w-10 rounded-card bg-surface hover:bg-line",
            },
          }}
        />
      ) : (
        <SignInButton mode="modal">
          <button
            type="button"
            aria-label="Sign in"
            className={buttonClass}
          >
            <span className="rounded-pill bg-brand px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-brand-hover transition-colors">
              Sign in
            </span>
          </button>
        </SignInButton>
      )}
    </div>
  );
}

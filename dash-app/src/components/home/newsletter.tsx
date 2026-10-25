"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Status = "idle" | "invalid" | "submitted";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Newsletter signup.
 *
 * No mailing provider is connected in this build, so submission is explicitly
 * presented as a demo outcome rather than a claimed subscription. Validation
 * is real (client-side); the delivery step is not.
 */
export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus("invalid");
      return;
    }
    setStatus("submitted");
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="rounded-card border border-line bg-surface p-6 sm:p-10">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h2
              id="newsletter-heading"
              className="text-2xl font-bold text-ink"
            >
              Get new arrivals first
            </h2>
            <p className="mt-2 text-ink-muted">
              Occasional product drops and price changes. No spam, unsubscribe
              any time.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="w-full">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="newsletter-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                aria-invalid={status === "invalid"}
                aria-describedby="newsletter-status"
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status === "invalid") setStatus("idle");
                }}
                className="min-w-0 flex-1 rounded-card border border-line bg-white px-4 py-2.5 text-ink placeholder:text-ink-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
              <Button
                type="submit"
                className="h-auto rounded-card bg-brand px-6 py-2.5 text-white hover:bg-brand-hover"
              >
                Subscribe
              </Button>
            </div>

            <div id="newsletter-status" aria-live="polite" className="mt-2 min-h-5 text-sm">
              {status === "invalid" && (
                <p className="text-[#b91c1c]">
                  Enter a valid email address, for example you@example.com.
                </p>
              )}
              {status === "submitted" && (
                <p className="text-[#15803d]">
                  Demo only — nothing was sent. Connect a mailing provider to
                  enable real subscriptions.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

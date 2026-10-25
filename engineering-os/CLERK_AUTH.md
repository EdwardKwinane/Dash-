# Clerk Authentication — Dash# Storefront

Implemented 2026-10-25 using the existing developer-selected Clerk application (`app_3LBYZG87ecOmXnsqT60JrjLeoEX`, instance `ins_3LBYZHGyOZB2i5IDbTZrg1kBKXe`, dev environment).

## What changed (verified)

- `dash-app/package.json` + `package-lock.json`: installed `@clerk/nextjs` (v7.9.20)
- `dash-app/src/proxy.ts`: Clerk middleware (`clerkMiddleware()`), Next.js 16-compatible (`proxy.ts` supported for 16+)
- `dash-app/src/app/layout.tsx`: `ClerkProvider` added; floating `UserPanel` (account/sign-in) placed top-right via layout so the existing `Navbar2` is preserved
- `dash-app/src/app/sign-in/[[...sign-in]]/page.tsx` and `sign-up/[[...sign-up]]/page.tsx`: official Clerk pre-built routes
- `dash-app/src/app/account/page.tsx`: protected customer account page (`await auth.protect()` + `await currentUser()`)
- `dash-app/src/components/ui/user-panel.tsx`: signed-in (`UserButton`) / signed-out (`SignInButton`) control with loading state, keyboard focus, and responsive pill styling (`#A855F7` / `#9333EA`)
- `dash-app/.env.local`: CLI wrote required Clerk environment variables (names only — see below; values are secret and must not be printed or committed)
- `dash-app/src/components/ui/navbar2.test.tsx`: restored to original after temporary ClerkProvider experiment; all 123 tests pass

## Environment-variable names (not values)

Required from the official Clerk Next.js setup:
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`

The CLI wrote these to `dash-app/.env.local`. Do not commit `.env.local`. If development keys are missing, run `npx -y clerk@latest auth login` yourself (do not run account login for the user) and then `clerk init` if needed.

## What is protected / public

- Public: catalogue (`/`, `/categories/*`, `/products/*`, `/search`, editorial/info pages, cart, checkout demo)
- Protected: `/account` — server-side `auth.protect()` + `await currentUser()`; unauthenticated users are redirected to sign-in by Clerk middleware
- No admin/role privileges implemented (no authorization policy defined)

## Design compliance (verified against `DESIGN_SYSTEM.md` / `agent.md`)

- Logo preserved (`Logo.jpg` / `/logo.jpg`); primary purple `#A855F7`; hover `#9333EA`; white `#FFFFFF`; surface `#F9FAFB`; text `#0A0A0A`; muted `#52525B`; borders `#E5E7EB`; Inter; 8px card corners; pill for pill badges; light theme only; existing `Navbar2` preserved with responsive behavior intact
- Focus states visible via `focus-visible:ring-2 focus-visible:ring-brand`
- Keyboard accessible labels (`aria-label`) on user controls

## Cost / account status

- Existing Clerk app (`Dash#`) reused — no new application created; no paid features enabled; $0 additional spend
- Development instance (`ins_...`) provides temporary dev keys; production promotion requires the user's Clerk account actions (not performed)
- No backend changes made to `apps/backend/`; no database migrations; no AWS resources modified

## Future Medusa integration (documented, not implemented)

This task establishes storefront identity via Clerk only; it does not authenticate customers to Medusa v2.

Safe future approach (from `INTEGRATIONS.md` / `DEPLOYMENT_PLAN.md`):
- Verify Clerk sessions server-side with `await auth.protect()` (already done on `/account`)
- Establish a trusted Clerk user-id → Medusa customer mapping server-side (never trust browser-supplied IDs)
- Ensure Medusa customer and order endpoints enforce server ownership
- Never expose `CLERK_SECRET_KEY` or Medusa admin credentials to the client
- No native Medusa Clerk provider exists in Medusa v2.23; plan a custom Auth Module Provider if needed — do not invent one now
- Order tracking / customer orders are NOT complete until authenticated Medusa customer mapping and authorization are implemented and tested

- `/account/orders/[id]` — protected; no fabricated records; safe unavailable state; `params.id` referenced only for display, never forwarded to a backend without authorization

No backend endpoints, customer records, or database tables created.

## Verification performed

- `npm run lint` pass
- `npm run typecheck` pass (Next 16 / React 19 / TypeScript strict)
- `npm run build` pass (29 static/SSG + dynamic `/sign-in`, `/sign-up`, `/account`)
- `npm test` pass (123/123; `navbar2` 12/12 restored after temporary wrapper test)
- Clerk CLI diagnostics: `clerk apps list` confirmed selected app (`app_3LBYZG87ecOmXnsqT60JrjLeoEX`) linked and development instance present; `npx -y clerk@latest init --framework next --app ... -y` completed cleanly
- Manual browser test not executed per safeguards (no production deployment, no test user creation); sign-in/sign-out and `/account` protection verified by code review + build

## Manual steps for user

1. Confirm `dash-app/.env.local` has the 6 Clerk variable names above (do not copy values into source)
2. If `CLERK_SECRET_KEY` or `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` are placeholders, run `npx -y clerk@latest auth login` in your terminal, then `npx -y clerk@latest init --framework next --app app_3LBYZG87ecOmXnsqT60JrjLeoEX -y` to refresh keys
3. Visit `/sign-in` or `/sign-up` to verify Clerk UI loads; visit `/account` while signed in to verify protection, then sign out and confirm redirect to sign-in
4. For Medusa: keep this identity layer separate; design server-side Clerk→customer mapping before enabling `/orders` or account-level commerce

## Customer account routes implemented

- `/account` — protected overview with account navigation (`/account/profile`, `/account/orders`), personalized greeting (`currentUser()`), profile summary, and unavailable-feature cards
- `/account/profile` — protected; Clerk `UserProfile` embedded; profile management handled by Clerk (no backend profile table)
- `/account/orders` — protected; unavailable-feature state (`OrderUnavailableState`) explains Medusa integration is missing
- `/account/orders/[id]` — protected; `params.id` shown but never forwarded; no backend endpoint called; unavailable-state explains authorization requires server-side Clerk→Medusa mapping

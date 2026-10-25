# PERFORMANCE.md — Frontend and System Performance Standard

Version: 1.0

## 1. Principle
Performance is a feature, and slow software is a defect. Budgets must be explicit and measured, not assumed — and they should scale to what the client's tier and users actually need, never used as an excuse to ship something sluggish.

## 2. Core Web Vitals budgets (frontend)
Target, for the primary user-facing pages of every project:
- **LCP (Largest Contentful Paint):** ≤ 2.5s on a throttled mobile connection
- **INP (Interaction to Next Paint):** ≤ 200ms
- **CLS (Cumulative Layout Shift):** ≤ 0.1

These are the default budget for all tiers. Measure with real tooling (Lighthouse, PageSpeed Insights, or the platform's built-in analytics) before considering a page shipped — do not assume a modern framework guarantees these numbers.

## 3. Asset and bundle discipline
- Ship only the JavaScript a page needs; avoid pulling entire component libraries for a single icon or widget.
- Code-split by route; lazy-load below-the-fold and non-critical components (heavy animation libraries, chart libraries, rarely-used modals).
- Set an explicit bundle-size budget per project (e.g. initial JS payload target) appropriate to the site's complexity, and treat exceeding it as a review flag, not a shrug.
- Images: serve modern formats (WebP/AVIF), correctly sized and responsive (`srcset`/framework image components), lazy-loaded below the fold.
- Fonts: subset where practical, use `font-display: swap` or equivalent to avoid invisible-text flashes, and limit the number of font weights/families loaded to only those the project's type styles (`DESIGN_SYSTEM.md` §5) actually use.

## 4. Animation performance
- Animate `transform` and `opacity` wherever possible; avoid animating properties that trigger layout (`width`, `top`, `left`) for scroll-driven or frequent animation.
- Any scroll-driven or hero animation work (whatever library implements it) should be profiled on a mid-tier mobile device, not just desktop — this class of animation routinely looks fine on a dev machine and stutters on a real phone.
- Respect `prefers-reduced-motion` (see `ACCESSIBILITY.md` §7) — this is both an accessibility and a performance requirement, since reduced-motion mode should also be the lightest-weight rendering path.

## 5. Backend/API performance
- Define a latency target per critical endpoint (e.g. p95 response time) appropriate to its purpose.
- Avoid N+1 queries and unbounded result sets (see `DATABASE_DESIGN.md` §10).
- Cache deliberately per `ARCHITECTURE.md` §7 — every cache needs a defined TTL and invalidation strategy, not just "add Redis."
- For AI-backed endpoints, track and budget latency separately (model call time is usually the dominant cost) — see `AI_ENGINEERING.md` §12.

## 6. Measurement and regression prevention
- All tiers: run Lighthouse/PageSpeed (or equivalent) before shipping any client-facing page, and record the score.
- Tier 2+: add performance budgets to CI where feasible (bundle-size checks, Lighthouse CI) so regressions are caught automatically rather than discovered by a client complaint.
- Tier 3+: add real-user monitoring (RUM) for Core Web Vitals in production, not just synthetic lab tests.

## 7. Cost-performance tradeoffs
Performance work has a cost ceiling like everything else in this system. Do not over-invest in shaving milliseconds off a Tier 1 marketing site with negligible traffic; do invest properly in performance for any page or flow that's a primary conversion or retention path, regardless of tier.

## 8. Definition of performant
A page or flow is performant when it meets the Core Web Vitals budgets in §2 on a realistic mobile connection and device, its bundle stays within its defined budget, and there is no unbounded query or uncapped payload on its critical path.

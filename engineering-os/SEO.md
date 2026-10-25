# SEO.md — Search and Discoverability Standard

Version: 1.0

## 1. Principle
A site that isn't discoverable doesn't serve its business goal, regardless of how well it's engineered. SEO is a correctness requirement for public-facing marketing/business sites, not an optional add-on.

## 2. Technical foundations
- Every public page has a unique, accurate `<title>` and meta description.
- Use semantic HTML and correct heading hierarchy (this overlaps directly with `ACCESSIBILITY.md` §3 — the same structure serves both).
- Generate a valid `sitemap.xml` and `robots.txt`; keep them current as pages are added/removed.
- Use canonical URLs to avoid duplicate-content issues (especially for any URL that can be reached multiple ways).
- Ensure pages are server-rendered or statically generated where discoverability matters — do not rely on client-side-only rendering for primary content that needs to be indexed.

## 3. Structured data
- Add relevant structured data (JSON-LD) for the content type: `Organization`/`Person` for a portfolio/business site, `Article` for blog content, `Product` for e-commerce, `FAQPage` where applicable.
- Validate structured data with a testing tool before shipping; broken structured data is worse than none.

## 4. Performance overlap
Core Web Vitals (see `PERFORMANCE.md` §2) are a direct ranking factor. Treat performance work on public pages as SEO work, not a separate concern.

## 5. Content and metadata quality
- Meta descriptions and titles should be written for humans first (accurate, compelling), not keyword-stuffed.
- Use descriptive, human-readable URLs (`/work/ai-voice-agent`, not `/p?id=482`).
- Every meaningful image has descriptive `alt` text (this overlaps with `ACCESSIBILITY.md` §7).
- Internal linking should connect related content (e.g. case studies linking to related capabilities) so both users and crawlers can navigate the site's structure.

## 6. Open Graph and social sharing
- Every public page should have Open Graph and Twitter Card metadata (title, description, image) so links render correctly when shared.
- Use a purpose-built social preview image sized correctly per platform, not an arbitrary screenshot.

## 7. Local/business SEO (where applicable)
For client businesses with a physical or regional presence:
- Consistent name/address/phone (NAP) information across the site and external listings.
- `LocalBusiness` structured data where relevant.
- Google Business Profile alignment is a client-side task to flag, not something the codebase controls — note it in `HOW_IT_WORKS.md` as an action item if relevant.

## 8. Analytics and monitoring
- Verify indexing status and search performance via the relevant search console tooling after launch.
- Track organic traffic and key landing-page performance as part of the project's normal analytics, sized to the client's tier (a Tier 1 client may just need basic pageview analytics; Tier 3+ may want proper search-console integration and reporting).

## 9. AI/crawler considerations
- Decide deliberately whether AI crawlers (for training or answer-engine indexing) should be allowed or blocked via `robots.txt`, based on the client's preference — do not leave this unconsidered by default.
- If the project exposes an AI chatbot/RAG interface publicly, ensure it doesn't inadvertently expose content that should stay out of search indexes.

## 10. Definition of discoverable
A page meets this standard when it has correct title/meta/canonical tags, valid structured data where applicable, is included in an accurate sitemap, meets its performance budget, uses semantic and accessible markup, and renders correctly when shared on social platforms.

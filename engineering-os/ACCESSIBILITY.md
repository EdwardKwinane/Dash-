# ACCESSIBILITY.md — Inclusive Design and Engineering Standard

Version: 2.0

## 1. Principle
Accessibility is a correctness requirement, not a polish pass. A feature that excludes users with disabilities is not done, regardless of tier or budget.

## 2. Baseline target
Target WCAG 2.2 Level AA for all client-facing interfaces, at every project tier. This is not tier-gated — it does not get cut for a Tier 1 client. What can scale with tier is the depth of manual auditing (see §9), not the target itself.

## 3. Semantic structure
- Use semantic HTML elements (`button`, `nav`, `main`, `header`, `footer`, `form`, headings in order) before reaching for ARIA.
- Only one `h1` per page; heading levels must not skip (no `h2` straight to `h4`).
- Landmarks (`main`, `nav`, `header`, `footer`, `aside`) should describe page structure so screen-reader users can navigate by region.

## 4. Keyboard access
- Every interactive element must be reachable and operable via keyboard alone.
- Focus order must follow visual/logical order.
- Visible focus indicators are required — never remove `:focus` styling without providing an equally visible replacement.
- No keyboard traps: a user must always be able to tab out of any component, including modals and menus.
- Custom interactive components (dropdowns, tabs, carousels, comboboxes) must implement the expected ARIA pattern and keyboard interactions for that widget type.

## 5. Color and contrast
- Text contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text (per WCAG AA).
- Non-text UI components (icons, form borders, focus indicators) ≥ 3:1 against adjacent colors.
- Never use color alone to convey meaning (status, errors, required fields) — pair with text, icon, or pattern.
- Validate the project's actual design-system palette (per `DESIGN_SYSTEM.md` §4) against contrast requirements before locking it in — check every semantic color pairing (text on surface, secondary/accent on light and dark backgrounds), not just the primary brand pairing.

## 6. Forms
- Every input has a programmatically associated label (not placeholder-only).
- Error messages are specific, associated with their field (`aria-describedby` or equivalent), and not conveyed by color alone.
- Required fields are indicated in text, not just an asterisk with no explanation.
- Group related fields with `fieldset`/`legend` where appropriate.

## 7. Images, media, and motion
- All meaningful images have descriptive `alt` text; decorative images use empty `alt=""`.
- Video content has captions where feasible; avoid autoplay audio.
- Respect `prefers-reduced-motion` — provide a reduced/no-animation experience for any scroll-driven, hero, or decorative animation library in use. This is mandatory wherever the project uses scroll-based or decorative animation, regardless of which animation tooling implements it.
- Avoid flashing content above known seizure-risk thresholds.

## 8. AI and dynamic content
- AI-generated or dynamically injected content must still meet the same structure, contrast, and labeling requirements as static content — do not let a chatbot/voice-agent UI skip semantic markup because it's generated at runtime.
- Live regions (`aria-live`) should be used for asynchronous updates (chat responses, loading states, toasts) so screen-reader users are notified appropriately without being overwhelmed.
- Voice agent interfaces must provide an equivalent text-based path for users who cannot or prefer not to use voice.

## 9. Verification, scaled by tier
- All tiers: automated accessibility linting (e.g. axe, eslint-plugin-jsx-a11y) in CI, and a basic keyboard-only pass on critical flows before shipping.
- Tier 2+: add a manual screen-reader pass (VoiceOver/NVDA) on primary user journeys before major releases.
- Tier 3+: periodic full manual audit against WCAG 2.2 AA, and accessibility regression tests on critical flows in the automated test suite.

## 10. Definition of accessible
A feature is accessible when it can be fully understood and operated by keyboard alone, by a screen-reader user, and by a user with reduced-motion or low-vision needs, without loss of functionality or meaning.

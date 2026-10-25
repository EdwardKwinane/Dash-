# DESIGN_SYSTEM.md — Product Design and UI Engineering Standard

Version: 1.0

## 1. Principle
The design system is the shared language between product design and implementation. Agents must preserve established visual and interaction rules instead of inventing one-off styling while building features.

## 2. Source of truth
For each project record the authoritative design sources in `PROJECT_CONTEXT.md`: design file, token source, component library, icon set, and implementation package. If design and code disagree, do not silently choose one; resolve material differences through the PRD/design owner or an ADR when the decision is architectural.

## 3. Tokens first
Define and reuse semantic tokens for:
- color and surfaces
- typography
- spacing
- radius
- border
- shadows/elevation
- breakpoints
- sizing
- z-index/layers
- motion duration/easing

Avoid unexplained magic values when an existing token expresses the intent. New recurring values should become tokens; isolated values require a clear reason.

## 4. Color and themes
- Use semantic roles (`background`, `surface`, `text-primary`, `danger`) rather than coupling components to raw hex values.
- Light/dark themes must use the same semantic roles with theme-specific values.
- Theme changes must preserve WCAG requirements in `ACCESSIBILITY.md`.
- Never encode status using color alone.

## 5. Typography
Define named text styles for display, headings, body, labels, captions, and code where relevant. Keep font families and weights intentionally limited. Responsive type may scale, but hierarchy must remain consistent.

## 6. Layout
Use an explicit spacing scale, container widths, grids, and breakpoint rules. Components should be responsive by design rather than repaired page by page. Avoid arbitrary per-page gutters when a layout primitive exists.

## 7. Components
Before creating a new component:
1. search the current component library
2. check whether an existing component can be extended without breaking its responsibility
3. confirm repeated use or meaningful domain behavior justifies a new abstraction

Each reusable component should define relevant states: default, hover, focus, active, disabled, loading, error, empty, selected, and destructive.

## 8. Interaction and motion
Motion should communicate hierarchy, state, or causality; decorative animation must not block task completion. Respect reduced motion, performance budgets, and input modality. Prefer consistent motion tokens over one-off easings and durations.

## 9. Design-to-code fidelity
When implementing an approved design:
- preserve content and information hierarchy unless the PRD changes it
- match spacing, type, component states, responsive intent, and theme behavior
- do not replace distinctive design decisions with generic framework defaults
- flag impossible, inaccessible, or technically harmful design details rather than silently approximating them

## 10. Component API quality
UI component APIs should be composable, typed, accessible by default, and difficult to misuse. Prefer variants and semantic props over raw class-string duplication across product code.

## 11. Dark/light mode
If multiple themes exist:
- define the theme at token level
- persist user preference where appropriate
- respect system preference when no explicit choice exists
- avoid theme flash during hydration
- test charts, images, syntax highlighting, focus states, and third-party embeds in every supported theme

## 12. Review checklist
A UI change is not done until it has been checked for:
- design fidelity
- responsive layouts
- keyboard/focus behavior
- contrast and semantics
- loading/error/empty states
- theme support
- reduced motion
- performance impact
- reuse of approved tokens/components

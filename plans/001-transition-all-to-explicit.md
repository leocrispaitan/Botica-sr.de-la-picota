# 001 — Replace ten `transition: all` with explicit property lists

- **Status**: DONE
- **Commit**: 06b4e7e
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file, 10 one-line edits

## Problem

`transition: all` animates unintended properties off-GPU (layout + paint + composite instead of transform/opacity-only compositing). Ten occurrences live in the inline `<style>` block of `src/components/vendedor/PuntoVenta.tsx`, several on hover states hit dozens of times per selling day (nav buttons, categories, option buttons, payment grid). Current code verbatim:

```css
/* src/components/vendedor/PuntoVenta.tsx:532 — current (.seller-sidebar) */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

```css
/* src/components/vendedor/PuntoVenta.tsx:594 — current (.seller-nav-button, .seller-logout-button) */
transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
```

```css
/* src/components/vendedor/PuntoVenta.tsx:672 — current (.seller-shift-card) */
transition: all 0.25s ease;
```

```css
/* src/components/vendedor/PuntoVenta.tsx:701 — current (.seller-logout-button) */
transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
```

```css
/* src/components/vendedor/PuntoVenta.tsx:1014 — current (.seller-bell) */
transition: all 0.2s ease;
```

```css
/* src/components/vendedor/PuntoVenta.tsx:1096 — current (.seller-category) */
transition: all 0.2s ease;
```

```css
/* src/components/vendedor/PuntoVenta.tsx:1302 — current (.seller-select-button) */
transition: all 0.2s ease;
```

```css
/* src/components/vendedor/PuntoVenta.tsx:1368 — current (.seller-option-row button, .seller-amount button, .seller-order-actions button) */
transition: all 0.18s ease;
```

```css
/* src/components/vendedor/PuntoVenta.tsx:1983 — current (.seller-payment-grid button) */
transition: all 0.2s ease;
```

```css
/* src/components/vendedor/PuntoVenta.tsx:2129 — current (.seller-close-nav) */
transition: all 0.2s ease;
```

Each rule's hover/active state only ever changes color, background-color/border-color, transform, box-shadow, or opacity — so nothing is lost by listing properties explicitly.

## Target

Per the audit playbook: animate transform and opacity only where possible; hover/color changes use `ease`; movement uses ease-out. Transform motion keeps the repo's own system curve `cubic-bezier(0.16, 1, 0.3, 1)` (the documented curve in `src/components/vendedor/viewTransitions.css:3`). Exact replacements:

```css
/* :532 target */ transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), padding 0.3s ease-out, margin 0.3s ease-out, border-radius 0.3s ease-out, box-shadow 0.3s ease-out, background-color 0.3s ease-out;
/* :594 target */ transition: color 0.25s ease-out, background-color 0.25s ease-out, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease-out;
/* :672 target */ transition: border-color 0.25s ease-out, background-color 0.25s ease-out, box-shadow 0.25s ease-out;
/* :701 target */ transition: color 0.25s ease-out, background-color 0.25s ease-out, box-shadow 0.25s ease-out, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
/* :1014 target */ transition: background-color 0.2s ease-out, color 0.2s ease-out, transform 0.2s ease-out;
/* :1096 target */ transition: color 0.2s ease-out, border-color 0.2s ease-out, background-color 0.2s ease-out, transform 0.2s ease-out, box-shadow 0.2s ease-out;
/* :1302 target */ transition: border-color 0.2s ease-out, color 0.2s ease-out, background-color 0.2s ease-out;
/* :1368 target */ transition: color 0.18s ease-out, background-color 0.18s ease-out, box-shadow 0.18s ease-out;
/* :1983 target */ transition: color 0.2s ease-out, border-color 0.2s ease-out, background-color 0.2s ease-out, box-shadow 0.2s ease-out;
/* :2129 target */ transition: background-color 0.2s ease-out, transform 0.2s ease-out;
```

## Repo conventions to follow

- Explicit multi-property transitions are already the house style in `src/components/vendedor/viewTransitions.css:53-54` (`.seller-product-card { transition: transform 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out; }`) and `viewTransitions.css:115-119` (nav buttons list color/background/transform/box-shadow separately). Imitate that pattern.
- The system curve `cubic-bezier(0.16, 1, 0.3, 1)` is documented at `viewTransitions.css:3` ("Curva del sistema") and used by the Framer Motion workspace switch at `PuntoVenta.tsx:2368` (`ease: [0.16, 1, 0.3, 1]`). Do not introduce the `(0.4, 0, 0.2, 1)` curve anywhere new.

## Steps

1. In `src/components/vendedor/PuntoVenta.tsx:532`, replace `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);` with the `:532 target` line above.
2. In the same file at `:594`, replace `transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);` with the `:594 target` line.
3. At `:672`, replace `transition: all 0.25s ease;` with the `:672 target` line.
4. At `:701`, replace `transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);` with the `:701 target` line.
5. At `:1014`, replace `transition: all 0.2s ease;` with the `:1014 target` line.
6. At `:1096`, replace `transition: all 0.2s ease;` with the `:1096 target` line.
7. At `:1302`, replace `transition: all 0.2s ease;` with the `:1302 target` line.
8. At `:1368`, replace `transition: all 0.18s ease;` with the `:1368 target` line.
9. At `:1983`, replace `transition: all 0.2s ease;` with the `:1983 target` line.
10. At `:2129`, replace `transition: all 0.2s ease;` with the `:2129 target` line.

## Boundaries

- Do NOT touch `src/components/vendedor/inka-theme.css` — it overrides colors only and sets no `transition` property; the edits above remain effective underneath it.
- Do NOT touch `viewTransitions.css`, `LogoutConfirmModal.tsx`, `HistorialVentas.tsx`, or any TSX logic/markup — motion declarations only.
- Do NOT change durations, curves, or visual design beyond the property-list swap (the `(0.4, 0, 0.2, 1)` → `(0.16, 1, 0.3, 1)` unification on transform motion is part of this plan; do not invent other curves).
- Do NOT add new dependencies.
- If a step doesn't match the code you find (drift since commit `06b4e7e`), STOP and report instead of improvising.

## Verification

- **Mechanical**: run `npm run build` in `botica-frontend/` — expect success (pre-existing warnings about lottie `eval` and chunk size are unrelated). Then grep: `transition: all` in `src/components/vendedor/` must return 0 matches.
- **Feel check**: run the UI, hover every sidebar button, category card, product option button, payment method, bell, close-nav, and collapse the sidebar — confirm every hover/active state still animates exactly as before (color fade, slide, shadow), with no instant jumps.
- **Done when**: grep is clean, build passes, and no hover state changed visually.

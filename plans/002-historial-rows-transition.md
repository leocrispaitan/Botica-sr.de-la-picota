# 002 — Convert historial rows from keyframes to interruptible transitions

- **Status**: DONE
- **Commit**: 06b4e7e
- **Severity**: MEDIUM
- **Category**: Interruptibility (Easing & duration)
- **Estimated scope**: 1 file, 4 edits

## Problem

Sale rows in the historial timeline enter via CSS **keyframes**, which restart from zero instead of retargeting mid-motion, use the weak built-in `ease`, and run 0.35s (over the under-300ms UI budget). Vetting note: rows use stable React keys (`sale.id_venta`), so typing in the filter mostly reuses DOM nodes — the restart bites on range-tab switches (Hoy / 7 días / Todo), refetches that remount rows, and any rapid re-trigger, where all rows replay the full 350ms + up-to-450ms stagger tail from opacity 0. Current code verbatim:

```css
/* src/components/vendedor/HistorialVentas.tsx:139-145 — current */
.v2-sale-row {
  width: 100%; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px;
  padding: 13px 16px; border: 1px solid #E5E7EB; border-radius: 14px;
  background: #fff; cursor: pointer; text-align: left; font: inherit;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
  opacity: 0; animation: v2-tl-in 0.35s ease forwards;
}
@keyframes v2-tl-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

```tsx
{/* src/components/vendedor/HistorialVentas.tsx:245 — current */}
style={{ animationDelay: `${Math.min(i, 10) * 45}ms` }}
```

```css
/* src/components/vendedor/HistorialVentas.tsx:171-173 — current */
@media (prefers-reduced-motion: reduce) {
  .v2-sale-row { opacity: 1; animation: none; }
}
```

File imports today (`HistorialVentas.tsx:1`): `import { useMemo, useState } from "react";` — there is no `CSSProperties` import yet.

## Target

Transitions retarget from the current state, so re-triggered rows glide instead of flashing. Entry without JS uses `@starting-style`. The 45ms stagger (within the 30–80ms decorative budget, non-blocking) is preserved via a `--row-delay` custom property scoped to the entry props only, so hover feedback stays instant. Exact end state:

```css
/* target — replaces the opacity/animation lines inside .v2-sale-row */
.v2-sale-row {
  /* ...unchanged layout lines... */
  transition: opacity 0.25s ease-out var(--row-delay, 0ms), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1) var(--row-delay, 0ms), border-color 0.15s ease-out 0ms, box-shadow 0.2s ease-out 0ms;
}
@starting-style {
  .v2-sale-row { opacity: 0; transform: translateY(10px); }
}
```

```tsx
{/* target */}
style={{ "--row-delay": `${Math.min(i, 10) * 45}ms` } as CSSProperties}
```

```css
/* target reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .v2-sale-row { transition: none; }
}
```

## Repo conventions to follow

- The system curve `cubic-bezier(0.16, 1, 0.3, 1)` is documented at `src/components/vendedor/viewTransitions.css:3` and used by the workspace switch at `src/components/vendedor/PuntoVenta.tsx:2368`. Use it for the transform entry; plain `ease-out` for opacity/color.
- Per-property transition lists are the house style (`viewTransitions.css:53-54`); follow that shape.
- For the CSS custom property in inline style with a type import, imitate `src/components/vendedor/MenuProductos.tsx:2` (`import type { CSSProperties } from "react";`) and its usage at `MenuProductos.tsx:75` (`style={{ "--category-color": category.color } as CSSProperties}`).

## Steps

1. In `src/components/vendedor/HistorialVentas.tsx`, inside the `.v2-sale-row` rule, delete the line `opacity: 0; animation: v2-tl-in 0.35s ease forwards;` and add `transition: opacity 0.25s ease-out var(--row-delay, 0ms), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1) var(--row-delay, 0ms), border-color 0.15s ease-out 0ms, box-shadow 0.2s ease-out 0ms;`.
2. Delete the `@keyframes v2-tl-in { ... }` block and replace it with `@starting-style { .v2-sale-row { opacity: 0; transform: translateY(10px); } }`.
3. At line 245, replace `style={{ animationDelay: `${Math.min(i, 10) * 45}ms` }}` with `style={{ "--row-delay": `${Math.min(i, 10) * 45}ms` } as CSSProperties}` and add `import type { CSSProperties } from "react";` next to the existing React import on line 1.
4. In the `@media (prefers-reduced-motion: reduce)` block, replace `.v2-sale-row { opacity: 1; animation: none; }` with `.v2-sale-row { transition: none; }`.

## Boundaries

- Do NOT touch filtering logic, keys, the stagger math (`Math.min(i, 10) * 45`), the timeline/dot styles, or any other component.
- Do NOT change markup/structure — motion declarations plus the one style-prop rename only.
- Do NOT add new dependencies.
- `@starting-style` degrades gracefully (rows simply appear) in browsers without support — do not add a JS fallback.
- If a step doesn't match the code you find (drift since commit `06b4e7e`), STOP and report instead of improvising.

## Verification

- **Mechanical**: run `npm run build` in `botica-frontend/` — expect success. Grep `v2-tl-in` in `src/` must return 0 matches.
- **Feel check**: open Historial, switch Hoy / 7 días / Todo rapidly and type fast in the search — confirm rows glide/retarget and never flash from zero or restart mid-motion; hover any row and confirm the border highlight is instant (no stagger delay on hover); in DevTools set playback to 10% (Animations panel) and confirm entry is a 10px rise + fade; toggle `prefers-reduced-motion` (Rendering panel) and confirm rows appear instantly with full content.
- **Done when**: rapid tab-switching shows no restart-from-zero, hover is delay-free, build passes.

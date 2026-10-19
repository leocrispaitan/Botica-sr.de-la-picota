# 003 — Remove `mode="wait"` dead time from workspace view switch

- **Status**: DONE
- **Commit**: 06b4e7e
- **Severity**: MEDIUM
- **Category**: Interruptibility
- **Estimated scope**: 1 file, 1 edit (two props)

## Problem

Switching seller views (Menu / Orden / Historial / Clientes / Perfil — a high-frequency action) waits for the old view to exit before the new one enters. `mode="wait"` plus a 0.12s exit inserts ~120ms of dead time on every tap, then a 0.3s enter: the UI feels gated. Current code verbatim:

```tsx
{/* src/components/vendedor/PuntoVenta.tsx:2359-2373 — current */}
<AnimatePresence mode="wait" initial={false}>
  <motion.main
    key={activeView}
    className="seller-content"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8, transition: { duration: 0.12, ease: "easeOut" } }}
    transition={{
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    }}
  >
    {renderWorkspace()}
  </motion.main>
</AnimatePresence>
```

Per the audit playbook this is asymmetric-timing done backwards: the system's response should snap, not the user's tap wait. The view cascade entrance in `src/components/vendedor/viewTransitions.css:12` (`v2-view-item-in`) already carries the spatial storytelling, so the container exit adds nothing.

## Target

The old view unmounts instantly and the new one enters immediately — zero dead time, one child in flow at all times (no overlap layout issues). Exact end state:

```tsx
{/* target */}
<AnimatePresence initial={false}>
  <motion.main
    key={activeView}
    className="seller-content"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    }}
  >
    {renderWorkspace()}
  </motion.main>
</AnimatePresence>
```

That is: delete `mode="wait"` from `AnimatePresence` and delete the entire `exit={...}` prop. Everything else stays byte-identical (same `initial`, `animate`, `transition`, duration 0.3, system curve `[0.16, 1, 0.3, 1]`).

## Repo conventions to follow

- Keep the system curve `[0.16, 1, 0.3, 1]` (documented at `viewTransitions.css:3`, already used here) — no new easings.
- Framer Motion is already a dependency (`framer-motion` in `botica-frontend/package.json`, imported at `PuntoVenta.tsx:2`) — no new dependencies.

## Steps

1. In `src/components/vendedor/PuntoVenta.tsx:2359`, change `<AnimatePresence mode="wait" initial={false}>` to `<AnimatePresence initial={false}>`.
2. In the same block, delete the line `exit={{ opacity: 0, y: -8, transition: { duration: 0.12, ease: "easeOut" } }}` (line 2365). Leave all other props untouched.

## Boundaries

- Do NOT touch `initial`, `animate`, `transition`, the `key`, `renderWorkspace()`, or any other motion code (the `y`/`scale` shorthand consolidation is a separate, unplanned finding).
- Do NOT change markup/structure — two prop deletions only.
- Do NOT add new dependencies.
- If the block doesn't match (drift since commit `06b4e7e`), STOP and report instead of improvising.

## Verification

- **Mechanical**: run `npm run build` in `botica-frontend/` — expect success.
- **Feel check**: tap through Menu / Historial / Clientes / Perfil rapidly — confirm the new view starts entering the instant you tap (no perceptible gap), with the 0.3s rise+fade intact; spam-tapping two views must never queue or flash blank; the inner cascade stagger still plays per view.
- **Done when**: view switches feel instant to start, no blank-frame flash, build passes.

# Animation plans — vendedor (`src/components/vendedor/`)

Audit skill: `improve-animations` (Emil Kowalski playbook). Commit `06b4e7e`.
Rule of the skill: plans live here; source is never edited by the audit itself.

| # | Plan | Severity | Status |
|---|------|----------|--------|
| 001 | [Replace ten `transition: all` with explicit property lists](001-transition-all-to-explicit.md) | HIGH | DONE |
| 002 | [Convert historial rows from keyframes to interruptible transitions](002-historial-rows-transition.md) | MEDIUM | DONE |
| 003 | [Remove `mode="wait"` dead time from workspace view switch](003-workspace-no-wait-switch.md) | MEDIUM | DONE |

## Recommended execution order

1. **001** first — touches only transition declarations, zero visual change; de-risks everything after.
2. **003** second — two prop deletions, instantly verifiable by tapping views.
3. **002** last — touches the historial style block + one style prop; verify with rapid tab-switching.

No dependencies between plans; each is independently verifiable via `npm run build` + its feel check. Findings #4–#10 and opportunities A–B from the audit were not selected and have no plans.

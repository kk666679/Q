# Component Fullsets 2026

This repo now includes domain fullsets for:
- GMP
- human-resources
- islamic-manufacturing-process
- six-sigma
- Lean-six-sigma
- my-standards

Pattern:
- `domain-fullset/base.tsx` provides shared enterprise AI layout blocks.
- each domain ships complete core/ai/workflow/forms/monitoring/visualization file sets.
- each domain includes: `types.ts`, `constants.ts`, `hooks.ts`, `utils.ts`, `mock-data.ts`, `index.ts`.

Upgrade guidance for existing folders:
- dashboard, qms, iso, audit-forms, automation, landing, sidebar, document should consume domain fullsets incrementally via route-level composition.

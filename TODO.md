# TODO

## Automation typing fixes (priority)
- [ ] Fix `components/automation/node/AutomationNodes.tsx` so `selected` is correctly typed and no longer errors.
- [ ] Fix `components/automation/edge/customEdge.tsx`:
  - [ ] Add proper `data` typings per edge so `data.label/count/info/icons` are safe React children.
  - [ ] Fix `getStraightPath` invocation to match the installed `@xyflow/react` type signature.
- [ ] Re-run TypeScript check / build to confirm automation errors drop.

## Next clusters (after automation)
- [ ] Fix `components/automation/node/CustomNodes.tsx` unknown ReactNode render errors.
- [ ] Fix `components/automation/node/WorkflowNodes.tsx` unknown ReactNode render errors.
- [ ] Fix `components/automation/node/WorkFlowShowcase.tsx` ReactFlow JSX component typing.

## SDK / Document / QMS (after automation)
- [ ] Fix missing exports/prop mismatches in `lib/sdk/*`, `sdk/components/*`, `components/qms/*`, `hooks/*`.
- [ ] Fix document builder missing mutations and env var typing strictness.
- [ ] Final pass: re-run `tsc` until zero errors.

# automation update Sun May 24 22:20:38 UTC 2026

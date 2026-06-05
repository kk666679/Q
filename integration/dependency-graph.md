# Dependency Graph — MyQMS Frontend (best-effort)

Due to environment constraints (`ripgrep` missing), this dependency graph is **best-effort** based on repository structure and known integration points.

## Hard integrations (verified)

### Providers / SDK integration
- `app/layout.tsx`
  - wraps app with:
    - `components/theme-provider.tsx`
    - `lib/sdk/provider.tsx` (`SDKProvider`)

- `lib/sdk/provider.tsx`
  - creates and provides:
    - `trpc.Provider` (tRPC client)
    - `QueryClientProvider` (TanStack Query)

- `lib/sdk/trpc.ts`
  - defines:
    - React hooks: `trpc = createTRPCReact<AppRouter>()`
    - vanilla: `trpcClient = createTRPCProxyClient<AppRouter>()`
  - endpoint: `/api/trpc`

### AI UI surfaces (structure-based)
- `components/ai-elements/**`
  - provide low-level AI UI primitives used by higher-level AI workspaces.

- `components/ai-enterprise/**`
  - provide assembled AI shells (dashboard, compliance copilot, insight sidebar).

## Pages that likely act as integration points (structure-based)
- `app/agents/page.tsx`
  - should bind:
    - chat UI components
    - agent selection and message sending (via existing hooks)

- `app/ai-components/page.tsx`
  - likely binds:
    - `components/ai-elements/**`
    - enterprise shells from `components/ai-enterprise/**`

- `app/flow-process/page.tsx`
  - likely binds:
    - `components/flow-process/*`
    - React Flow runtime

- `app/automation/designer/page.tsx`
  - likely binds:
    - `components/automation/processflow_designer.tsx`

## Next required step (for exact graph)
Run a real static analysis (TS import graph) to extract exact dependencies:
- imports from `components/**` to hooks/services in `hooks/**` and `lib/sdk/**`
- actual usage: which pages render which components

This requires either:
- installing `ripgrep` (preferred), or
- using `grep`/`node` based AST analysis as a fallback.


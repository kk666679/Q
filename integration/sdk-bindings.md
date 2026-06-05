# SDK Bindings — MyQMS Frontend (current repo bindings)

This document aligns the requested “SDK wiring” idea with the repository’s existing SDK layer.

## Canonical SDK layer in this repo
The app’s root wiring uses the `lib/sdk/*` layer:
- `lib/sdk/provider.tsx` → global providers for:
  - tRPC React provider
  - TanStack Query
- `lib/sdk/trpc.ts` → tRPC React + vanilla client
- `lib/sdk/index.ts` → re-exports AI generation utilities + tRPC hooks/client

## What exists already
### 1) SDK Provider (global)
`app/layout.tsx` wraps children with:
- `ThemeProvider`
- `SDKProvider` from `@/lib/sdk/provider`

So any page/component can safely use:
- `trpc.*.useQuery/useMutation`
- AI hooks exported via `lib/sdk/index.ts`

### 2) tRPC endpoint binding
- `lib/sdk/trpc.ts` sets:
  - endpoint: `/api/trpc`

So existing tRPC procedures should be consumed from `trpc` export.

## Mapping requested `src/sdk` to existing `lib/sdk`
The task prompt asks to generate `src/sdk`.
In this repo, `lib/sdk` is already functional and used.

Recommended production-safe binding strategy:
- Treat `lib/sdk` as the “SDK” implementation.
- Add a thin `src/sdk` facade (or document-only) that re-exports from `lib/sdk`.

That keeps integration consistent without breaking imports.

## AI integration binding points (expected)
The codebase also contains:
- `hooks/useAIChat.ts`
- `hooks/use-ai.ts`
- `hooks/use-ai-operations.ts`
- `components/ai-elements/*` and `components/ai-enterprise/*`

These are expected to use:
- `lib/sdk` AI generation utilities (e.g. `useChat`, `streamText`, etc.)
- tRPC procedures if AI tasks require server-side orchestration.

## Production hardening checks for SDK bindings
- Verify all AI provider switching and retry/fallback behavior is implemented in hooks/services.
- Ensure the Provider wrapper is applied exactly once (already true via `app/layout.tsx`).
- Ensure no duplicate QueryClient instances are created per route.

## Next step
- Generate a `src/sdk/index.ts` facade only if imports elsewhere require it.
- Otherwise, continue using `lib/sdk` as source of truth and focus on route/module orchestration.


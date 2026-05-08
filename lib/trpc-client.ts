/**
 * tRPC Client
 * 
 * Frontend tRPC client for type-safe API calls to the backend.
 * Combines benefits of Next.js tRPC setup with proper type safety.
 */

'use client';

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/sdk/server/router';

/**
 * tRPC React hooks and utilities.
 * 
 * Usage:
 * ```tsx
 * const { data } = trpc.ai.getModels.useQuery();
 * const { mutate } = trpc.ai.chat.useMutation();
 * ```
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Create tRPC client (for SSR and other non-React contexts).
 */
import { httpBatchLink } from '@trpc/client';

export function getTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: '/api/trpc',
      }),
    ],
  });
}

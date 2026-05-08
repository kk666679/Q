/**
 * tRPC Client
 * 
 * Centralized tRPC client for API communication.
 * Provides type-safe API calls with automatic caching and revalidation.
 */

import { createTRPCReact } from '@trpc/react-query';
import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client';
import { QueryClient } from '@tanstack/react-query';
import type { AppRouter } from '@/sdk/server/router';

const trpcEndpoint = '/api/trpc';

/**
 * tRPC React client for use in components
 * 
 * @example
 * function Component() {
 *   const { data } = trpc.document.list.useQuery();
 *   return <div>{data?.length} documents</div>;
 * }
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Vanilla tRPC client for use outside React components
 * 
 * @example
 * // In a server action or API route
 * const documents = await trpcClient.document.list.query();
 */
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === 'development' &&
        typeof window !== 'undefined' &&
        opts.direction === 'down' &&
        opts.result instanceof Error,
    }),
    httpBatchLink({
      url: trpcEndpoint,
      headers() {
        return {
          'x-trpc-source': 'client',
        };
      },
    }),
  ],
});

/**
 * Create a new QueryClient with default options
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

/**
 * Create tRPC client options for the provider
 */
export function createTRPCClientOptions() {
  return {
    links: [
      loggerLink({
        enabled: (opts) =>
          process.env.NODE_ENV === 'development' &&
          typeof window !== 'undefined',
      }),
      httpBatchLink({
        url: trpcEndpoint,
        headers() {
          return {
            'x-trpc-source': 'react',
          };
        },
      }),
    ],
  };
}

// Re-export the AppRouter type
export type { AppRouter };

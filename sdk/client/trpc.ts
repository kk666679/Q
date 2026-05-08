import { createTRPCReact } from '@trpc/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/router';

const SDK_VERSION = '0.2.0';

function getBaseUrl(): string {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

const batchLink = httpBatchLink({
  url:          `${getBaseUrl()}/api/trpc`,
  maxURLLength: 2083,
  headers() {
    return { 'x-sdk-version': SDK_VERSION };
  },
});

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = createTRPCClient<AppRouter>({
  links: [batchLink],
});

export type { AppRouter };

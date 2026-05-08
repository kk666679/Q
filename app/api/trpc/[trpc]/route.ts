import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/sdk/server/router';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({ userId: 'anonymous', tenantId: 'default' }),
  });

export { handler as GET, handler as POST };
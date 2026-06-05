import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/sdk/server/router';
import { createContext } from '@/sdk/server/trpc';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: ({ req: nextReq }) => {
      // Ensure we return the full TRPCContext shape expected by sdk/server/trpc.ts
      return createContext({ req: nextReq as any });
    },
  });

export { handler as GET, handler as POST };

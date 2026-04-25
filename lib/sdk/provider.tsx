'use client';

/**
 * SDK Provider
 * 
 * Wraps the application with necessary providers for tRPC and React Query.
 * Must be used at the root of your application.
 * 
 * @example
 * // In app/layout.tsx
 * import { SDKProvider } from '@/lib/sdk/provider';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <SDKProvider>{children}</SDKProvider>
 *       </body>
 *     </html>
 *   );
 * }
 */

import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { trpc, createQueryClient, createTRPCClientOptions } from './trpc';

interface SDKProviderProps {
  children: React.ReactNode;
}

export function SDKProvider({ children }: SDKProviderProps) {
  // Create instances once per component lifecycle
  const [queryClient] = useState(() => createQueryClient());
  const [trpcClient] = useState(() => trpc.createClient(createTRPCClientOptions()));

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

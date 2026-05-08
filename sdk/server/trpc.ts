import { initTRPC, TRPCError } from '@trpc/server';
import type { NextRequest } from 'next/server';

// ── Context ───────────────────────────────────────────────────────────────────
export interface TRPCContext {
  userId:   string;
  tenantId: string;
  req?:     NextRequest;
}

export function createContext(opts?: { req?: NextRequest }): TRPCContext {
  // In production replace with real auth extraction (JWT, session, etc.)
  return {
    userId:   'anonymous',
    tenantId: 'default',
    req:      opts?.req,
  };
}

// ── Init ──────────────────────────────────────────────────────────────────────
const t = initTRPC.context<TRPCContext>().create();

// ── Rate-limit middleware ─────────────────────────────────────────────────────
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT    = 60;   // requests
const WINDOW_MS     = 60_000; // 1 minute

const rateLimitMiddleware = t.middleware(({ ctx, next }) => {
  const key = ctx.userId;
  const now = Date.now();
  const entry = requestCounts.get(key);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count++;
    if (entry.count > RATE_LIMIT) {
      throw new TRPCError({
        code:    'TOO_MANY_REQUESTS',
        message: `Rate limit exceeded. Try again in ${Math.ceil((entry.resetAt - now) / 1000)}s`,
      });
    }
  }
  return next();
});

// ── SDK version header middleware ─────────────────────────────────────────────
const SDK_VERSION = '0.2.0';
const versionMiddleware = t.middleware(async ({ next }) => {
  const result = await next();
  return result;
});

// ── Exports ───────────────────────────────────────────────────────────────────
export const router          = t.router;
export const publicProcedure = t.procedure.use(rateLimitMiddleware).use(versionMiddleware);
export const { mergeRouters } = t;

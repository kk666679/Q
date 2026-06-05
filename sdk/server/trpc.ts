import { initTRPC, TRPCError } from '@trpc/server';
import type { NextRequest } from 'next/server';

// ── Context ───────────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'manager' | 'auditor' | 'viewer';

export interface TRPCContext {
  userId:   string;
  tenantId: string;
  role:     UserRole;
  req?:     NextRequest;
}

export function createContext(opts?: { req?: NextRequest }): TRPCContext {
  const req = opts?.req;
  // Extract role from header (replace with real JWT/session in production)
  const role = (req?.headers.get('x-user-role') as UserRole) ?? 'viewer';
  const userId   = req?.headers.get('x-user-id')   ?? 'anonymous';
  const tenantId = req?.headers.get('x-tenant-id') ?? 'default';
  return { userId, tenantId, role, req };
}

// ── Init ──────────────────────────────────────────────────────────────────────
const t = initTRPC.context<TRPCContext>().create();

// ── Rate-limit middleware ─────────────────────────────────────────────────────
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60;
const WINDOW_MS  = 60_000;

const rateLimitMiddleware = t.middleware(({ ctx, next }) => {
  const now   = Date.now();
  const entry = requestCounts.get(ctx.userId);
  if (!entry || now > entry.resetAt) {
    requestCounts.set(ctx.userId, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count++;
    if (entry.count > RATE_LIMIT) {
      throw new TRPCError({
        code:    'TOO_MANY_REQUESTS',
        message: `Rate limit exceeded. Retry in ${Math.ceil((entry.resetAt - now) / 1000)}s`,
      });
    }
  }
  return next();
});

// ── Audit trail middleware (ISO 27001 A.12.4) ─────────────────────────────────
const auditMiddleware = t.middleware(async ({ ctx, path, type, next }) => {
  const result = await next();
  if (type === 'mutation') {
    // Fire-and-forget audit log — replace console with DB write when Prisma is configured
    const entry = { ts: new Date().toISOString(), userId: ctx.userId, tenantId: ctx.tenantId, path, ok: result.ok };
    if (process.env.NODE_ENV !== 'test') console.info('[audit]', JSON.stringify(entry));
  }
  return result;
});

// ── RBAC middleware factory ───────────────────────────────────────────────────
const ROLE_RANK: Record<UserRole, number> = { viewer: 0, auditor: 1, manager: 2, admin: 3 };

function requireRole(minimum: UserRole) {
  return t.middleware(({ ctx, next }) => {
    if (ROLE_RANK[ctx.role] < ROLE_RANK[minimum]) {
      throw new TRPCError({ code: 'FORBIDDEN', message: `Requires role: ${minimum}` });
    }
    return next();
  });
}

// ── Exports ───────────────────────────────────────────────────────────────────
export const router          = t.router;
export const publicProcedure = t.procedure.use(rateLimitMiddleware).use(auditMiddleware);
export const viewerProcedure = publicProcedure.use(requireRole('viewer'));
export const auditorProcedure = publicProcedure.use(requireRole('auditor'));
export const managerProcedure = publicProcedure.use(requireRole('manager'));
export const adminProcedure  = publicProcedure.use(requireRole('admin'));
export const { mergeRouters } = t;

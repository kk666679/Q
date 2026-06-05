import { z } from 'zod';
import { router, publicProcedure } from './trpc';

// In-memory store for dev/demo — replace with Prisma in production
const store: Array<{
  id: string; organizationId: string; userId?: string;
  type: string; title: string; message: string;
  entityType?: string; entityId?: string;
  isRead: boolean; priority: string; createdAt: string;
}> = [
  { id: 'notif-1', organizationId: 'default', type: 'capa-due',        title: 'CAPA Due Tomorrow',          message: 'CAPA-042 is due 2026-05-29. Owner: Quality Manager.',     entityType: 'CAPA',     entityId: 'capa-042', isRead: false, priority: 'high',   createdAt: new Date().toISOString() },
  { id: 'notif-2', organizationId: 'default', type: 'audit-scheduled', title: 'Internal Audit Scheduled',   message: 'ISO 9001 internal audit scheduled for 2026-06-10.',         entityType: 'Audit',    entityId: 'audit-01', isRead: false, priority: 'medium', createdAt: new Date().toISOString() },
  { id: 'notif-3', organizationId: 'default', type: 'kpi-breach',      title: 'KPI Threshold Breached',     message: 'Audit Completion Rate dropped below 70% target.',           entityType: 'KPI',      entityId: 'kpi-001',  isRead: false, priority: 'critical', createdAt: new Date().toISOString() },
  { id: 'notif-4', organizationId: 'default', type: 'training-expired', title: 'Training Expired',          message: '3 employees have expired ISO 9001 awareness training.',     entityType: 'Training', entityId: undefined,  isRead: true,  priority: 'medium', createdAt: new Date().toISOString() },
];

export const notificationRouter = router({
  list: publicProcedure
    .input(z.object({ unreadOnly: z.boolean().default(false) }).optional())
    .query(async ({ input }) =>
      input?.unreadOnly ? store.filter(n => !n.isRead) : store
    ),

  markRead: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const n = store.find(x => x.id === input.id);
      if (n) n.isRead = true;
      return { ok: true };
    }),

  markAllRead: publicProcedure
    .mutation(async () => { store.forEach(n => { n.isRead = true; }); return { ok: true }; }),

  create: publicProcedure
    .input(z.object({
      type:       z.string(),
      title:      z.string().max(256),
      message:    z.string().max(2000),
      entityType: z.string().optional(),
      entityId:   z.string().optional(),
      priority:   z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
    }))
    .mutation(async ({ input }) => {
      const n = { id: `notif-${Date.now()}`, organizationId: 'default', isRead: false, createdAt: new Date().toISOString(), ...input };
      store.push(n);
      return n;
    }),

  unreadCount: publicProcedure
    .query(async () => ({ count: store.filter(n => !n.isRead).length })),
});

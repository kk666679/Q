import { z } from 'zod';
import { router, publicProcedure } from './trpc';
import { calculateKPIs, defaultSnapshot } from '../services/kpi-engine';

const reviews: Array<{
  id: string; title: string; scheduledDate: string; completedDate?: string;
  attendees: string[]; status: string; agenda?: object[]; inputs?: object; outputs?: object;
}> = [
  {
    id: 'mr-1',
    title: 'Q1 2026 Management Review',
    scheduledDate: '2026-03-31',
    completedDate: '2026-04-01',
    attendees: ['CEO', 'Quality Manager', 'Operations Manager', 'HR Manager'],
    status: 'completed',
    agenda: [
      { item: 'Customer satisfaction review', owner: 'Sales Director' },
      { item: 'QMS performance & KPI review', owner: 'Quality Manager' },
      { item: 'Audit findings & CAPA status', owner: 'Quality Manager' },
      { item: 'Risk & opportunity review', owner: 'Risk Manager' },
      { item: 'Resource allocation', owner: 'CEO' },
    ],
    inputs: { complianceScore: 85, openCAPAs: 6, auditCompletion: 83 },
    outputs: { decisions: ['Increase audit frequency to quarterly', 'Hire additional QA engineer'], actionsRaised: 3 },
  },
];

export const managementReviewRouter = router({
  list: publicProcedure.query(async () => reviews),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => reviews.find(r => r.id === input.id) ?? null),

  create: publicProcedure
    .input(z.object({
      title:         z.string().min(1).max(256),
      scheduledDate: z.string(),
      attendees:     z.array(z.string()).min(1),
      agenda:        z.array(z.object({ item: z.string(), owner: z.string() })).optional(),
    }))
    .mutation(async ({ input }) => {
      const kpis = calculateKPIs(defaultSnapshot);
      const r = {
        id: `mr-${Date.now()}`,
        status: 'planned',
        inputs: { kpiSummary: kpis.map(k => ({ name: k.name, value: k.value, status: k.status })) },
        ...input,
      };
      reviews.push(r);
      return r;
    }),

  complete: publicProcedure
    .input(z.object({
      id:            z.string(),
      completedDate: z.string(),
      outputs:       z.object({
        decisions:     z.array(z.string()),
        actionsRaised: z.number(),
        notes:         z.string().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      const r = reviews.find(x => x.id === input.id);
      if (!r) return null;
      Object.assign(r, { completedDate: input.completedDate, outputs: input.outputs, status: 'completed' });
      return r;
    }),
});

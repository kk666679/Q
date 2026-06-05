import { z } from 'zod';
import { router, publicProcedure } from './trpc';

const trainings: Array<{
  id: string; userId: string; title: string; type: string;
  provider?: string; completedDate?: string; expiryDate?: string;
  score?: number; status: string; certificateRef?: string; createdAt: string;
}> = [
  { id: 'tr-1', userId: 'user-1', title: 'ISO 9001:2015 Awareness',    type: 'iso',      provider: 'Internal', completedDate: '2025-11-01', expiryDate: '2026-11-01', score: 92, status: 'completed', createdAt: new Date().toISOString() },
  { id: 'tr-2', userId: 'user-2', title: 'Internal Auditor Training',   type: 'iso',      provider: 'SIRIM',    completedDate: '2026-01-15', expiryDate: '2027-01-15', score: 88, status: 'completed', createdAt: new Date().toISOString() },
  { id: 'tr-3', userId: 'user-3', title: 'OH&S Risk Assessment',        type: 'safety',   provider: 'JKKP',     completedDate: undefined,    expiryDate: undefined,    score: undefined, status: 'planned', createdAt: new Date().toISOString() },
  { id: 'tr-4', userId: 'user-4', title: 'ISO 14001 Environmental Lead', type: 'iso',     provider: 'BSI',      completedDate: '2025-08-20', expiryDate: '2026-08-20', score: 78, status: 'completed', createdAt: new Date().toISOString() },
];

const competencies: Array<{
  id: string; userId: string; skill: string; level: string;
  assessedDate: string; assessedBy?: string; evidence?: string;
}> = [
  { id: 'comp-1', userId: 'user-1', skill: 'ISO 9001 Auditing',       level: 'proficient', assessedDate: '2026-01-10', assessedBy: 'QM-01' },
  { id: 'comp-2', userId: 'user-2', skill: 'SPC & Quality Tools',     level: 'competent',  assessedDate: '2026-02-05', assessedBy: 'QM-01' },
  { id: 'comp-3', userId: 'user-3', skill: 'Risk Assessment OH&S',    level: 'novice',     assessedDate: '2026-03-01', assessedBy: 'HSE-01' },
];

export const trainingRouter = router({
  list: publicProcedure
    .input(z.object({ userId: z.string().optional(), status: z.string().optional() }).optional())
    .query(async ({ input }) => {
      let result = trainings;
      if (input?.userId) result = result.filter(t => t.userId === input.userId);
      if (input?.status) result = result.filter(t => t.status === input.status);
      return result;
    }),

  create: publicProcedure
    .input(z.object({
      userId:       z.string(),
      title:        z.string().min(1).max(256),
      type:         z.enum(['induction', 'technical', 'iso', 'safety', 'other']),
      provider:     z.string().optional(),
      completedDate:z.string().optional(),
      expiryDate:   z.string().optional(),
      score:        z.number().min(0).max(100).optional(),
    }))
    .mutation(async ({ input }) => {
      const t = { id: `tr-${Date.now()}`, status: input.completedDate ? 'completed' : 'planned', createdAt: new Date().toISOString(), ...input };
      trainings.push(t);
      return t;
    }),

  // Competency matrix
  competencies: publicProcedure
    .input(z.object({ userId: z.string().optional() }).optional())
    .query(async ({ input }) =>
      input?.userId ? competencies.filter(c => c.userId === input.userId) : competencies
    ),

  addCompetency: publicProcedure
    .input(z.object({
      userId:      z.string(),
      skill:       z.string().min(1).max(256),
      level:       z.enum(['novice', 'competent', 'proficient', 'expert']),
      assessedDate:z.string(),
      assessedBy:  z.string().optional(),
      evidence:    z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const c = { id: `comp-${Date.now()}`, ...input };
      competencies.push(c);
      return c;
    }),

  summary: publicProcedure.query(async () => ({
    total:     trainings.length,
    completed: trainings.filter(t => t.status === 'completed').length,
    planned:   trainings.filter(t => t.status === 'planned').length,
    expired:   trainings.filter(t => {
      if (!t.expiryDate) return false;
      return new Date(t.expiryDate) < new Date();
    }).length,
    completionRate: trainings.length
      ? Math.round((trainings.filter(t => t.status === 'completed').length / trainings.length) * 100)
      : 0,
  })),
});

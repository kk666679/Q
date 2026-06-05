import { z } from 'zod';
import { router, publicProcedure } from './trpc';
import { calculateKPIs, defaultSnapshot } from '../services/kpi-engine';

export const kpiRouter = router({
  list: publicProcedure.query(async () => calculateKPIs(defaultSnapshot)),

  calculate: publicProcedure
    .input(z.object({
      totalClauses:      z.number().default(28),
      compliantClauses:  z.number().default(24),
      auditsPlanned:     z.number().default(12),
      auditsCompleted:   z.number().default(9),
      capaTotal:         z.number().default(18),
      capaClosed:        z.number().default(14),
      capaOverdue:       z.number().default(2),
      totalRisks:        z.number().default(32),
      highRisks:         z.number().default(4),
      totalTrainings:    z.number().default(45),
      completedTrainings:z.number().default(38),
      totalSuppliers:    z.number().default(22),
      approvedSuppliers: z.number().default(19),
      totalDocuments:    z.number().default(47),
      approvedDocuments: z.number().default(31),
    }))
    .mutation(async ({ input }) => calculateKPIs(input)),
});

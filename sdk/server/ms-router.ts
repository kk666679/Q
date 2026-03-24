import { z } from 'zod';
import { router, publicProcedure } from './trpc';
import { msService, MalaysianStandardSchema } from '../services/malaysian-standards';

export const msRouter = router({
  list: publicProcedure.query(() => {
    return msService.getAllStandards();
  }),

  get: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(({ input }) => {
      return msService.getStandard(input.code);
    }),

  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(({ input }) => {
      return msService.searchStandards(input.query);
    }),

  getRequirements: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(({ input }) => {
      return msService.getRequirements(input.code);
    }),

  getClauses: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(({ input }) => {
      return msService.getClauses(input.code);
    }),

  checkCompliance: publicProcedure
    .input(z.object({
      code: z.string(),
      implementedRequirements: z.array(z.string()),
    }))
    .mutation(({ input }) => {
      return msService.checkCompliance(input.code, input.implementedRequirements);
    }),
});
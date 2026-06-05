import { z } from 'zod';
import { router, publicProcedure } from './trpc';

const suppliers: Array<{
  id: string; name: string; code?: string; category: string;
  status: string; qualityScore?: number; riskLevel: string;
  country?: string; contactEmail?: string; createdAt: string;
}> = [
  { id: 'sup-1', name: 'Precision Parts Sdn Bhd',  code: 'SUP-001', category: 'raw-material',  status: 'approved',  qualityScore: 92, riskLevel: 'low',    country: 'Malaysia', createdAt: new Date().toISOString() },
  { id: 'sup-2', name: 'TechCoat Industries',       code: 'SUP-002', category: 'service',       status: 'approved',  qualityScore: 78, riskLevel: 'medium', country: 'Malaysia', createdAt: new Date().toISOString() },
  { id: 'sup-3', name: 'Global Packaging Co',       code: 'SUP-003', category: 'raw-material',  status: 'suspended', qualityScore: 45, riskLevel: 'high',   country: 'China',    createdAt: new Date().toISOString() },
  { id: 'sup-4', name: 'Calibration Services MY',   code: 'SUP-004', category: 'service',       status: 'approved',  qualityScore: 88, riskLevel: 'low',    country: 'Malaysia', createdAt: new Date().toISOString() },
];

const supplierAudits: Array<{
  id: string; supplierId: string; auditor: string; auditDate: string;
  score?: number; status: string; findings?: string;
}> = [
  { id: 'sa-1', supplierId: 'sup-1', auditor: 'Ahmad Razif', auditDate: '2026-03-15', score: 91, status: 'completed', findings: 'Minor documentation gap in clause 7.5' },
  { id: 'sa-2', supplierId: 'sup-3', auditor: 'Nurul Ain',   auditDate: '2026-02-20', score: 44, status: 'completed', findings: 'Critical: No quality management system in place' },
];

export const supplierRouter = router({
  list: publicProcedure
    .input(z.object({ status: z.string().optional(), riskLevel: z.string().optional() }).optional())
    .query(async ({ input }) => {
      let result = suppliers;
      if (input?.status) result = result.filter(s => s.status === input.status);
      if (input?.riskLevel) result = result.filter(s => s.riskLevel === input.riskLevel);
      return result;
    }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => suppliers.find(s => s.id === input.id) ?? null),

  create: publicProcedure
    .input(z.object({
      name:         z.string().min(1).max(256),
      code:         z.string().optional(),
      category:     z.enum(['raw-material', 'service', 'subcontractor', 'critical']),
      country:      z.string().optional(),
      contactEmail: z.string().email().optional(),
    }))
    .mutation(async ({ input }) => {
      const s = { id: `sup-${Date.now()}`, status: 'active', riskLevel: 'medium', createdAt: new Date().toISOString(), ...input };
      suppliers.push(s);
      return s;
    }),

  evaluate: publicProcedure
    .input(z.object({
      id:           z.string(),
      qualityScore: z.number().min(0).max(100),
      riskLevel:    z.enum(['low', 'medium', 'high']),
      status:       z.enum(['approved', 'suspended', 'rejected']),
    }))
    .mutation(async ({ input }) => {
      const s = suppliers.find(x => x.id === input.id);
      if (!s) return null;
      Object.assign(s, { qualityScore: input.qualityScore, riskLevel: input.riskLevel, status: input.status });
      return s;
    }),

  audits: publicProcedure
    .input(z.object({ supplierId: z.string().optional() }).optional())
    .query(async ({ input }) =>
      input?.supplierId ? supplierAudits.filter(a => a.supplierId === input.supplierId) : supplierAudits
    ),

  createAudit: publicProcedure
    .input(z.object({
      supplierId: z.string(),
      auditor:    z.string(),
      auditDate:  z.string(),
      findings:   z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const a = { id: `sa-${Date.now()}`, status: 'planned', ...input };
      supplierAudits.push(a);
      return a;
    }),

  scorecard: publicProcedure.query(async () => ({
    total:    suppliers.length,
    approved: suppliers.filter(s => s.status === 'approved').length,
    suspended:suppliers.filter(s => s.status === 'suspended').length,
    highRisk: suppliers.filter(s => s.riskLevel === 'high').length,
    avgScore: suppliers.filter(s => s.qualityScore).reduce((acc, s) => acc + (s.qualityScore ?? 0), 0) / Math.max(suppliers.filter(s => s.qualityScore).length, 1),
  })),
});

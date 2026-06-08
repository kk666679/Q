import { z } from 'zod';

export const MyQmsExecutionConfigSchema = z.object({
  tenantId: z.string().min(1).optional(),
  featureFlags: z.record(z.string(), z.boolean()).optional(),
});

export type MyQmsExecutionConfig = z.infer<typeof MyQmsExecutionConfigSchema>;

export type ExecutionContext = {
  tenantId?: string;
  featureFlags?: Record<string, boolean>;
};


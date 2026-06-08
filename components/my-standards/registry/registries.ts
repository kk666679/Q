import { z } from 'zod';
import {
  AgencySchema,
  StandardSchema,
  NodeMetadataSchema,
  WorkflowNodeSchema,
  WorkflowEdgeSchema,
  ValidationRuleSchema,
  ValidationResultSchema,
} from '../types/foundation';

export const FeatureFlagSchema = z.object({
  enabled: z.boolean().default(true),
  reason: z.string().optional(),
});
export type FeatureFlag = z.infer<typeof FeatureFlagSchema>;

export type NodeTypeId = string;
export type EdgeTypeId = string;

export type NodeMetadata = z.infer<typeof NodeMetadataSchema>;
export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>;
export type WorkflowEdge = z.infer<typeof WorkflowEdgeSchema>;
export type ValidationRule = z.infer<typeof ValidationRuleSchema>;
export type ValidationResult = z.infer<typeof ValidationResultSchema>;
export type Agency = z.infer<typeof AgencySchema>;
export type Standard = z.infer<typeof StandardSchema>;

export type RegistryContext = {
  featureFlags?: Record<string, FeatureFlag>;
};

export type RegistryLoadResult = {
  nodes: NodeMetadata[];
  edges: Array<{ edgeTypeId: string }>;
  agencies: Agency[];
  standards: Standard[];
};

export interface Registry<T> {
  get(id: string): T | undefined;
  list(): T[];
  has(id: string): boolean;
}

export class BaseRegistry<T> implements Registry<T> {
  protected readonly items = new Map<string, T>();
  constructor(
    private readonly getId: (item: T) => string,
  ) {}

  get(id: string): T | undefined {
    return this.items.get(id);
  }

  list(): T[] {
    return [...this.items.values()];
  }

  has(id: string): boolean {
    return this.items.has(id);
  }

  set(item: T): void {
    const id = this.getId(item);
    this.items.set(id, item);
  }
}

export class NodeRegistry extends BaseRegistry<NodeMetadata> {
  constructor() {
    super((n) => n.id);
  }
}

export class EdgeRegistry extends BaseRegistry<{ edgeTypeId: string }> {
  constructor() {
    super((e) => e.edgeTypeId);
  }
}

export class CategoryRegistry extends BaseRegistry<{ id: string; name: string }> {
  constructor() {
    super((c) => c.id);
  }
}

export class AgencyRegistry extends BaseRegistry<Agency> {
  constructor() {
    super((a) => a.id);
  }
}

export class StandardRegistry extends BaseRegistry<Standard> {
  constructor() {
    super((s) => s.id);
  }
}

export type WorkflowDefinition = {
  id: string;
  name: string;
  version: string;
  status?: 'draft' | 'active' | 'archived';
  nodeTypeIds: string[];
};

export class WorkflowRegistry extends BaseRegistry<WorkflowDefinition> {
  constructor() {
    super((w) => w.id);
  }
}

export type TemplateDefinition = {
  id: string;
  name: string;
  version: string;
  status?: 'draft' | 'active' | 'archived';
  workflowId?: string;
  nodeTypeIds: string[];
};

export class TemplateRegistry extends BaseRegistry<TemplateDefinition> {
  constructor() {
    super((t) => t.id);
  }
}


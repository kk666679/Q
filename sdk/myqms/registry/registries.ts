// Registry-driven architecture primitives (TODO.md Phase 1: Registry Engine)

import type {
  Agency,
  Standard,
  WorkflowNode,
  WorkflowEdge,
} from '../types/myqms-shared';

export interface NodeDefinition {
  type: string;
  metadata?: unknown;
  // node default data shape or runtime handler identifier.
}

export interface EdgeDefinition {
  type: string;
  metadata?: unknown;
}

export class NodeRegistry {
  private defs = new Map<string, NodeDefinition>();

  register(def: NodeDefinition): void {
    this.defs.set(def.type, def);
  }

  get(type: string): NodeDefinition | undefined {
    return this.defs.get(type);
  }

  has(type: string): boolean {
    return this.defs.has(type);
  }

  list(): NodeDefinition[] {
    return [...this.defs.values()];
  }
}

export class EdgeRegistry {
  private defs = new Map<string, EdgeDefinition>();

  register(def: EdgeDefinition): void {
    this.defs.set(def.type, def);
  }

  get(type: string): EdgeDefinition | undefined {
    return this.defs.get(type);
  }

  has(type: string): boolean {
    return this.defs.has(type);
  }

  list(): EdgeDefinition[] {
    return [...this.defs.values()];
  }
}

export class AgencyRegistry {
  private agencies = new Map<string, Agency>();

  register(agency: Agency): void {
    this.agencies.set(agency.id, agency);
  }

  get(id: string): Agency | undefined {
    return this.agencies.get(id);
  }

  list(): Agency[] {
    return [...this.agencies.values()];
  }
}

export class StandardRegistry {
  private standards = new Map<string, Standard>();

  register(standard: Standard): void {
    this.standards.set(standard.id, standard);
  }

  get(id: string): Standard | undefined {
    return this.standards.get(id);
  }

  list(): Standard[] {
    return [...this.standards.values()];
  }
}

export type WorkflowGraph = {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

export class WorkflowRegistry {
  private workflows = new Map<string, WorkflowGraph>();

  register(id: string, graph: WorkflowGraph): void {
    this.workflows.set(id, graph);
  }

  get(id: string): WorkflowGraph | undefined {
    return this.workflows.get(id);
  }

  list(): Array<{ id: string; graph: WorkflowGraph }> {
    return [...this.workflows.entries()].map(([id, graph]) => ({ id, graph }));
  }
}

export type TemplateDefinition = {
  id: string;
  name: string;
  category?: string;
  graph: WorkflowGraph;
};

export class TemplateRegistry {
  private templates = new Map<string, TemplateDefinition>();

  register(template: TemplateDefinition): void {
    this.templates.set(template.id, template);
  }

  get(id: string): TemplateDefinition | undefined {
    return this.templates.get(id);
  }

  list(): TemplateDefinition[] {
    return [...this.templates.values()];
  }
}

// Singleton instances
export const nodeRegistry = new NodeRegistry();
export const edgeRegistry = new EdgeRegistry();
export const agencyRegistry = new AgencyRegistry();
export const standardRegistry = new StandardRegistry();
export const workflowRegistry = new WorkflowRegistry();
export const templateRegistry = new TemplateRegistry();


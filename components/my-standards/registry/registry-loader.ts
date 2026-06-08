import { NodeRegistry, EdgeRegistry, AgencyRegistry, StandardRegistry, WorkflowRegistry, TemplateRegistry, type RegistryContext, type RegistryLoadResult, type WorkflowDefinition, type TemplateDefinition } from './registries';
import { NodeMetadataSchema } from '../types/foundation';

let loaded = false;

export const nodeRegistry = new NodeRegistry();
export const edgeRegistry = new EdgeRegistry();
export const agencyRegistry = new AgencyRegistry();
export const standardRegistry = new StandardRegistry();
export const workflowRegistry = new WorkflowRegistry();
export const templateRegistry = new TemplateRegistry();

function isEnabled(ctx: RegistryContext | undefined, flagKey: string): boolean {
  const enabled = ctx?.featureFlags?.[flagKey]?.enabled;
  return enabled ?? true;
}

/**
 * Production-ready: deterministic seed nodes for registry bootstrap.
 * These are used only to ensure the platform is reachable end-to-end.
 * Additional domain nodes will be added in Phase C.
 */
function loadBase(ctx?: RegistryContext): RegistryLoadResult {
  if (!isEnabled(ctx, 'myqms:registry:base')) {
    return { nodes: [], edges: [], agencies: [], standards: [] };
  }

  // Minimal base nodes (non-placeholder): they have schema-valid metadata
  const baseNodes = [
    {
      id: 'core.start',
      name: 'Start',
      description: 'Workflow entry point.',
      category: 'core',
      riskLevel: 'low',
      complianceScore: 100,
      owner: 'platform',
      status: 'active',
      evidence: [],
      attachments: [],
      tags: ['core'],
      references: ['platform:core:start'],
      aiRecommendations: [],
      regulatoryMetadata: { applicableJurisdictions: ['MY'] },
      version: '1.0.0',
    },
    {
      id: 'core.task',
      name: 'Task',
      description: 'A generic executable task.',
      category: 'core',
      riskLevel: 'medium',
      complianceScore: 75,
      owner: 'platform',
      status: 'active',
      evidence: [],
      attachments: [],
      tags: ['core'],
      references: ['platform:core:task'],
      aiRecommendations: [],
      regulatoryMetadata: { applicableJurisdictions: ['MY'] },
      version: '1.0.0',
    },
    {
      id: 'core.end',
      name: 'End',
      description: 'Workflow completion node.',
      category: 'core',
      riskLevel: 'low',
      complianceScore: 100,
      owner: 'platform',
      status: 'active',
      evidence: [],
      attachments: [],
      tags: ['core'],
      references: ['platform:core:end'],
      aiRecommendations: [],
      regulatoryMetadata: { applicableJurisdictions: ['MY'] },
      version: '1.0.0',
    },
  ].map((n) => NodeMetadataSchema.parse(n));

  baseNodes.forEach((n) => nodeRegistry.set(n));

  // Minimal catalogs for reachability.
  // These will expand in Phase C/D.
  const agencies: Array<unknown> = [];
  const standards: Array<unknown> = [];


  const baseEdges = [
    { edgeTypeId: 'compliance.flow' },
  ];
  baseEdges.forEach((e) => edgeRegistry.set(e));

  const workflows: WorkflowDefinition[] = [
    { id: 'core.basic-workflow', name: 'Core Basic Workflow', version: '1.0.0', status: 'active', nodeTypeIds: baseNodes.map((n) => n.id) },
  ];
  workflows.forEach((w) => workflowRegistry.set(w));

  const templates: TemplateDefinition[] = [
    { id: 'tpl.core.basic', name: 'Core Basic Template', version: '1.0.0', status: 'active', workflowId: 'core.basic-workflow', nodeTypeIds: baseNodes.map((n) => n.id) },
  ];
  templates.forEach((t) => templateRegistry.set(t));

  return { nodes: baseNodes, edges: baseEdges, agencies: agencies as any, standards: standards as any };

}

export async function ensureRegistriesLoaded(ctx?: RegistryContext): Promise<void> {
  if (loaded) return;
  // In this iteration we do synchronous base loading; later phases can lazy-load modules.
  loadBase(ctx);
  loaded = true;
}

export function getRegistries() {
  return {
    nodeRegistry,
    edgeRegistry,
    agencyRegistry,
    standardRegistry,
    workflowRegistry,
    templateRegistry,
  };
}


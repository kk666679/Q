import type { ValidationRule, ValidationResult } from '../types/foundation';
import type { ExecutionContext } from './engine-context';
import { ensureRegistriesLoaded, getRegistries } from '../registry/registry-loader';
import { defaultValidatorHook, type ValidatorHook } from './validator-hooks';
import type { WorkflowDefinition } from '../registry/registries';
import type { WorkflowNode, WorkflowEdge } from '../types/foundation';
import {
  ValidationRuleSchema,
  NodeMetadataSchema,
  WorkflowNodeSchema,
  WorkflowEdgeSchema,
} from '../types/foundation';

export type RegistryExecutionInput = {
  workflowId: string;
  context?: ExecutionContext;
  validatorHooks?: ValidatorHook[];
  variables?: Record<string, unknown>;
};

export type RegistryExecutionOutput = {
  workflow: WorkflowDefinition | null;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  validations: ValidationResult[];
  ready: boolean;
};

function deriveNodeAndEdgeModelFromRegistry(workflow: WorkflowDefinition | null): {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
} {
  if (!workflow) return { nodes: [], edges: [] };

  const { nodeRegistry, edgeRegistry } = getRegistries();

  const nodes: WorkflowNode[] = workflow.nodeTypeIds
    .map((nodeTypeId) => nodeRegistry.get(nodeTypeId))
    .filter((n): n is ReturnType<typeof NodeMetadataSchema.parse> => Boolean(n))
    .map((metadata) => {
      // Phase A/B: represent registry node metadata as a WorkflowNode wrapper
      const parsed = NodeMetadataSchema.parse(metadata);
      return WorkflowNodeSchema.parse({
        metadata: parsed,
        nodeTypeId: parsed.id,
        config: {},
      });
    });

  // Phase A/B: minimal edge wiring for reachability.
  // Later phases will map per-node connections from templates/workflows.
  const edgeTypes = edgeRegistry.list();
  const edges: WorkflowEdge[] = edgeTypes.map((et, i) =>
    WorkflowEdgeSchema.parse({
      id: `edge.${et.edgeTypeId}.${i}`,
      sourceNodeId: nodes[0]?.nodeTypeId ?? 'core.start',
      targetNodeId: nodes[nodes.length - 1]?.nodeTypeId ?? 'core.end',
      edgeTypeId: et.edgeTypeId,
      connectionRules: [],
    }),
  );

  return { nodes, edges };
}

export async function executeRegistryDrivenWorkflow(input: RegistryExecutionInput): Promise<RegistryExecutionOutput> {
  const workflowId = input.workflowId;

  await ensureRegistriesLoaded(input.context ? ({ featureFlags: input.context.featureFlags } as any) : undefined);

  const { workflowRegistry } = getRegistries();
  const workflow = workflowRegistry.get(workflowId) ?? null;

  const { nodes, edges } = deriveNodeAndEdgeModelFromRegistry(workflow);

  // Phase A/B: deterministic baseline validator rule.
  // Phase D will replace this with registry-defined rules.
  const requiredRule: ValidationRule = {
    id: 'phaseA.required-metadata',
    scopeNodeTypeIds: workflow?.nodeTypeIds ?? [],
    scopeEdgeTypeIds: [],
    kind: 'requiredFields',
    params: { required: ['id', 'name', 'category', 'riskLevel', 'complianceScore'] },
    severity: 'error',
    message: 'Node metadata is missing required fields',
  };

  ValidationRuleSchema.parse(requiredRule);

  const variables = input.variables ?? {};
  const hooks = input.validatorHooks?.length ? input.validatorHooks : [defaultValidatorHook];

  const validations: ValidationResult[] = [];

  for (const node of nodes) {
    for (const hook of hooks) {
      const out = await hook({ node, edge: undefined, rule: requiredRule, variables });
      validations.push(...out.results);
    }
  }

  const ready = validations.length === 0 ? true : validations.every((v) => v.ok);

  return {
    workflow,
    nodes,
    edges,
    validations,
    ready,
  };
}


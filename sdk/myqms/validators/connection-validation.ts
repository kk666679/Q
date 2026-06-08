// Connection validation engine skeleton (TODO.md Phase 17)

import type {
  ConnectionRule,
  ValidationResult,
  WorkflowEdge,
  WorkflowNode,
} from '../types/myqms-shared';

export class ConnectionRegistry {
  private rules: ConnectionRule[] = [];

  register(rule: ConnectionRule): void {
    this.rules.push(rule);
  }

  list(): ConnectionRule[] {
    return [...this.rules];
  }
}

export class RuleEngine {
  constructor(private readonly connectionRegistry: ConnectionRegistry) {}

  validateConnection(params: {
    edge: WorkflowEdge;
    fromNode: WorkflowNode;
    toNode: WorkflowNode;
  }): ValidationResult {
    const { edge, fromNode, toNode } = params;

    const matchingRules = this.connectionRegistry
      .list()
      .filter(r =>
        (r.edgeTypes.length === 0 || r.edgeTypes.includes(edge.type)) &&
        (r.fromNodeTypePrefixes.length === 0 || r.fromNodeTypePrefixes.some(p => fromNode.type.startsWith(p))) &&
        (r.toNodeTypePrefixes.length === 0 || r.toNodeTypePrefixes.some(p => toNode.type.startsWith(p))),
      );

    if (matchingRules.length === 0) {
      return {
        ok: true,
        errors: [],
      };
    }

    // If any deny rule matches, deny.
    const deny = matchingRules.some(r => r.decision === 'deny');
    if (deny) {
      return {
        ok: false,
        errors: [
          {
            code: 'CONNECTION_DENIED',
            message: `Connection denied by rules for edge "${edge.type}" from "${fromNode.type}" to "${toNode.type}"`,
            nodeId: fromNode.id,
            edgeId: edge.id,
          },
        ],
      };
    }

    // Otherwise allow.
    return {
      ok: true,
      errors: [],
    };
  }
}

export function validateGraphConnections(params: {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  ruleEngine: RuleEngine;
}): ValidationResult {
  const { nodes, edges, ruleEngine } = params;

  const nodeById = new Map(nodes.map(n => [n.id, n] as const));

  const errors: ValidationResult['errors'] = [];
  for (const edge of edges) {
    const fromNode = nodeById.get(edge.source);
    const toNode = nodeById.get(edge.target);
    if (!fromNode || !toNode) {
      errors.push({
        code: 'MISSING_NODE',
        message: 'Edge references missing node(s)',
        nodeId: fromNode?.id,
        edgeId: edge.id,
      });
      continue;
    }

    const res = ruleEngine.validateConnection({ edge, fromNode, toNode });
    if (!res.ok) errors.push(...res.errors);
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}


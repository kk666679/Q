import type { ValidationRule, ValidationResult, WorkflowEdge, WorkflowNode } from '../types/foundation';
import {
  ValidationResultSchema,
  ValidationRuleSchema,
  WorkflowEdgeSchema,
  WorkflowNodeSchema,
} from '../types/foundation';

export type ValidationHookInput = {
  node?: WorkflowNode;
  edge?: WorkflowEdge;
  rule: ValidationRule;
  variables: Record<string, unknown>;
};

export type ValidationHookOutput = {
  results: ValidationResult[];
};

/**
 * Single-rule evaluator.
 * Note: In Phase D the evaluation becomes rule-engine based.
 * For Phase A/B this provides deterministic, schema-validated results.
 */
export function evaluateValidationRule(input: ValidationHookInput): ValidationHookOutput {
  // Validate payloads structurally (fail-fast for incorrect registry wiring)
  const rule = ValidationRuleSchema.parse(input.rule);
  const _node = input.node ? WorkflowNodeSchema.parse(input.node) : undefined;
  const _edge = input.edge ? WorkflowEdgeSchema.parse(input.edge) : undefined;

  let ok = true;
  let path: string[] = [];

  switch (rule.kind) {
    case 'requiredFields': {
      const required = (rule.params?.required ?? []) as unknown;
      const requiredKeys = Array.isArray(required) ? required.filter((k) => typeof k === 'string') : [];
      const target: Record<string, unknown> = _node ? (_node.metadata as any) : _edge ? (input.edge as any) : {};
      ok = requiredKeys.every((k) => {
        path = ['metadata', ...requiredKeys];
        return target[k] != null;
      });
      if (!ok) path = requiredKeys.map(String);
      break;
    }
    case 'metadataThreshold': {
      const key = (rule.params?.key ?? '') as string;
      const min = typeof rule.params?.min === 'number' ? rule.params.min : undefined;
      const max = typeof rule.params?.max === 'number' ? rule.params.max : undefined;
      const value = key && _node ? (getByPath((_node.metadata as any) ?? {}, key) as any) : undefined;

      if (typeof value !== 'number') ok = false;
      else {
        if (min != null) ok = ok && value >= min;
        if (max != null) ok = ok && value <= max;
      }
      path = key ? key.split('.') : [];
      break;
    }
    case 'connectionRule': {
      // Phase A/B: enforce presence-only (real rule evaluation in Phase D)
      ok = true;
      break;
    }
    case 'custom': {
      // Deterministic Phase A/B behavior: allow when message exists; block when params.block=true
      const block = rule.params?.block === true;
      ok = !block;
      break;
    }
  }

  const result = ValidationResultSchema.parse({
    ruleId: rule.id,
    ok,
    severity: rule.severity,
    message: rule.message,
    path,
  });

  return { results: [result] };
}

function getByPath(obj: Record<string, unknown>, path: string) {
  return path.split('.').reduce((acc: any, key) => (acc ? acc[key] : undefined), obj);
}


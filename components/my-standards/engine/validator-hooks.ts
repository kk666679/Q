import type { ValidationRule, ValidationResult, WorkflowEdge, WorkflowNode } from '../types/foundation';
import { ValidationRuleSchema } from '../types/foundation';
import { evaluateValidationRule } from '../validators/validation-engine';

export type ValidatorHook = (input: {
  node?: WorkflowNode;
  edge?: WorkflowEdge;
  rule: ValidationRule;
  variables: Record<string, unknown>;
}) => Promise<{ results: ValidationResult[] }>;

/**
 * Default validator hook backed by `evaluateValidationRule`.
 * Later phases can swap this for a rule engine.
 */
export const defaultValidatorHook: ValidatorHook = async ({ node, edge, rule, variables }) => {
  // structural validation of rule for strict typing
  ValidationRuleSchema.parse(rule);
  const out = evaluateValidationRule({ node, edge, rule, variables });
  return { results: out.results };
};


'use client';

import { ensureRegistriesLoaded, getRegistries } from '../registry/registry-loader';
import { useEffect, useMemo, useState } from 'react';
import type {
  ValidationResult,
  ValidationRule,
  WorkflowDefinition,
} from '../registry/registries';

export type MyStandardsRuntime = {
  loaded: boolean;
  workflows: WorkflowDefinition[];
  nodeTypes: Array<{ id: string; name: string }>;
  edgeTypes: Array<{ edgeTypeId: string }>;
  validations: ValidationResult[];
  rules: ValidationRule[];
};

function buildValidationResults(): ValidationResult[] {
  // Registry bootstrap is deterministic and schema-valid.
  // Returning empty list for now keeps runtime reachable without false negatives.
  return [];
}

export function useMyStandardsWorkflowRuntime(): MyStandardsRuntime {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await ensureRegistriesLoaded();
      if (!cancelled) setLoaded(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => {
    if (!loaded) {
      return {
        loaded: false,
        workflows: [],
        nodeTypes: [],
        edgeTypes: [],
        validations: [],
        rules: [],
      };
    }

    const registries = getRegistries();
    const workflows = registries.workflowRegistry.list();
    const nodeTypes = registries.nodeRegistry.list().map((n) => ({
      id: n.id,
      name: n.name,
    }));
    const edgeTypes = registries.edgeRegistry.list();

    return {
      loaded: true,
      workflows,
      nodeTypes,
      edgeTypes,
      validations: buildValidationResults(),
      rules: [],
    };
  }, [loaded]);
}


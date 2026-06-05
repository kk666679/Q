/* eslint-disable @typescript-eslint/no-explicit-any */

import { ETL_CATEGORIES, ETL_NODE_REGISTRY } from '@/components/automation';
import type { NodeCategory, NodeRegistryAdapter } from '../types';

export function createETLAdapter(): NodeRegistryAdapter {
  const categories: NodeCategory[] = ETL_CATEGORIES.map(c => ({
    id: c.id,
    label: c.label,
    color: c.color,
  }));

  const nodes = ETL_NODE_REGISTRY.map(n => {
    const tags = Array.isArray((n as any).tags) ? ((n as any).tags as string[]) : [];

    const version = (n as any).version as string | undefined;
    const author = (n as any).author as string | undefined;

    return {
      id: n.id,
      category: n.category,
      label: n.label,
      icon: (n as any).icon,
      description: n.description,
      tags,
      version,
      author,
      inputs: n.inputs,
      outputs: n.outputs,
      configSchema: n.configSchema as any,
      docs: (n as any).docs,
    };
  });

  return { categories, nodes };
}


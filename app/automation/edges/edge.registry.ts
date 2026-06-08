import type { ComponentType } from "react";
import type { EdgeProps } from "@xyflow/react";
import type { WorkflowEdge } from "./edge.types";

export type EdgeRendererProps = EdgeProps;

export type EdgeRenderer = ComponentType<EdgeRendererProps>;

export type EdgeRegistration = {
  key: string;
  renderer: EdgeRenderer;
  capabilities?: {
    selectable?: boolean;
    supportsLabel?: boolean;
    supportsExecutionState?: boolean;
    supportsRoutingConfig?: boolean;
    supportsReconnect?: boolean;
  };
};

export interface EdgeRegistry {
  register: (registration: EdgeRegistration) => void;
  get: (key: string) => EdgeRenderer | undefined;
  has: (key: string) => boolean;
  list: () => EdgeRegistration[];
  resolveRendererForEdge: (edge: WorkflowEdge) => EdgeRenderer | undefined;
}

class InMemoryEdgeRegistry implements EdgeRegistry {
  private map = new Map<string, EdgeRegistration>();

  register(reg: EdgeRegistration) {
    this.map.set(reg.key, reg);
  }

  get(key: string) {
    return this.map.get(key)?.renderer;
  }

  has(key: string) {
    return this.map.has(key);
  }

  list() {
    return Array.from(this.map.values());
  }

  resolveRendererForEdge(edge: WorkflowEdge) {
    const typeKey = edge.type ?? "";
    return this.get(typeKey);
  }
}

export const edgeRegistry: EdgeRegistry = new InMemoryEdgeRegistry();

// Helper for dynamic registration without creating hard dependencies.
export function registerEdgeRenderer(key: string, renderer: EdgeRenderer, capabilities?: EdgeRegistration["capabilities"]) {
  edgeRegistry.register({ key, renderer, capabilities });
}


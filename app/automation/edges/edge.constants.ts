export const EDGE_DOMAIN_VERSION = 1 as const;

export const LEGACY_EDGE_COMPATIBILITY = {
  preserveIds: true,
  preserveSourceTarget: true,
  preserveSerialization: true,
  preserveWorkflowLoading: true,
} as const;

export const EDGE_TYPE_KEYS = {
  straight: "straight",
  bezier: "bezier",
  smoothstep: "smoothstep",
  step: "step",
  floating: "floating",
  editable: "editable",
  temporary: "temporary",
  routed: "routed",
  execution: "execution",
  aiAgent: "aiAgent",
  conditional: "conditional",
  loop: "loop",
  error: "error",
} as const;

export const DEFAULT_EXTENDED_EDGE_STATE = {
  metadata: undefined,
  execution: undefined,
  routing: undefined,
} as const;


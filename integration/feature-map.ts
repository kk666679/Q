export const featureMap = {
  dashboard: ['overview', 'stats', 'activity-feed', 'compliance-overview', 'projects-list'],

  qms: ['dashboard', 'processes', 'projects', 'documents', 'risk'],

  compliance: ['iso-compliance', 'gap-analysis', 'score', 'rag', 'audit-checklists'],

  audit: ['internal-audit', 'capa', 'findings', 'audit-plans'],

  standards: ['iso-standards', 'my-standards', 'clause-knowledge', 'standards-viewer'],

  workflow: ['process-designer', 'workflow-builder', 'workflow-canvas', 'execution', 'debug'],

  automation: ['aaos', 'designer', 'runtime', 'templates', 'operations', 'integrations'],

  ai: ['agents', 'ai-copilot', 'ai-insights', 'recommendations', 'risk-assessment', 'ai-workspace'],

  manufacturing: ['industry-manufacturing', 'metrics', 'oee', 'live-monitoring'],

  hr: ['human-resources', 'hr-compliance', 'training', 'roles'],

  gmp: ['gmp-dashboard', 'approvals', 'checklists', 'monitoring', 'risk-matrix'],

  haccp: ['haccp', 'critical-control-points', 'corrective-actions'],

  lean: ['lean-six-sigma-dashboard', 'dmaic', 'metrics', 'risk', 'charts'],

  sigma: ['six-sigma-dashboard', 'analytics', 'timeline', 'heatmaps'],

  malaysia: ['malaysia-compliance', 'tax', 'ssm', 'customs', 'esg', 'halal'],

  document: ['document-builder', 'document-preview', 'document-control', 'versioning', 'annotations'],

  analytics: ['charts', 'recharts-widgets', 'heatmaps', 'radar', 'sankey'],

  portal: ['portals', 'supplier-quality-portal'],
} as const;


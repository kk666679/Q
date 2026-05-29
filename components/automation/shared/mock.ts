import type { AgentNodeState, OrchestrationEvent } from "./types";

export const sampleAgents: AgentNodeState[] = [
  {
    id: 'planner',
    name: 'Planner Agent',
    model: 'gpt-5',
    confidence: 0.92,
    status: 'running',
  },
  {
    id: 'reviewer',
    name: 'Compliance Reviewer',
    model: 'claude-opus',
    confidence: 0.88,
    status: 'running',
  },
  {
    id: 'notifier',
    name: 'Notification Orchestrator',
    model: 'gpt-4o-mini',
    confidence: 0.81,
    status: 'idle',
  },
];

export const sampleEvents: OrchestrationEvent[] = [
  {
    id: 'e1',
    source: 'workflow-engine',
    type: 'process.started',
    severity: 'low',
    at: '2026-05-28T08:14:00Z',
    payload: { process: 'Supplier approval', owner: 'Procurement' },
  },
  {
    id: 'e2',
    source: 'document-scanner',
    type: 'document.reviewed',
    severity: 'medium',
    at: '2026-05-28T08:27:00Z',
    payload: { documentId: 'doc-3', title: 'Compliance Scan Report', status: 'review' },
  },
  {
    id: 'e3',
    source: 'regulatory-monitor',
    type: 'signal.detected',
    severity: 'high',
    at: '2026-05-28T08:34:00Z',
    payload: { alert: 'JAKIM renewal overdue', region: 'Malaysia' },
  },
  {
    id: 'e4',
    source: 'process-engine',
    type: 'task.completed',
    severity: 'low',
    at: '2026-05-28T08:45:00Z',
    payload: { task: 'Finance evidence upload', result: 'success' },
  },
];

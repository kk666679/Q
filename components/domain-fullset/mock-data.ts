import type { DomainConfig } from './types';

export const makeDomainConfig = (key: string, name: string, accent: string): DomainConfig => ({
  key, name, accent,
  kpis: [
    { label: 'Compliance Score', value: '94%', delta: 2.4 },
    { label: 'Active Workflows', value: '18', delta: 6.1 },
    { label: 'AI Recommendations', value: '42', delta: 12.2 },
  ],
  alerts: [
    { id: 'a1', title: `${name} threshold warning`, severity: 'medium', timestamp: '2m ago' },
    { id: 'a2', title: `${name} audit action overdue`, severity: 'high', timestamp: '11m ago' },
  ],
  tasks: [
    { id: 't1', title: `Review ${name} SOP mapping`, status: 'doing', owner: 'Ops Lead' },
    { id: 't2', title: `Approve ${name} CAPA package`, status: 'todo', owner: 'QA Manager' },
  ],
});

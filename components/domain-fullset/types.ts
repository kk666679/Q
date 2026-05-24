export type DomainKPI = { label: string; value: string; delta: number };
export type DomainAlert = { id: string; title: string; severity: 'low'|'medium'|'high'; timestamp: string };
export type DomainTask = { id: string; title: string; status: 'todo'|'doing'|'done'; owner: string };
export interface DomainConfig { key: string; name: string; accent: string; kpis: DomainKPI[]; alerts: DomainAlert[]; tasks: DomainTask[]; }

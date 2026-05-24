export type Channel="whatsapp"|"telegram"|"discord"|"slack"|"teams"|"email"|"webhook";
export type WorkflowStatus="idle"|"running"|"paused"|"failed"|"completed";
export interface OrchestrationEvent{ id:string; source:string; type:string; severity:"low"|"medium"|"high"; at:string; payload:Record<string,unknown>; }
export interface AgentNodeState{ id:string; name:string; model:string; confidence:number; status:WorkflowStatus; }

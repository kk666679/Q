import type { AgentNodeState, OrchestrationEvent } from "./types";
export const sampleAgents: AgentNodeState[]=[{id:"planner",name:"Planner Agent",model:"gpt-5",confidence:0.92,status:"running"},{id:"reviewer",name:"Compliance Reviewer",model:"claude-opus",confidence:0.88,status:"running"}];
export const sampleEvents: OrchestrationEvent[]=[{id:"e1",source:"gmp",type:"deviation.detected",severity:"high",at:"now-2m",payload:{line:"A3"}}];

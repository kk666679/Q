import { plannerAgent } from "@/components/automation/agents/planner-agent"; export const orchestrate=(intent:string)=>({plan:plannerAgent(intent),mode:"hitl" as const});

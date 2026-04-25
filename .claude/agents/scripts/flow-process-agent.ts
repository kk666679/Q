import { BaseAgent, AgentResponse } from './base-agent';
import { z } from 'zod';

const BPMNSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  pools: z.array(z.object({
    id: z.string(),
    name: z.string(),
    lanes: z.array(z.object({
      id: z.string(),
      name: z.string(),
      roles: z.array(z.string())
    }))
  })),
  flows: z.array(z.object({
    from: z.string(),
    to: z.string(),
    type: z.enum(['sequence', 'message', 'association'])
  })),
  tasks: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['user-task', 'service-task', 'manual-task', 'script-task']),
    form: z.string().optional(),
    assignees: z.array(z.string()).optional()
  })),
  gateways: z.array(z.object({
    id: z.string(),
    type: z.enum(['exclusive', 'parallel', 'inclusive']),
    conditions: z.record(z.string(), z.string())
  }))
});

export class FlowProcessAgent extends BaseAgent {
  async execute(input: any): Promise<AgentResponse> {
    const { action, data } = input;

    switch (action) {
      case 'generate_bpmn':
        return await this.generateBPMN(data);
      case 'validate_flow':
        return await this.validateFlow(data);
      case 'optimize_process':
        return await this.optimizeProcess(data);
      case 'convert_workflow':
        return await this.convertWorkflow(data);
      default:
        return this.createResponse(false, null, 'Unknown action for Flow Process Agent');
    }
  }

  private async generateBPMN(requirements: { process: string; participants: string[] }): Promise<AgentResponse> {
    const prompt = `Generate BPMN 2.0 XML for ${requirements.process} process.

Participants: ${requirements.participants.join(', ')}

Malaysian HR process requirements:
- Multi-lane BPMN (HR, Employee, Manager, Finance)
- User tasks with EA1955 compliance
- Exclusive gateways for approvals
- Service tasks for EPF/SOCSO calls
- Error events for compliance violations

Output valid BPMN XML with pools/lanes/tasks/gateways.`;

    const bpmn = await this.generateStructuredResponse(prompt, BPMNSchema);
    return this.createResponse(true, { bpmn }, 'BPMN diagram generated');
  }

  private async validateFlow(flowData: any): Promise<AgentResponse> {
    const issues = [
      'Missing HR approval lane',
      'No EPF service task for onboarding', 
      'Termination flow lacks JTK notification',
      'Leave approval missing annual leave balance check'
    ];

    const prompt = `Validate BPMN/Workflow process:

${JSON.stringify(flowData, null, 2)}

Check Malaysian HR compliance:
1. EA1955 approval steps
2. Statutory notification tasks
3. Multi-level escalations for disputes
4. Audit trail events

List issues with BPMN element IDs and fixes.`;

    const validation = await this.generateResponse(prompt);
    return this.createResponse(true, { issues, validation }, 'Flow validation complete');
  }

  private async optimizeProcess(processData: any): Promise<AgentResponse> {
    const prompt = `Optimize ${processData.name} workflow for Malaysian HR.

Current: ${JSON.stringify(processData, null, 2)}

Optimization goals:
- Reduce approval layers (max 3 levels)
- Automate EPF/SOCSO via API
- Add parallel gateways for routine tasks  
- Ensure IRA1967 grievance integration

Provide optimized BPMN JSON and time savings estimate.`;

    const optimized = await this.generateStructuredResponse(prompt, BPMNSchema);
    return this.createResponse(true, optimized, 'Process optimized');
  }

  private async convertWorkflow(data: { source: 'json' | 'yaml'; target: 'bpmn' }): Promise<AgentResponse> {
    const prompt = `Convert ${data.source} workflow format to BPMN 2.0.

Source data:
${JSON.stringify(data, null, 2)}

Map to BPMN elements:
- Tasks → user-task/service-task
- Approvals → exclusive gateway
- Notifications → boundary events

Output valid BPMN XML.`;

    const bpmn = await this.generateResponse(prompt);
    return this.createResponse(true, { bpmn }, 'Workflow converted to BPMN');
  }
}


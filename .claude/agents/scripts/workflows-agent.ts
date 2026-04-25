import { BaseAgent, AgentResponse } from './base-agent';
import { z } from 'zod';

const WorkflowSchema = z.object({
  workflow_id: z.string(),
  name: z.string(),
  description: z.string(),
  steps: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['approval', 'task', 'notification', 'conditional', 'integration']),
    assignees: z.array(z.string()),
    duration: z.string().optional(),
    dependencies: z.array(z.string()).optional()
  })),
  triggers: z.array(z.string()),
  permissions: z.record(z.string(), z.array(z.string()))
});

const FlowSchema = z.object({
  process_id: z.string(),
  name: z.string(),
  bpmn_diagram: z.string().optional(),
  lanes: z.array(z.object({
    name: z.string(),
    roles: z.array(z.string())
  })),
  tasks: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['user-task', 'service-task', 'gateway', 'event']),
    form_fields: z.array(z.string()).optional()
  }))
});

export class WorkflowsAgent extends BaseAgent {
  async execute(input: any): Promise<AgentResponse> {
    const { action, data } = input;

    switch (action) {
      case 'create_workflow':
        return await this.createWorkflow(data);
      case 'validate_workflow':
        return await this.validateWorkflow(data);
      case 'generate_workflow':
        return await this.generateWorkflow(data);
      case 'export_workflow':
        return await this.exportWorkflow(data);
      default:
        return this.createResponse(false, null, 'Unknown action for Workflows Agent');
    }
  }

  private async createWorkflow(data: { name: string; description: string; steps: any[] }): Promise<AgentResponse> {
    const prompt = `
Create HR workflow for ${data.name}:
Description: ${data.description}
Steps: ${JSON.stringify(data.steps, null, 2)}

Ensure Malaysian compliance:
- Approval workflows per IRA 1967 for disciplinary
- Leave approval per EA 1955
- Multi-level for termination
- Audit trail required

Generate structured workflow JSON.
`;

    const workflow = await this.generateStructuredResponse(prompt, WorkflowSchema);
    return this.createResponse(true, workflow, 'Workflow created successfully');
  }

  private async validateWorkflow(workflowData: any): Promise<AgentResponse> {
    const prompt = `
Validate HR workflow compliance:

${JSON.stringify(workflowData, null, 2)}

Check against Malaysian HR laws:
1. Employment Act 1955 (leave, termination workflows)
2. IRA 1967 (grievance, disciplinary procedures)
3. EPF/SOCSO approval flows
4. Multi-level approvals for high-risk processes

List compliance issues and fixes.
`;

    const validation = await this.generateResponse(prompt);
    return this.createResponse(true, { validation }, 'Workflow validation complete');
  }

  private async generateWorkflow(requirements: { process: string; department: string }): Promise<AgentResponse> {
    const templates = {
      'leave-approval': {
        name: 'Leave Approval Workflow',
        steps: [
          { id: 'submit', name: 'Employee Submit', type: 'task', assignees: ['employee'] },
          { id: 'supervisor', name: 'Supervisor Review', type: 'approval', assignees: ['supervisor'] },
          { id: 'hr', name: 'HR Verification', type: 'approval', assignees: ['hr'] }
        ]
      },
      'onboarding': {
        name: 'Employee Onboarding',
        steps: [
          { id: 'offer', name: 'Offer Letter', type: 'task', assignees: ['hr'] },
          { id: 'documents', name: 'Document Collection', type: 'task', assignees: ['new-hire'] },
          { id: 'it-setup', name: 'IT Setup', type: 'task', assignees: ['it'] }
        ]
      }
    };

    const prompt = `Generate ${requirements.department} workflow for ${requirements.process}.

Use Malaysian HR best practices:
- EA 1955 leave entitlements
- EPF registration within 7 days
- Contract signing before start date

Structure as WorkflowSchema JSON.`;

    const workflow = await this.generateStructuredResponse(prompt, WorkflowSchema);
    return this.createResponse(true, workflow, 'Workflow generated');
  }

  private async exportWorkflow(data: { workflow_id: string; format: 'json' | 'bpmn' | 'pdf' }): Promise<AgentResponse> {
    // Simulate BPMN/export generation
    const exports = {
      json: JSON.stringify({ workflow_id: data.workflow_id }, null, 2),
      bpmn: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions ...>Workflow export</bpmn:definitions>`,
      pdf: 'PDF export ready - 12 pages with workflow diagram and compliance notes'
    };

    return this.createResponse(true, { export: exports[data.format] }, 'Workflow exported');
  }
}


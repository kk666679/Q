import AiWorkflowChat from '@/components/automation/copilot/ai-workflow-chat';
import WorkflowIntentParser from '@/components/automation/copilot/workflow-intent-parser';
import EventStreamViewer from '@/components/automation/events/event-stream-viewer';
import ComplianceEngine from '@/components/automation/governance/compliance-engine';
import SwarmDashboard from '@/components/automation/swarm/swarm-dashboard';
import ApprovalCenter from '@/components/automation/hitl/approval-center';

export default function AAOSPage() {
  return (
    <main className="container mx-auto space-y-6 px-6 py-8">
      <header>
        <h1 className="text-3xl font-bold">AAOS Frontend Integration</h1>
        <p className="text-muted-foreground">Integrated automation copilot, governance, events, swarm, and HITL modules.</p>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        <AiWorkflowChat />
        <WorkflowIntentParser />
        <EventStreamViewer />
        <ComplianceEngine />
        <SwarmDashboard />
        <ApprovalCenter />
      </div>
    </main>
  );
}

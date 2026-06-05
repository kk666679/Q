'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { WorkflowCanvas } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingWorkflowCanvasPage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="Workflow Canvas"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <WorkflowCanvas />
        </div>
      </main>
    </AppShell>
  )
}


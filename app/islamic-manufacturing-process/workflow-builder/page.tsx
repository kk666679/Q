'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { WorkflowBuilder } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingWorkflowBuilderPage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="Workflow Builder"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <WorkflowBuilder />
        </div>
      </main>
    </AppShell>
  )
}


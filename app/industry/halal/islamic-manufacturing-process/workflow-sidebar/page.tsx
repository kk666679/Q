'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { WorkflowSidebar } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingWorkflowSidebarPage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="Workflow Sidebar"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <WorkflowSidebar />
        </div>
      </main>
    </AppShell>
  )
}


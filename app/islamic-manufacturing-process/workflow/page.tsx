'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { WorkflowBuilder, WorkflowCanvas, WorkflowSidebar } from '@/components/islamic-manufacturing-process'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function IslamicManufacturingWorkflowPage() {
  return (
    <AppShell title="Islamic Manufacturing Process" description="Workflows">
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card><CardHeader><CardTitle className="text-sm">Workflow Builder</CardTitle></CardHeader><CardContent><WorkflowBuilder /></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Workflow Canvas</CardTitle></CardHeader><CardContent><WorkflowCanvas /></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Workflow Sidebar</CardTitle></CardHeader><CardContent><WorkflowSidebar /></CardContent></Card>
          </div>
        </div>
      </main>
    </AppShell>
  )
}


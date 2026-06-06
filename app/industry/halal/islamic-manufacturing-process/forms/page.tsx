'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { CreateForm, EditForm, ApprovalForm } from '@/components/islamic-manufacturing-process'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function IslamicManufacturingFormsPage() {
  return (
    <AppShell title="Islamic Manufacturing Process" description="Forms">
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card><CardHeader><CardTitle className="text-sm">Create Form</CardTitle></CardHeader><CardContent><CreateForm /></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Edit Form</CardTitle></CardHeader><CardContent><EditForm /></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Approval Form</CardTitle></CardHeader><CardContent><ApprovalForm /></CardContent></Card>
          </div>
        </div>
      </main>
    </AppShell>
  )
}


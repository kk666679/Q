'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { ApprovalForm } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingApprovalFormPage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="Approval Form"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <ApprovalForm />
        </div>
      </main>
    </AppShell>
  )
}


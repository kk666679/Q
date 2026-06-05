'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { ComplianceMonitor } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingCompliancePage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="Compliance Monitor"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <ComplianceMonitor />
        </div>
      </main>
    </AppShell>
  )
}


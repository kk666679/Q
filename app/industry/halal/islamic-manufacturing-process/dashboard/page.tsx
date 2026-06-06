'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { Dashboard } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingDashboardPage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="Dashboard"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Dashboard />
        </div>
      </main>
    </AppShell>
  )
}


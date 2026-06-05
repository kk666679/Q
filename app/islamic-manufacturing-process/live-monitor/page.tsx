'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { LiveMonitor } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingLiveMonitorPage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="Live Monitor"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <LiveMonitor />
        </div>
      </main>
    </AppShell>
  )
}


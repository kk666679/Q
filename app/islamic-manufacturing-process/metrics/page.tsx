'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { Metrics } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingMetricsPage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="Metrics"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Metrics />
        </div>
      </main>
    </AppShell>
  )
}


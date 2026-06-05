'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { Overview } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingOverviewPage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="Overview"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Overview />
        </div>
      </main>
    </AppShell>
  )
}


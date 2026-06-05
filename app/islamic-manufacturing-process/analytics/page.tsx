'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { Analytics } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingAnalyticsPage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="Analytics"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Analytics />
        </div>
      </main>
    </AppShell>
  )
}


'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { Timeline } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingTimelinePage() {
  return (
    <AppShell title="Islamic Manufacturing Process" description="Timeline">
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Timeline />
        </div>
      </main>
    </AppShell>
  )
}


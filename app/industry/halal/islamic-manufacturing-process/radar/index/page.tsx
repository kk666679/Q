'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { Radar } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingRadarIndexPage() {
  return (
    <AppShell title="Islamic Manufacturing Process" description="Radar">
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Radar />
        </div>
      </main>
    </AppShell>
  )
}


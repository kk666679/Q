'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { Checklist } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingChecklistPage() {
  return (
    <AppShell title="Islamic Manufacturing Process" description="Checklist">
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Checklist />
        </div>
      </main>
    </AppShell>
  )
}


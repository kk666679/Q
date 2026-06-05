'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { AlertCenter } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingAlertCenterPage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="Alert Center"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <AlertCenter />
        </div>
      </main>
    </AppShell>
  )
}


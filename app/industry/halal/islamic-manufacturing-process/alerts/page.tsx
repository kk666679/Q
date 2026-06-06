'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { AlertCenter, Notifications } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingAlertsPage() {
  return (
    <AppShell title="Islamic Manufacturing Process" description="Alerts & Notifications">
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <AlertCenter />
          <Notifications />
        </div>
      </main>
    </AppShell>
  )
}


'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { Notifications } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingNotificationsPage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="Notifications"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Notifications />
        </div>
      </main>
    </AppShell>
  )
}


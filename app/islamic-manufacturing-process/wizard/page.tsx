'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { Wizard } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingWizardPage() {
  return (
    <AppShell title="Islamic Manufacturing Process" description="Wizard">
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Wizard />
        </div>
      </main>
    </AppShell>
  )
}


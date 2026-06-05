'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { RiskMatrix } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingRiskMatrixPage() {
  return (
    <AppShell title="Islamic Manufacturing Process" description="Risk Matrix">
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <RiskMatrix />
        </div>
      </main>
    </AppShell>
  )
}


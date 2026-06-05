'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { AiRiskEngine } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingAiRiskEnginePage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="AI Risk Engine"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <AiRiskEngine />
        </div>
      </main>
    </AppShell>
  )
}


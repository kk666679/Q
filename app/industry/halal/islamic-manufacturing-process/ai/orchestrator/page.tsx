'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { AiOrchestrator } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingAiOrchestratorPage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="AI Orchestrator"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <AiOrchestrator />
        </div>
      </main>
    </AppShell>
  )
}


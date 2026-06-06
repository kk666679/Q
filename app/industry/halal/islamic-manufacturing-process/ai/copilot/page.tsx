'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { AiCopilot } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingAiCopilotPage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="AI Copilot"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <AiCopilot />
        </div>
      </main>
    </AppShell>
  )
}


'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { AiAgentPanel } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingAiAgentPanelPage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="AI Agent Panel"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <AiAgentPanel />
        </div>
      </main>
    </AppShell>
  )
}


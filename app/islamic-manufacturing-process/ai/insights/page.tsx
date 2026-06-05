'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { AiInsights } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingAiInsightsPage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="AI Insights"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <AiInsights />
        </div>
      </main>
    </AppShell>
  )
}


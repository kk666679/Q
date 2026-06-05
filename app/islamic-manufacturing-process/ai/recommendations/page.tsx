'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { AiRecommendations } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingAiRecommendationsPage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="AI Recommendations"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <AiRecommendations />
        </div>
      </main>
    </AppShell>
  )
}


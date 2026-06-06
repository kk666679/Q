'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import {
  AiAgentPanel,
  AiCopilot,
  AiInsights,
  AiOrchestrator,
  AiRecommendations,
  AiRiskEngine,
} from '@/components/islamic-manufacturing-process'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function IslamicManufacturingAIPage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="AI"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">AI Copilot</CardTitle>
              </CardHeader>
              <CardContent>
                <AiCopilot />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <AiInsights />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <AiRecommendations />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">AI Agent Panel</CardTitle>
              </CardHeader>
              <CardContent>
                <AiAgentPanel />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">AI Risk Engine</CardTitle>
              </CardHeader>
              <CardContent>
                <AiRiskEngine />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">AI Orchestrator</CardTitle>
              </CardHeader>
              <CardContent>
                <AiOrchestrator />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </AppShell>
  )
}


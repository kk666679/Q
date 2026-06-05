'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { Charts, Heatmap, RiskMatrix, Sankey, Radar } from '@/components/islamic-manufacturing-process'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function IslamicManufacturingChartsPage() {
  return (
    <AppShell title="Islamic Manufacturing Process" description="Analytics Charts">
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card><CardHeader><CardTitle className="text-sm">Charts</CardTitle></CardHeader><CardContent><Charts /></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Heatmap</CardTitle></CardHeader><CardContent><Heatmap /></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Risk Matrix</CardTitle></CardHeader><CardContent><RiskMatrix /></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Sankey</CardTitle></CardHeader><CardContent><Sankey /></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Radar</CardTitle></CardHeader><CardContent><Radar /></CardContent></Card>
          </div>
        </div>
      </main>
    </AppShell>
  )
}


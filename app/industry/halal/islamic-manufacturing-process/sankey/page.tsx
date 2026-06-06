'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { Sankey } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingSankeyPage() {
  return (
    <AppShell title="Islamic Manufacturing Process" description="Sankey">
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Sankey />
        </div>
      </main>
    </AppShell>
  )
}


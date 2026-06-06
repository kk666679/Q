'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { AppHeader } from '@/components/sidebar/app-header'
import { Overview } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingProcessLandingPage() {
  return (
    <AppShell title="Islamic Manufacturing Process" description="JAKIM halal integrity workflows, analytics, compliance and AI monitoring">
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Overview />
        </div>
      </main>
    </AppShell>
  )
}


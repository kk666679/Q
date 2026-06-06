'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { CreateForm } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingCreateFormPage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="Create Form"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <CreateForm />
        </div>
      </main>
    </AppShell>
  )
}


'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { EditForm } from '@/components/islamic-manufacturing-process'

export default function IslamicManufacturingEditFormPage() {
  return (
    <AppShell
      title="Islamic Manufacturing Process"
      description="Edit Form"
    >
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <EditForm />
        </div>
      </main>
    </AppShell>
  )
}


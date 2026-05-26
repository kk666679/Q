'use client'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { AppHeader } from '@/components/sidebar/app-header'
import { MalaysianStandardsBrowser } from '@/components/my-standards/malaysian-standards-browser'

export default function StandardsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader 
          title="Malaysian Standards" 
          description="Browse and manage Malaysian Standards for ISO compliance" 
        />
        <main className="flex-1 overflow-hidden">
          <MalaysianStandardsBrowser />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

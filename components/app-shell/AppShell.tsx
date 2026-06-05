'use client'

import * as React from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { AppHeader } from '@/components/sidebar/app-header'

type AppShellProps = {
  title?: string
  description?: string
  children: React.ReactNode
}

export function AppShell({ title, description, children }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={title ?? 'QMS Platform'} description={description} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}


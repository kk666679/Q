'use client'

import { ShieldCheck } from 'lucide-react'
import { SidebarHeader } from '@/components/ui/sidebar'

interface SidebarHeaderProps {
  title?: string
  subtitle?: string
}

export function AppSidebarHeader({ 
  title = 'QMS Generator', 
  subtitle = 'ISO 9001' 
}: SidebarHeaderProps) {
  return (
    <SidebarHeader className="border-b border-sidebar-border">
      <div className="flex items-center gap-2 px-2 py-1">
        <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          <ShieldCheck className="size-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{title}</span>
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        </div>
      </div>
    </SidebarHeader>
  )
}


'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { ChevronDown } from 'lucide-react'

export interface SidebarUserProps {
  name: string
  email: string
  avatarUrl?: string
  initials: string
  children: React.ReactNode
}

export function SidebarUser({ name, email, avatarUrl, initials, children }: SidebarUserProps) {
  return (
    <SidebarMenuButton className="w-full justify-start gap-3 px-3 py-6">
      <Avatar className="size-9">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col items-start gap-0.5 overflow-hidden">
        <span className="truncate text-sm font-medium">{name}</span>
        <span className="truncate text-xs text-muted-foreground">{email}</span>
      </div>
      <ChevronDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
    </SidebarMenuButton>
  )
}


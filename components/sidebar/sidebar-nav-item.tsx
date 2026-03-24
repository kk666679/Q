'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { LucideIcon } from 'lucide-react'

export interface SidebarNavItemProps {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
}

export function SidebarNavItem({ title, url, icon: Icon, isActive }: SidebarNavItemProps) {
  const pathname = usePathname()
  
  // Determine if this item is active
  const isItemActive = isActive ?? (url === '/' 
    ? pathname === '/' 
    : pathname.startsWith(url))

  return (
    <SidebarMenuButton
      asChild
      isActive={isItemActive}
    >
      <Link href={url}>
        <Icon />
        <span>{title}</span>
      </Link>
    </SidebarMenuButton>
  )
}


'use client'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { SidebarNavItem, SidebarNavItemProps } from './sidebar-nav-item'
import { LucideIcon } from 'lucide-react'

export interface SidebarNavSection {
  title: string
  items: SidebarNavItemProps[]
}

interface SidebarNavProps {
  sections: SidebarNavSection[]
}

export function SidebarNav({ sections }: SidebarNavProps) {
  return (
    <>
      {sections.map((section, index) => (
        <div key={section.title}>
          {index > 0 && <SidebarSeparator />}
          <SidebarGroup>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarNavItem {...item} />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      ))}
    </>
  )
}


'use client'

import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  GitBranch,
  ShieldCheck,
  Bot,
  Settings,
  HelpCircle,
  Wand2,
  Factory,
  Building2,
  Shield,
  Workflow,
  AlertTriangle,
  Scale,
  CloudRain,
  ClipboardList,
  ListChecks,
  Search,
  BarChart3,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Home,
} from 'lucide-react'

import {
  Sidebar as UISidebar,
  SidebarContent,
} from '@/components/ui/sidebar'
import { AppSidebarHeader } from './sidebar-header'
import { SidebarFooterComponent } from './sidebar-footer'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

// Define navigation structure with domain grouping
const mainNavSections = [
  {
    title: 'Home',
    items: [
      { title: 'Landing', url: '/landing', icon: Home },
      { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Standards',
    items: [
      { title: 'Malaysian Standards', url: '/standards', icon: BookOpen },
    ],
  },
  {
    title: 'Automation',
    items: [
      { title: 'Flow Process', url: '/flow-process', icon: Workflow },
      { title: 'Flow Process (Enhanced)', url: '/flow-process/enhanced', icon: Workflow },
    ],
  },
  {
    title: 'QMS Tools',
    items: [
      { title: 'QMS Generator', url: '/generator', icon: Wand2 },
      { title: 'Risk Assessment', url: '/iso/risk/assess', icon: AlertTriangle },
      { title: 'Risk Matrix', url: '/iso/risk/matrix', icon: Scale },
      { title: 'Climate Risk', url: '/iso/risk/climate', icon: CloudRain },
    ],
  },
]

// ISO Management with collapsible subgroups
const isoNavSections = [
  {
    title: 'Audit',
    items: [
      { title: 'Generate Audit', url: '/iso/audit/generate', icon: FileText },
      { title: 'Create Plan', url: '/iso/audit/createPlan', icon: ClipboardList },
    ],
  },
  {
    title: 'CAPA',
    items: [
      { title: 'Create CAPA', url: '/iso/capa/create', icon: ListChecks },
      { title: 'Fishbone Analysis', url: '/iso/capa/fishbone', icon: Search },
      { title: 'Five Whys', url: '/iso/capa/fiveWhys', icon: Search },
    ],
  },
  {
    title: 'Compliance',
    items: [
      { title: 'Compliance Check', url: '/iso/compliance/check', icon: ShieldCheck },
      { title: 'Gap Analysis', url: '/iso/compliance/gapAnalysis', icon: Search },
      { title: 'Compliance Score', url: '/iso/compliance/score', icon: BarChart3 },
    ],
  },
]

const operationsNavSections = [
  {
    title: 'Operations',
    items: [
      { title: 'Processes', url: '/processes', icon: GitBranch },
      { title: 'Projects', url: '/projects', icon: FolderKanban },
      { title: 'Documents', url: '/documents', icon: FileText },
    ],
  },
]

const industryNavSections = [
  {
    title: 'Industries',
    items: [
      { title: 'Manufacturing', url: '/manufacturing', icon: Factory },
      { title: 'Construction', url: '/construction', icon: Building2 },
      { title: 'Insurance', url: '/insurance', icon: Shield },
    ],
  },
]

const teamNavSections = [
  {
    title: 'Team',
    items: [
      { title: 'Agents', url: '/agents', icon: Bot },
    ],
  },
]

const supportNavSections = [
  {
    title: 'Support',
    items: [
      { title: 'Settings', url: '/settings', icon: Settings },
      { title: 'Help', url: '/help', icon: HelpCircle },
    ],
  },
]

// NavItem component for inline navigation
interface NavItemProps {
  title: string
  url: string
  icon: React.ElementType
}

function NavItem({ title, url, icon: Icon }: NavItemProps) {
  const pathname = usePathname()
  const isActive = url === '/' 
    ? pathname === '/' 
    : pathname.startsWith(url)

  return (
    <SidebarMenuButton asChild isActive={isActive}>
      <Link href={url}>
        <Icon />
        <span>{title}</span>
      </Link>
    </SidebarMenuButton>
  )
}

// CollapsibleGroup component for ISO subgroups
interface CollapsibleGroupProps {
  title: string
  items: NavItemProps[]
  defaultOpen?: boolean
}

function CollapsibleGroup({ title, items, defaultOpen = false }: CollapsibleGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
      <SidebarGroup className="py-0">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="w-full justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
            {isOpen ? (
              <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            ) : (
              <ChevronRight className="size-4 transition-transform group-data-[state=closed]/collapsible:rotate-0" />
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <NavItem {...item} />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}

// StandardNavSection component
interface StandardNavSectionProps {
  title: string
  items: NavItemProps[]
}

function StandardNavSection({ title, items }: StandardNavSectionProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavItem {...item} />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export interface SidebarProps {
  userData?: {
    name?: string
    email?: string
    avatarUrl?: string
    initials?: string
    subscription?: 'Free' | 'Pro' | 'Enterprise'
    credits?: number
    creditLimit?: number
    cardLast4?: string
    cardBrand?: string
  }
}

export function Sidebar({ userData }: SidebarProps) {
  return (
    <UISidebar>
      <AppSidebarHeader />
      
      <SidebarContent>
        {/* Main sections - Dashboard, Automation, QMS Tools */}
        {mainNavSections.map((section) => (
          <StandardNavSection key={section.title} title={section.title} items={section.items} />
        ))}

        {/* ISO Management - Collapsible subgroups */}
        <SidebarGroup>
          <SidebarGroupLabel>ISO Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isoNavSections.map((section) => (
                <SidebarMenuItem key={section.title}>
                  <CollapsibleGroup title={section.title} items={section.items} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Operations */}
        {operationsNavSections.map((section) => (
          <StandardNavSection key={section.title} title={section.title} items={section.items} />
        ))}

        {/* Industries */}
        {industryNavSections.map((section) => (
          <StandardNavSection key={section.title} title={section.title} items={section.items} />
        ))}

        {/* Team */}
        {teamNavSections.map((section) => (
          <StandardNavSection key={section.title} title={section.title} items={section.items} />
        ))}

        {/* Support */}
        {supportNavSections.map((section) => (
          <StandardNavSection key={section.title} title={section.title} items={section.items} />
        ))}
      </SidebarContent>

      <SidebarFooterComponent userData={userData} />
    </UISidebar>
  )
}

export type { SidebarNavSection } from './sidebar-nav'
export type { SidebarNavItemProps } from './sidebar-nav-item'
export type { SidebarSubscriptionProps, SubscriptionPlan } from './sidebar-subscription'
export type { SidebarBillingProps } from './sidebar-billing'
export { AppSidebarHeader } from './sidebar-header'
export { SidebarFooterComponent } from './sidebar-footer'
export type { SidebarUserData } from './sidebar-footer'


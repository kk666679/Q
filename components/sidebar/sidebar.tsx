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
  Cpu,
  Leaf,
  HeartPulse,
  Landmark,
  Flag,
  Zap,
  Settings2,
  Layers,
  Brain,
  Link2,
  BarChart2,
  Database,
  BookMarked,
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
    title: 'Quick Access',
    items: [
      { title: 'AI Components', url: '/ai-components', icon: Brain },
      { title: 'Compliance RAG', url: '/compliance/rag', icon: Database },
    ],
  },
]

// Automation subsections
const automationNavSections = [
  {
    title: 'Automation Modules',
    items: [
      { title: 'AAOS', url: '/automation/aaos', icon: Zap },
      { title: 'Administration', url: '/automation/administration', icon: Settings2 },
      { title: 'Analytics', url: '/automation/analytics', icon: BarChart2 },
      { title: 'Catalog', url: '/automation/catalog', icon: BookMarked },
      { title: 'Collaboration', url: '/automation/collaboration', icon: Link2 },
      { title: 'Data Locker', url: '/automation/datalocker', icon: Database },
      { title: 'Designer', url: '/automation/designer', icon: Wand2 },
      { title: 'Governance', url: '/automation/governance', icon: ShieldCheck },
      { title: 'Integrations', url: '/automation/integrations', icon: Link2 },
      { title: 'Marketplace', url: '/automation/marketplace', icon: FolderKanban },
      { title: 'MLOps Models', url: '/automation/models', icon: Brain },
      { title: 'Operations Center', url: '/automation/operations', icon: Settings },
      { title: 'Templates', url: '/automation/templates', icon: Layers },
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
      { title: 'Manufacturing', url: '/industry/manufacturing', icon: Factory },
      { title: 'Electronics & Semiconductor', url: '/industry/electronics', icon: Cpu },
      { title: 'Medical Devices', url: '/industry/medical', icon: HeartPulse },
      { title: 'Agro-processing & Halal', url: '/industry/halal', icon: Leaf },
      { title: 'Financial Services', url: '/industry/financial', icon: Landmark },
      { title: 'Construction', url: '/industry/construction', icon: Building2 },
      { title: 'Insurance', url: '/industry/insurance', icon: Shield },
    ],
  },
  {
    title: 'Malaysia Automation',
    items: [
      { title: 'MY Regulatory Hub', url: '/automation/malaysia', icon: Flag },
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
        {/* Main sections - Dashboard, Standards, Quick Access */}
        {mainNavSections.map((section) => (
          <StandardNavSection key={section.title} title={section.title} items={section.items} />
        ))}

        {/* Automation Modules - Collapsible */}
        <SidebarGroup>
          <SidebarGroupLabel>Automation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {automationNavSections.map((section) => (
                <SidebarMenuItem key={section.title}>
                  <CollapsibleGroup title={section.title} items={section.items} defaultOpen={false} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

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

      {/* Compact CTA block above footer for quick access */}
      <div className="px-4 py-3">
        <div className="flex flex-col gap-2">
          <Link href="/generator" className="text-sm font-semibold rounded-md bg-cyan-600 text-white px-3 py-2 text-center">Get Started</Link>
          <div className="flex gap-2">
            <Link href="/docs" className="flex-1 text-sm rounded-md border border-border px-3 py-2 text-center">Docs</Link>
            <Link href="/projects" className="flex-1 text-sm rounded-md bg-secondary px-3 py-2 text-center">Projects</Link>
          </div>
        </div>
      </div>

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


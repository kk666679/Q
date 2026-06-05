'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { cn } from '@/lib/utils';

const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  agents: 'AI Agents',
  documents: 'Documents',
  processes: 'Processes',
  projects: 'Projects',
  compliance: 'Compliance',
  standards: 'Malaysian Standards',
  generator: 'QMS Generator',
  iso: 'ISO Management',
  audit: 'Audit',
  generate: 'Generate Checklist',
  createPlan: 'Create Plan',
  capa: 'CAPA',
  create: 'Create CAPA',
  fishbone: 'Fishbone Analysis',
  fiveWhys: 'Five Whys',
  risk: 'Risk',
  assess: 'Risk Assessment',
  climate: 'Climate Risk',
  matrix: 'Risk Matrix',
  rag: 'RAG Search',
  'flow-process': 'Flow Designer',
  enhanced: 'Enhanced Designer',
  industry: 'Industries',
  manufacturing: 'Manufacturing',
  construction: 'Construction',
  insurance: 'Insurance',
  electronics: 'Electronics',
  medical: 'Medical Devices',
  halal: 'Halal',
  financial: 'Financial',
  automation: 'Automation',
  aaos: 'AAOS',
  administration: 'Administration',
  analytics: 'Analytics',
  catalog: 'Catalog',
  collaboration: 'Collaboration',
  datalocker: 'Data Locker',
  designer: 'Designer',
  governance: 'Governance',
  integrations: 'Integrations',
  marketplace: 'Marketplace',
  models: 'Models',
  operations: 'Operations',
  templates: 'Templates',
  malaysia: 'Malaysia Regulatory',
  'ai-components': 'AI Components',
  gapAnalysis: 'Gap Analysis',
  check: 'Compliance Check',
  score: 'Compliance Score',
};

function getLabel(segment: string): string {
  return ROUTE_LABELS[segment] ?? segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => ({
    label: getLabel(seg),
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }));

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1 px-6 py-2 text-xs text-muted-foreground border-b border-border/50 bg-muted/20"
    >
      <Link href="/" className="flex items-center hover:text-foreground transition-colors" aria-label="Home">
        <Home className="size-3" />
      </Link>
      {crumbs.map((crumb) => (
        <Fragment key={crumb.href}>
          <ChevronRight className="size-3 opacity-40" />
          {crumb.isLast ? (
            <span className="text-foreground font-medium truncate max-w-[200px]" aria-current="page">
              {crumb.label}
            </span>
          ) : (
            <Link href={crumb.href} className="hover:text-foreground transition-colors truncate max-w-[160px]">
              {crumb.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}

interface PageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Skip the default max-w-7xl p-6 wrapper — for full-bleed / custom pages */
  fullBleed?: boolean;
  className?: string;
}

/**
 * Shared page layout used by every inner app page.
 * Provides: Sidebar + AppHeader + Breadcrumb + responsive content container.
 */
export function PageLayout({ title, description, children, fullBleed = false, className }: PageLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={title} description={description} />
        <Breadcrumbs />
        <main className={cn('flex-1 overflow-auto', !fullBleed && 'p-6', className)}>
          {fullBleed ? (
            children
          ) : (
            <div className="mx-auto max-w-7xl space-y-6">{children}</div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

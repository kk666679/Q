'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { Dashboard as StandardsDashboard } from '@/components/my-standards';
import { PageLayout } from '@/components/layout/page-layout';
import { MalaysianStandardsBrowser } from '@/components/my-standards/malaysian-standards-browser';

export default function MyStandardsHomePage() {
  return (
    <PageLayout
      title="MY Standards"
      description="Enterprise Malaysian Regulatory Workflow Platform — Standards"
      fullBleed
    >
      <MalaysianStandardsBrowser />
      <StandardsDashboard />
    </PageLayout>
  );
}

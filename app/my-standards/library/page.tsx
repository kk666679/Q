'use client';

import { PageLayout } from '@/components/layout/page-layout';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { Dashboard as StandardsDashboard } from '@/components/my-standards';

export default function MyStandardsLibraryPage() {
  return (
    <PageLayout
      title="MY Standards · Library"
      description="Browse standards in the registry-backed catalog."
      fullBleed
    >
      <StandardsDashboard />
    </PageLayout>
  );
}


'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { ComplianceCheck } from '@/components/iso';

export default function ComplianceCheckPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Compliance Check" description="Check compliance against ISO standards clause by clause" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-4xl">
            <ComplianceCheck />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

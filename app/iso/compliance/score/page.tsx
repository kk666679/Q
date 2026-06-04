'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { ComplianceScore } from '@/components/iso';

export default function ComplianceScorePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Compliance Scoring" description="Calculate and track compliance scores for ISO standards" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-4xl">
            <ComplianceScore />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

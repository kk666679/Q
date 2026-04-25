'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { RiskMatrixView } from '@/components/iso';

export default function RiskMatrixPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader 
          title="Risk Matrix" 
          description="Interactive 5x5 risk matrix for visualizing and managing risks" 
        />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl">
            <RiskMatrixView />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

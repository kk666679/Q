'use client';

import { ExternalLink, Building2 } from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PortalConfig } from './portal-config';

interface PortalShellProps {
  config: PortalConfig;
  children: React.ReactNode;
}

export function PortalShell({ config, children }: PortalShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={config.label} description={config.description} />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Portal identity bar */}
            <div className={`rounded-xl bg-gradient-to-r ${config.accent} p-4 text-white`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6" />
                  <div>
                    <p className="font-semibold text-lg">{config.label} Portal</p>
                    <p className="text-sm opacity-80">{config.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {config.standards.map((s) => (
                    <Badge key={s} variant="secondary" className="bg-white/20 text-white border-white/30">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
              {/* Grant links */}
              <div className="mt-3 flex flex-wrap gap-2">
                {config.grantInfo.map((g) => (
                  <Button
                    key={g.name}
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 bg-white/10 text-white hover:bg-white/20 text-xs"
                    onClick={() => window.open(g.url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                    {g.name}
                  </Button>
                ))}
              </div>
            </div>
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

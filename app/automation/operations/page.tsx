'use client';
import * as React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Clock, AlertTriangle, RotateCw, Zap } from 'lucide-react';
import type { WorkflowExecution } from '@/components/automation/shared/types';

const EXECUTIONS: WorkflowExecution[] = [
  { id:'ex1', workflowId:'etl-orders',      status:'completed', startedAt:'2025-05-24 08:00', completedAt:'2025-05-24 08:04', duration:240 },
  { id:'ex2', workflowId:'hr-compliance',   status:'running',   startedAt:'2025-05-24 08:15' },
  { id:'ex3', workflowId:'lhdn-einvoice',   status:'failed',    startedAt:'2025-05-24 07:55', completedAt:'2025-05-24 07:56', duration:62, error:'API timeout on LHDN endpoint' },
  { id:'ex4', workflowId:'churn-prediction',status:'completed', startedAt:'2025-05-24 06:00', completedAt:'2025-05-24 06:12', duration:720 },
  { id:'ex5', workflowId:'esg-reporting',   status:'scheduled', startedAt:'2025-05-25 00:00' },
];

const STATUS_COLOR: Record<string,string> = {
  completed:'bg-emerald-500/10 text-emerald-700', running:'bg-blue-500/10 text-blue-700 animate-pulse',
  failed:'bg-red-500/10 text-red-700', scheduled:'bg-amber-500/10 text-amber-700', cancelled:'bg-muted text-muted-foreground',
};

const ALERTS = [
  { id:'a1', level:'high',   workflow:'lhdn-einvoice',   message:'API timeout — 3 retries exhausted',     at:'08:15' },
  { id:'a2', level:'medium', workflow:'hr-compliance',   message:'Row count anomaly detected in epf data', at:'08:10' },
  { id:'a3', level:'low',    workflow:'esg-reporting',   message:'Scheduled run delayed by 5 minutes',     at:'07:58' },
];

const ALERT_COLOR: Record<string,string> = {
  high:'bg-red-500/10 text-red-700 border-red-200', medium:'bg-amber-500/10 text-amber-700 border-amber-200', low:'bg-blue-500/10 text-blue-700 border-blue-200',
};

export default function OperationsPage() {
  const stats = {
    running:   EXECUTIONS.filter(e=>e.status==='running').length,
    failed:    EXECUTIONS.filter(e=>e.status==='failed').length,
    completed: EXECUTIONS.filter(e=>e.status==='completed').length,
    scheduled: EXECUTIONS.filter(e=>e.status==='scheduled').length,
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Operations Center" description="Execution monitor · SLA dashboard · Retry · Alerts · Incidents" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl space-y-4">

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label:'Running',   value:stats.running,   color:'text-blue-600' },
                { label:'Completed', value:stats.completed, color:'text-emerald-600' },
                { label:'Failed',    value:stats.failed,    color:'text-red-600' },
                { label:'Scheduled', value:stats.scheduled, color:'text-amber-600' },
              ].map(s=>(
                <Card key={s.label}>
                  <CardContent className="pt-4 pb-3">
                    <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="monitor">
              <TabsList className="h-8">
                <TabsTrigger value="monitor" className="text-xs gap-1"><Activity className="h-3 w-3"/>Monitor</TabsTrigger>
                <TabsTrigger value="alerts"  className="text-xs gap-1"><AlertTriangle className="h-3 w-3"/>Alerts</TabsTrigger>
                <TabsTrigger value="retry"   className="text-xs gap-1"><RotateCw className="h-3 w-3"/>Retry Center</TabsTrigger>
                <TabsTrigger value="sla"     className="text-xs gap-1"><Clock className="h-3 w-3"/>SLA</TabsTrigger>
              </TabsList>

              <TabsContent value="monitor" className="mt-4">
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/40 border-b">
                      <tr>{['Workflow','Status','Started','Duration','Error',''].map(h=>(
                        <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {EXECUTIONS.map(e=>(
                        <tr key={e.id} className="border-b hover:bg-muted/20">
                          <td className="px-3 py-2 font-mono font-medium">{e.workflowId}</td>
                          <td className="px-3 py-2"><Badge className={`text-[10px] ${STATUS_COLOR[e.status]}`}>{e.status}</Badge></td>
                          <td className="px-3 py-2 text-muted-foreground">{e.startedAt}</td>
                          <td className="px-3 py-2 text-muted-foreground">{e.duration ? `${e.duration}s` : '—'}</td>
                          <td className="px-3 py-2 text-red-600 max-w-[200px] truncate">{e.error || '—'}</td>
                          <td className="px-3 py-2">
                            {e.status==='failed' && <Button size="sm" variant="ghost" className="h-6 text-[10px] gap-1"><RotateCw className="h-3 w-3"/>Retry</Button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="mt-4 space-y-2">
                {ALERTS.map(a=>(
                  <Card key={a.id} className={`border ${ALERT_COLOR[a.level]}`}>
                    <CardContent className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold">{a.workflow}</p>
                          <p className="text-xs">{a.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-muted-foreground">{a.at}</span>
                        <Button size="sm" variant="ghost" className="h-6 text-[10px]">Resolve</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="retry" className="mt-4">
                <Card>
                  <CardHeader><CardTitle className="text-sm">Retry Center</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {EXECUTIONS.filter(e=>e.status==='failed').map(e=>(
                      <div key={e.id} className="flex items-center justify-between rounded border p-3">
                        <div>
                          <p className="text-xs font-mono font-semibold">{e.workflowId}</p>
                          <p className="text-[11px] text-red-600">{e.error}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <Button size="sm" className="h-6 text-[10px] gap-1"><RotateCw className="h-3 w-3"/>Retry Now</Button>
                          <Button size="sm" variant="outline" className="h-6 text-[10px]">Skip</Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sla" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {EXECUTIONS.filter(e=>e.duration).map(e=>(
                    <Card key={e.id}>
                      <CardContent className="py-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-mono font-semibold">{e.workflowId}</p>
                          <p className="text-[11px] text-muted-foreground">Duration: {e.duration}s</p>
                        </div>
                        <Badge className={e.duration! < 300 ? 'bg-emerald-500/10 text-emerald-700 text-[10px]' : 'bg-amber-500/10 text-amber-700 text-[10px]'}>
                          {e.duration! < 300 ? 'Within SLA' : 'SLA Warning'}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

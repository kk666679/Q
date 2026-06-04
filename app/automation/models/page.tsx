'use client';
import * as React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BrainCircuit, FlaskConical, Layers, Activity, RotateCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { trpc } from '@/sdk/client/trpc';
import { QMSProvider } from '@/sdk/client/provider';

const STATUS_COLOR: Record<string, string> = {
  deployed:'bg-emerald-500/10 text-emerald-700',
  validating:'bg-blue-500/10 text-blue-700',
  training:'bg-amber-500/10 text-amber-700',
  archived:'bg-muted text-muted-foreground',
  failed:'bg-red-500/10 text-red-700',
};

function ModelsContent() {
  const { data: models = [], refetch } = trpc.models.list.useQuery(undefined);
  const { data: experiments = [] } = trpc.models.experiments.list.useQuery(undefined);
  const { data: driftAll = [] } = trpc.models.drift.all.useQuery();

  const deployMutation   = trpc.models.deploy.useMutation({ onSuccess: () => refetch() });
  const archiveMutation  = trpc.models.archive.useMutation({ onSuccess: () => refetch() });
  const retrainMutation  = trpc.models.drift.triggerRetrain.useMutation({ onSuccess: () => refetch() });

  const [compareA, setCompareA] = React.useState('');
  const [compareB, setCompareB] = React.useState('');
  const { data: compareResult } = trpc.models.experiments.compare.useQuery(
    { idA: compareA, idB: compareB },
    { enabled: !!(compareA && compareB && compareA !== compareB) },
  );

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <Tabs defaultValue="registry">
        <TabsList className="h-8">
          <TabsTrigger value="registry"    className="text-xs gap-1"><BrainCircuit className="h-3 w-3"/>Registry</TabsTrigger>
          <TabsTrigger value="experiments" className="text-xs gap-1"><FlaskConical className="h-3 w-3"/>Experiments</TabsTrigger>
          <TabsTrigger value="features"    className="text-xs gap-1"><Layers className="h-3 w-3"/>Features</TabsTrigger>
          <TabsTrigger value="monitoring"  className="text-xs gap-1"><Activity className="h-3 w-3"/>Monitoring</TabsTrigger>
        </TabsList>

        {/* Model Registry */}
        <TabsContent value="registry" className="mt-4">
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 border-b">
                <tr>{['Model','Version','Framework','Status','Accuracy','Created','Actions'].map(h=>(
                  <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {models.map(m=>(
                  <tr key={m.id} className="border-b hover:bg-muted/20">
                    <td className="px-3 py-2 font-mono font-medium">{m.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{m.version}</td>
                    <td className="px-3 py-2 text-muted-foreground">{m.framework}</td>
                    <td className="px-3 py-2">
                      <Badge className={`text-[10px] ${STATUS_COLOR[m.status]}`}>{m.status}</Badge>
                    </td>
                    <td className="px-3 py-2 font-semibold">{m.accuracy ? `${(m.accuracy*100).toFixed(1)}%` : '—'}</td>
                    <td className="px-3 py-2 text-muted-foreground">{m.createdAt}</td>
                    <td className="px-3 py-2 flex gap-1">
                      {m.status !== 'deployed' && (
                        <Button size="sm" variant="ghost" className="h-6 text-[10px]"
                          onClick={() => deployMutation.mutate({ id: m.id })}>
                          Deploy
                        </Button>
                      )}
                      {m.status !== 'archived' && (
                        <Button size="sm" variant="ghost" className="h-6 text-[10px] text-muted-foreground"
                          onClick={() => archiveMutation.mutate({ id: m.id })}>
                          Archive
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Experiments */}
        <TabsContent value="experiments" className="mt-4 space-y-3">
          {/* Compare selector */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Compare Runs</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-3 items-end">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Run A</p>
                <select className="border rounded h-7 text-xs px-2"
                  value={compareA} onChange={e=>setCompareA(e.target.value)}>
                  <option value="">Select…</option>
                  {experiments.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Run B</p>
                <select className="border rounded h-7 text-xs px-2"
                  value={compareB} onChange={e=>setCompareB(e.target.value)}>
                  <option value="">Select…</option>
                  {experiments.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              {compareResult && (
                <div className="flex gap-4 text-xs flex-wrap mt-1">
                  {Object.entries(compareResult.metricDiff).map(([k,v])=>(
                    <div key={k} className="rounded border px-2 py-1">
                      <span className="text-muted-foreground">{k}: </span>
                      <span className="font-mono">{(v.a as number)?.toFixed(3)} vs {(v.b as number)?.toFixed(3)} </span>
                      <span className={`font-semibold ${(v.delta as number) > 0 ? 'text-emerald-600':'text-red-500'}`}>
                        ({(v.delta as number) > 0 ? '+':''}{(v.delta as number)?.toFixed(3)})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {experiments.map(e=>(
            <Card key={e.id}>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="font-mono">{e.name}</span>
                  <Badge className={`text-[10px] ${STATUS_COLOR[e.status]}`}>{e.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <div className="flex gap-4 flex-wrap">
                  {Object.entries(e.metrics).map(([k,v])=>(
                    <div key={k}><span className="text-muted-foreground">{k}: </span>
                    <span className="font-semibold">{(v as number).toFixed(3)}</span></div>
                  ))}
                </div>
                <div className="flex gap-3 text-muted-foreground flex-wrap">
                  {Object.entries(e.params).map(([k,v])=><span key={k}>{k}={String(v)}</span>)}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Feature Store */}
        <TabsContent value="features" className="mt-4">
          <div className="space-y-2">
            {[
              { name:'customer_ltv',        type:'float',   source:'orders_fact',   description:'Customer lifetime value',  tags:['crm','finance'] },
              { name:'days_since_purchase', type:'integer', source:'orders_fact',   description:'Recency feature',          tags:['crm','rfm'] },
              { name:'compliance_score',    type:'float',   source:'audit_results', description:'Rolling compliance score', tags:['qms','compliance'] },
            ].map(f=>(
              <Card key={f.name}>
                <CardContent className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-mono font-medium">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.description} · source: {f.source}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className="text-[10px]">{f.type}</Badge>
                    {f.tags.map(t=><Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Drift Monitoring */}
        <TabsContent value="monitoring" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {driftAll.map(d=>(
              <Card key={d.modelId}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span className="font-mono">{d.modelId}</span>
                    {d.status === 'ok'
                      ? <span className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5"/>Healthy</span>
                      : <span className="text-xs text-amber-600 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5"/>Warning</span>
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data drift</span>
                    <span className={`font-medium ${d.dataDrift > 0.06 ? 'text-amber-600':'text-emerald-600'}`}>
                      {d.dataDrift.toFixed(3)} {d.dataDrift > 0.06 ? '⚠':'✓'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prediction drift</span>
                    <span className={`font-medium ${d.predictionDrift > 0.05 ? 'text-amber-600':'text-emerald-600'}`}>
                      {d.predictionDrift.toFixed(3)} {d.predictionDrift > 0.05 ? '⚠':'✓'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Requests/day</span>
                    <span className="font-medium">{d.requestsPerDay.toLocaleString()}</span>
                  </div>
                  <Button size="sm" variant="outline" className="h-6 text-[10px] w-full gap-1"
                    disabled={retrainMutation.isPending}
                    onClick={() => retrainMutation.mutate({ modelId: d.modelId, reason: 'manual' })}>
                    <RotateCw className="h-3 w-3"/>
                    {retrainMutation.isPending ? 'Triggering…' : 'Trigger Retrain'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ModelsPage() {
  return (
    <QMSProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader title="MLOps Platform" description="Model registry · Experiments · Feature store · Drift monitoring" />
          <main className="flex-1 overflow-auto p-6">
            <ModelsContent />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </QMSProvider>
  );
}

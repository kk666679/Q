'use client';
import * as React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Database, GitBranch, BookOpen, Users, Filter, Star } from 'lucide-react';

const MOCK_ASSETS = [
  { id:'a1', name:'orders_fact',        type:'table',  source:'PostgreSQL', owner:'data-eng',  quality:94, tags:['finance','orders'],        description:'Core orders fact table' },
  { id:'a2', name:'customers_dim',      type:'table',  source:'Snowflake',  owner:'analytics', quality:88, tags:['crm','customers'],          description:'Customer dimension table' },
  { id:'a3', name:'invoice_api',        type:'api',    source:'REST',       owner:'platform',  quality:99, tags:['finance','e-invoice','lhdn'],description:'LHDN e-Invoice endpoint' },
  { id:'a4', name:'hr_employees',       type:'table',  source:'MySQL',      owner:'hr',        quality:72, tags:['hr','employees'],           description:'Employee master data' },
  { id:'a5', name:'compliance_events',  type:'stream', source:'Kafka',      owner:'compliance',quality:91, tags:['compliance','audit'],       description:'Real-time compliance event stream' },
];

const GLOSSARY = [
  { term:'Customer Lifetime Value', domain:'Marketing', definition:'Total revenue attributed to a customer over their relationship.' },
  { term:'Net Promoter Score',      domain:'CX',        definition:'Customer loyalty metric derived from survey responses.' },
  { term:'Data Contract',           domain:'Governance',definition:'SLA-backed schema agreement between data producers and consumers.' },
  { term:'e-Invoice',               domain:'Finance',   definition:'LHDN-mandated digital invoice format for Malaysian businesses.' },
];

export default function CatalogPage() {
  const [q, setQ] = React.useState('');
  const filtered = MOCK_ASSETS.filter(a =>
    !q || a.name.includes(q) || a.tags.some(t => t.includes(q))
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Data Catalog" description="Discover, understand, and govern all data assets" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl space-y-4">
            <Tabs defaultValue="assets">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <TabsList className="h-8">
                  <TabsTrigger value="assets"  className="text-xs gap-1"><Database className="h-3 w-3"/>Assets</TabsTrigger>
                  <TabsTrigger value="lineage" className="text-xs gap-1"><GitBranch className="h-3 w-3"/>Lineage</TabsTrigger>
                  <TabsTrigger value="glossary"className="text-xs gap-1"><BookOpen className="h-3 w-3"/>Glossary</TabsTrigger>
                  <TabsTrigger value="ownership"className="text-xs gap-1"><Users className="h-3 w-3"/>Ownership</TabsTrigger>
                </TabsList>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input placeholder="Search assets…" value={q} onChange={e=>setQ(e.target.value)} className="pl-8 h-8 text-xs" />
                </div>
              </div>

              <TabsContent value="assets" className="mt-4">
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/40 border-b">
                      <tr>
                        {['Name','Type','Source','Owner','Quality','Tags',''].map(h=>(
                          <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(a=>(
                        <tr key={a.id} className="border-b hover:bg-muted/20">
                          <td className="px-3 py-2 font-mono font-medium">{a.name}</td>
                          <td className="px-3 py-2"><Badge variant="outline" className="text-[10px]">{a.type}</Badge></td>
                          <td className="px-3 py-2 text-muted-foreground">{a.source}</td>
                          <td className="px-3 py-2 text-muted-foreground">{a.owner}</td>
                          <td className="px-3 py-2">
                            <span className={`font-semibold ${a.quality>=90?'text-emerald-600':a.quality>=75?'text-amber-600':'text-red-600'}`}>
                              {a.quality}%
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex gap-1 flex-wrap">
                              {a.tags.map(t=><Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <Button size="sm" variant="ghost" className="h-6 text-[10px]">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="lineage" className="mt-4">
                <Card><CardContent className="pt-6 text-sm text-muted-foreground">
                  Visual lineage graph — upstream/downstream dependencies across pipelines.
                  Select an asset above to explore its lineage tree.
                </CardContent></Card>
              </TabsContent>

              <TabsContent value="glossary" className="mt-4">
                <div className="space-y-2">
                  {GLOSSARY.map(g=>(
                    <Card key={g.term}>
                      <CardHeader className="pb-1">
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span>{g.term}</span>
                          <Badge variant="outline" className="text-[10px]">{g.domain}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs text-muted-foreground pt-0">{g.definition}</CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="ownership" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {MOCK_ASSETS.map(a=>(
                    <Card key={a.id}>
                      <CardHeader className="pb-1">
                        <CardTitle className="text-sm font-mono">{a.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs text-muted-foreground space-y-1">
                        <p>Owner: <span className="font-medium text-foreground">{a.owner}</span></p>
                        <p>Classification: <Badge variant="outline" className="text-[10px]">internal</Badge></p>
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

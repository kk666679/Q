'use client';
import * as React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, BookOpen, GitBranch, Users, FileCheck, Database } from 'lucide-react';
import type { GlossaryTerm, DataOwnership } from '@/components/automation/shared/types';

const TERMS: GlossaryTerm[] = [
  { id:'g1', term:'Data Contract',        definition:'SLA-backed schema agreement between data producers and consumers.', domain:'Engineering', owner:'data-eng',    synonyms:['schema agreement'],      relatedTerms:['Schema Registry'] },
  { id:'g2', term:'Customer LTV',         definition:'Total revenue attributed to a customer over their entire relationship.', domain:'Marketing',  owner:'analytics',  synonyms:['CLV','lifetime value'],  relatedTerms:['Cohort Analysis'] },
  { id:'g3', term:'Compliance Score',     definition:'Weighted score (0-100) measuring adherence to an ISO or regulatory standard.', domain:'QMS', owner:'compliance', synonyms:['audit score'],           relatedTerms:['Gap Analysis'] },
  { id:'g4', term:'e-Invoice',            definition:'LHDN MyInvois-mandated digital invoice format for Malaysian businesses.', domain:'Finance', owner:'finance',    synonyms:['MyInvois','digital invoice'], relatedTerms:['LHDN','PCB'] },
];

const OWNERSHIP: DataOwnership[] = [
  { assetId:'orders_fact',       owner:'data-eng',    steward:'analytics', domain:'Finance',    classification:'confidential' },
  { assetId:'customers_dim',     owner:'analytics',   steward:'crm-team',  domain:'Marketing',  classification:'internal' },
  { assetId:'compliance_events', owner:'compliance',  steward:'qms-team',  domain:'QMS',        classification:'restricted' },
  { assetId:'hr_employees',      owner:'hr',          steward:'hr-ops',    domain:'HR',         classification:'restricted' },
];

const CLASS_COLOR: Record<string,string> = {
  public:'bg-emerald-500/10 text-emerald-700',
  internal:'bg-blue-500/10 text-blue-700',
  confidential:'bg-amber-500/10 text-amber-700',
  restricted:'bg-red-500/10 text-red-700',
};

export default function GovernancePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Data Governance" description="Lineage · Glossary · Ownership · Stewardship · Metadata" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl space-y-4">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label:'Governed Assets',  value:'24', icon: Database },
                { label:'Glossary Terms',   value:'48', icon: BookOpen },
                { label:'Open Policies',    value:'3',  icon: FileCheck },
                { label:'Stewards',         value:'7',  icon: Users },
              ].map(s => (
                <Card key={s.label}>
                  <CardContent className="pt-4 pb-3 flex items-center gap-3">
                    <s.icon className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xl font-bold">{s.value}</p>
                      <p className="text-[11px] text-muted-foreground">{s.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="lineage">
              <TabsList className="h-8">
                <TabsTrigger value="lineage"   className="text-xs gap-1"><GitBranch className="h-3 w-3"/>Lineage</TabsTrigger>
                <TabsTrigger value="glossary"  className="text-xs gap-1"><BookOpen className="h-3 w-3"/>Glossary</TabsTrigger>
                <TabsTrigger value="ownership" className="text-xs gap-1"><Users className="h-3 w-3"/>Ownership</TabsTrigger>
                <TabsTrigger value="policies"  className="text-xs gap-1"><Shield className="h-3 w-3"/>Policies</TabsTrigger>
              </TabsList>

              <TabsContent value="lineage" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Lineage Explorer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 rounded bg-muted/30 flex items-center justify-center text-xs text-muted-foreground">
                      Interactive DAG lineage graph — select an asset from the Data Catalog to trace its upstream and downstream dependencies.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="glossary" className="mt-4 space-y-2">
                {TERMS.map(t => (
                  <Card key={t.id}>
                    <CardHeader className="pb-1">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>{t.term}</span>
                        <div className="flex gap-1.5">
                          <Badge variant="outline" className="text-[10px]">{t.domain}</Badge>
                          <Badge variant="secondary" className="text-[10px]">{t.owner}</Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-1">
                      <p className="text-xs text-muted-foreground">{t.definition}</p>
                      {t.synonyms.length > 0 && (
                        <p className="text-[10px] text-muted-foreground">
                          Synonyms: {t.synonyms.join(', ')}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
                <Button size="sm" variant="outline" className="h-7 text-xs">+ Add Term</Button>
              </TabsContent>

              <TabsContent value="ownership" className="mt-4">
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/40 border-b">
                      <tr>{['Asset','Owner','Steward','Domain','Classification'].map(h => (
                        <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {OWNERSHIP.map(o => (
                        <tr key={o.assetId} className="border-b hover:bg-muted/20">
                          <td className="px-3 py-2 font-mono font-medium">{o.assetId}</td>
                          <td className="px-3 py-2 text-muted-foreground">{o.owner}</td>
                          <td className="px-3 py-2 text-muted-foreground">{o.steward}</td>
                          <td className="px-3 py-2 text-muted-foreground">{o.domain}</td>
                          <td className="px-3 py-2">
                            <Badge className={`text-[10px] ${CLASS_COLOR[o.classification]}`}>{o.classification}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="policies" className="mt-4 space-y-2">
                {[
                  { name:'PII Masking Policy',          status:'active',  scope:'All pipelines',   updated:'2025-05-01' },
                  { name:'Retention Policy — Finance',  status:'active',  scope:'finance domain',  updated:'2025-04-15' },
                  { name:'Data Contract Enforcement',   status:'draft',   scope:'External APIs',   updated:'2025-05-20' },
                ].map(p => (
                  <Card key={p.name}>
                    <CardContent className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground">Scope: {p.scope} · Updated: {p.updated}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-[10px] ${p.status === 'active' ? 'text-emerald-700 border-emerald-200' : 'text-amber-700 border-amber-200'}`}>
                          {p.status}
                        </Badge>
                        <Button size="sm" variant="ghost" className="h-6 text-[10px]">Edit</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

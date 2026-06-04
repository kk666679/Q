'use client';
import * as React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, GitPullRequest, CheckSquare, Users, GitCompare, History } from 'lucide-react';

const REVIEWS = [
  { id:'r1', workflow:'lhdn-einvoice-v2',    author:'ali.hassan',   status:'pending',  created:'2025-05-23', comments:3 },
  { id:'r2', workflow:'hr-compliance-v3',    author:'siti.aminah',  status:'approved', created:'2025-05-21', comments:1 },
  { id:'r3', workflow:'esg-reporting-v1.2',  author:'raj.kumar',    status:'changes',  created:'2025-05-20', comments:5 },
];

const COMMENTS = [
  { id:'c1', workflow:'lhdn-einvoice-v2', node:'validate-node', author:'lim.wei', text:'Should we add a retry on HTTP 429?', at:'2025-05-23 14:12' },
  { id:'c2', workflow:'lhdn-einvoice-v2', node:'publish-url',   author:'ali.hassan', text:'URL should point to staging first.', at:'2025-05-23 14:45' },
];

const VERSIONS = [
  { id:'v3', workflow:'lhdn-einvoice', version:'v3', author:'ali.hassan', at:'2025-05-23', notes:'Added retry logic for LHDN timeouts' },
  { id:'v2', workflow:'lhdn-einvoice', version:'v2', author:'siti.aminah', at:'2025-05-18', notes:'Refactored validation node' },
  { id:'v1', workflow:'lhdn-einvoice', version:'v1', author:'raj.kumar', at:'2025-05-10', notes:'Initial release' },
];

const STATUS_COLOR: Record<string,string> = {
  pending:'bg-amber-500/10 text-amber-700 border-amber-200',
  approved:'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  changes:'bg-red-500/10 text-red-700 border-red-200',
};

export default function CollaborationPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Collaboration" description="Reviews · Comments · Approvals · Versioning · Team Workspaces" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-5xl space-y-4">
            <Tabs defaultValue="reviews">
              <TabsList className="h-8">
                <TabsTrigger value="reviews"   className="text-xs gap-1"><GitPullRequest className="h-3 w-3"/>Reviews</TabsTrigger>
                <TabsTrigger value="comments"  className="text-xs gap-1"><MessageSquare className="h-3 w-3"/>Comments</TabsTrigger>
                <TabsTrigger value="approvals" className="text-xs gap-1"><CheckSquare className="h-3 w-3"/>Approvals</TabsTrigger>
                <TabsTrigger value="versions"  className="text-xs gap-1"><History className="h-3 w-3"/>Versions</TabsTrigger>
                <TabsTrigger value="workspaces"className="text-xs gap-1"><Users className="h-3 w-3"/>Workspaces</TabsTrigger>
              </TabsList>

              <TabsContent value="reviews" className="mt-4 space-y-2">
                {REVIEWS.map(r => (
                  <Card key={r.id}>
                    <CardContent className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-mono font-semibold">{r.workflow}</p>
                        <p className="text-[11px] text-muted-foreground">by {r.author} · {r.created} · {r.comments} comment{r.comments !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-[10px] ${STATUS_COLOR[r.status]}`}>{r.status}</Badge>
                        <Button size="sm" variant="ghost" className="h-6 text-[10px]">Review</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5">
                  <GitPullRequest className="h-3.5 w-3.5" /> New Review Request
                </Button>
              </TabsContent>

              <TabsContent value="comments" className="mt-4 space-y-2">
                {COMMENTS.map(c => (
                  <Card key={c.id}>
                    <CardContent className="py-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-medium">{c.author} on <span className="font-mono">{c.node}</span></p>
                        <span className="text-[10px] text-muted-foreground">{c.at}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{c.text}</p>
                      <p className="text-[10px] text-muted-foreground">Workflow: {c.workflow}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="approvals" className="mt-4">
                <Card>
                  <CardHeader><CardTitle className="text-sm">Pending Approvals</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {REVIEWS.filter(r => r.status === 'pending').map(r => (
                      <div key={r.id} className="flex items-center justify-between rounded border p-3">
                        <div>
                          <p className="text-xs font-mono font-semibold">{r.workflow}</p>
                          <p className="text-[11px] text-muted-foreground">Requested by {r.author}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <Button size="sm" className="h-6 text-[10px] bg-emerald-600 hover:bg-emerald-700">Approve</Button>
                          <Button size="sm" variant="outline" className="h-6 text-[10px] text-red-600 border-red-200">Reject</Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="versions" className="mt-4 space-y-2">
                {VERSIONS.map((v, i) => (
                  <Card key={v.id}>
                    <CardContent className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${i === 0 ? 'bg-primary' : 'bg-muted-foreground/40'}`}>
                          {v.version}
                        </div>
                        <div>
                          <p className="text-xs font-medium">{v.notes}</p>
                          <p className="text-[11px] text-muted-foreground">{v.author} · {v.at}</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        {i !== 0 && <Button size="sm" variant="ghost" className="h-6 text-[10px] gap-1"><GitCompare className="h-3 w-3"/>Diff</Button>}
                        {i !== 0 && <Button size="sm" variant="ghost" className="h-6 text-[10px]">Restore</Button>}
                        {i === 0 && <Badge className="text-[10px] bg-primary/10 text-primary">Current</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="workspaces" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name:'Finance & Tax',     members:4, workflows:8,  updated:'2025-05-23' },
                    { name:'HR Compliance',     members:3, workflows:5,  updated:'2025-05-21' },
                    { name:'ESG & Reporting',   members:5, workflows:3,  updated:'2025-05-19' },
                    { name:'Data Engineering',  members:6, workflows:14, updated:'2025-05-22' },
                  ].map(w => (
                    <Card key={w.name} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-1"><CardTitle className="text-sm">{w.name}</CardTitle></CardHeader>
                      <CardContent className="text-xs text-muted-foreground space-y-1">
                        <p>{w.members} members · {w.workflows} workflows</p>
                        <p>Last activity: {w.updated}</p>
                        <Button size="sm" variant="outline" className="h-6 text-[10px] mt-1">Open</Button>
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

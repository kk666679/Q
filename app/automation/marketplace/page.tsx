'use client';
import * as React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download, Star, GitBranch, Cpu, Plug, FileCode2, LayoutTemplate } from 'lucide-react';
import type { MarketplaceItem } from '@/components/automation/shared/types';

const ITEMS: MarketplaceItem[] = [
  { id:'1', type:'workflow',  name:'Customer Analytics Pipeline',    description:'End-to-end CRM data ingestion to KPI dashboard.',     author:'QMS Team',    version:'1.2.0', downloads:1842, rating:4.8, tags:['analytics','crm'],        category:'Analytics',   pricing:'free' },
  { id:'2', type:'workflow',  name:'e-Invoice Automation',          description:'LHDN MyInvois submission with validation and retry.',  author:'Malaysia Gov', version:'2.0.1', downloads:3210, rating:4.9, tags:['lhdn','malaysia','finance'], category:'Compliance',  pricing:'free' },
  { id:'3', type:'template',  name:'ISO 9001 Compliance Monitor',   description:'Automated gap analysis and audit checklist generator.',author:'QMS Team',    version:'1.0.0', downloads:986,  rating:4.7, tags:['iso','audit'],              category:'QMS',         pricing:'free' },
  { id:'4', type:'connector', name:'Snowflake Connector',           description:'High-performance Snowflake read/write with schema sync.',author:'Platform',  version:'3.1.0', downloads:5420, rating:4.9, tags:['database','cloud'],         category:'Database',    pricing:'free' },
  { id:'5', type:'agent',     name:'Forecasting Agent',             description:'ARIMA + Prophet ensemble forecasting with explainability.',author:'AI Lab', version:'1.1.0', downloads:728,  rating:4.6, tags:['ml','forecast'],            category:'AI',          pricing:'freemium' },
  { id:'6', type:'workflow',  name:'HR Compliance Suite',           description:'EPF, SOCSO, EIS automated filing and reporting.',      author:'HR Platform', version:'1.3.2', downloads:2105, rating:4.7, tags:['hr','malaysia','epf'],      category:'HR',          pricing:'free' },
  { id:'7', type:'template',  name:'ESG Reporting Workflow',        description:'GRI/SASB data collection, scoring and PDF generation.',author:'ESG Lab',    version:'1.0.2', downloads:441,  rating:4.5, tags:['esg','sustainability'],     category:'ESG',         pricing:'free' },
  { id:'8', type:'node',      name:'Fuzzy Join Node',               description:'AI-assisted approximate key matching for messy data.', author:'Data Eng',   version:'2.0.0', downloads:3890, rating:4.8, tags:['etl','transform'],          category:'ETL',         pricing:'free' },
];

const TYPE_ICONS = { workflow: GitBranch, agent: Cpu, connector: Plug, node: FileCode2, template: LayoutTemplate } as const;
const PRICING_COLOR = { free:'bg-emerald-500/10 text-emerald-700 border-emerald-200', paid:'bg-blue-500/10 text-blue-700 border-blue-200', freemium:'bg-amber-500/10 text-amber-700 border-amber-200' } as const;

export default function MarketplacePage() {
  const [q, setQ] = React.useState('');
  const [type, setType] = React.useState<string>('all');

  const filtered = ITEMS.filter(i =>
    (type === 'all' || i.type === type) &&
    (!q || i.name.toLowerCase().includes(q.toLowerCase()) || i.tags.some(t => t.includes(q.toLowerCase())))
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Marketplace" description="Discover and install workflows, nodes, agents, connectors and templates" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search marketplace…" value={q} onChange={e=>setQ(e.target.value)} className="pl-8 h-8 text-xs" />
              </div>
              <Tabs value={type} onValueChange={setType}>
                <TabsList className="h-8">
                  {['all','workflow','template','node','agent','connector'].map(t=>(
                    <TabsTrigger key={t} value={t} className="text-xs capitalize">{t}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(item => {
                const Icon = TYPE_ICONS[item.type];
                return (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="rounded-md bg-primary/10 p-1.5">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-sm leading-tight">{item.name}</CardTitle>
                            <p className="text-[10px] text-muted-foreground">by {item.author} · v{item.version}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={`text-[10px] ${PRICING_COLOR[item.pricing]}`}>{item.pricing}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                      <div className="flex gap-1 flex-wrap">
                        {item.tags.map(t=><Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{item.rating}</span>
                          <span className="flex items-center gap-0.5"><Download className="h-3 w-3" />{item.downloads.toLocaleString()}</span>
                        </div>
                        <Button size="sm" className="h-6 text-[10px] px-2">Install</Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

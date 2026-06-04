'use client';
import * as React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Zap, LayoutTemplate } from 'lucide-react';

const TEMPLATES = [
  { id:'t1',  name:'Customer Analytics Pipeline',     category:'Analytics',   nodes:7,  description:'CRM ingestion → clean → segment → KPI dashboard → email distribution.',          tags:['crm','analytics','kpi'] },
  { id:'t2',  name:'Sales Forecasting',               category:'Analytics',   nodes:6,  description:'Orders data → ARIMA forecast → confidence bands → dashboard + alert.',           tags:['forecast','sales','arima'] },
  { id:'t3',  name:'Inventory Optimisation',          category:'Operations',  nodes:8,  description:'Stock data → demand model → reorder trigger → ERP update → Slack alert.',        tags:['inventory','operations','ml'] },
  { id:'t4',  name:'Compliance Monitoring',           category:'QMS',         nodes:5,  description:'Audit events → ISO scoring → gap analysis → report → approval workflow.',        tags:['iso','audit','compliance'] },
  { id:'t5',  name:'ESG Reporting',                   category:'ESG',         nodes:9,  description:'GRI data collection → scoring → PDF generation → Bursa ESG submission.',         tags:['esg','sustainability','bursa'] },
  { id:'t6',  name:'Malaysia Regulatory Compliance',  category:'Malaysia',    nodes:10, description:'SSM + LHDN + EPF + SOCSO monitoring → gap detection → remediation workflow.',    tags:['malaysia','ssm','lhdn','epf'] },
  { id:'t7',  name:'e-Invoice Automation',            category:'Malaysia',    nodes:8,  description:'Invoice generation → LHDN MyInvois validation → submission → status polling.',   tags:['malaysia','lhdn','einvoice','finance'] },
  { id:'t8',  name:'HR Compliance Suite',             category:'HR',          nodes:7,  description:'Payroll data → EPF/SOCSO calculation → filing → receipt archival → audit trail.',tags:['hr','epf','socso','malaysia'] },
  { id:'t9',  name:'Quality Management Workflow',     category:'QMS',         nodes:6,  description:'Inspection data → CAPA trigger → ISO 9001 gap check → approval → closure.',      tags:['qms','iso9001','capa'] },
  { id:'t10', name:'Risk Management Pipeline',        category:'Risk',        nodes:5,  description:'Risk register → scoring → heat map → owner notification → review schedule.',     tags:['risk','governance'] },
  { id:'t11', name:'Data Quality Scorecard',          category:'Data Eng',    nodes:6,  description:'Source data → profiling → DQ rules → scorecard → alert on threshold breach.',    tags:['dq','profiling','quality'] },
  { id:'t12', name:'ML Model Retraining',             category:'MLOps',       nodes:7,  description:'Drift detection → feature rebuild → retrain → validate → promote → notify.',     tags:['ml','mlops','drift'] },
];

const CAT_COLOR: Record<string,string> = {
  Analytics:'bg-blue-500/10 text-blue-700',
  Operations:'bg-amber-500/10 text-amber-700',
  QMS:'bg-emerald-500/10 text-emerald-700',
  ESG:'bg-teal-500/10 text-teal-700',
  Malaysia:'bg-red-500/10 text-red-700',
  HR:'bg-purple-500/10 text-purple-700',
  Risk:'bg-orange-500/10 text-orange-700',
  'Data Eng':'bg-indigo-500/10 text-indigo-700',
  MLOps:'bg-pink-500/10 text-pink-700',
};

export default function TemplatesPage() {
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState('All');

  const cats = ['All', ...Array.from(new Set(TEMPLATES.map(t => t.category)))];
  const filtered = TEMPLATES.filter(t =>
    (cat === 'All' || t.category === cat) &&
    (!q || t.name.toLowerCase().includes(q.toLowerCase()) || t.tags.some(tag => tag.includes(q.toLowerCase())))
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Workflow Templates" description="Production-ready starter templates for every domain" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl space-y-4">

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search templates…" value={q} onChange={e => setQ(e.target.value)} className="pl-8 h-8 text-xs" />
              </div>
              <div className="flex gap-1 flex-wrap">
                {cats.map(c => (
                  <Button key={c} size="sm" variant={cat === c ? 'default' : 'outline'}
                    className="h-7 text-xs" onClick={() => setCat(c)}>{c}
                  </Button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(t => (
                <Card key={t.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="rounded-md bg-primary/10 p-1.5">
                          <LayoutTemplate className="h-4 w-4 text-primary" />
                        </div>
                        <CardTitle className="text-sm leading-tight">{t.name}</CardTitle>
                      </div>
                      <Badge className={`text-[10px] flex-shrink-0 ${CAT_COLOR[t.category] ?? 'bg-muted text-muted-foreground'}`}>
                        {t.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-muted-foreground line-clamp-2">{t.description}</p>
                    <div className="flex gap-1 flex-wrap">
                      {t.tags.map(tag => <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>)}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Zap className="h-3 w-3" />{t.nodes} nodes
                      </span>
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="outline" className="h-6 text-[10px]">Preview</Button>
                        <Button size="sm" className="h-6 text-[10px]">Use Template</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

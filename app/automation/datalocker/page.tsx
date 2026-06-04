'use client';
import * as React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Upload, Download, Search, Eye, Trash2, FileText } from 'lucide-react';

const LOCKERS = [
  { id:'l1', name:'financials_q1_2025.parquet', size:'14.2 MB', owner:'finance',    access:'restricted', updated:'2025-05-01', rows:48200 },
  { id:'l2', name:'customers_cleaned.csv',      size:'3.8 MB',  owner:'analytics',  access:'internal',   updated:'2025-05-10', rows:12400 },
  { id:'l3', name:'lhdn_submissions.json',      size:'0.9 MB',  owner:'compliance', access:'restricted', updated:'2025-05-18', rows:930 },
  { id:'l4', name:'hr_headcount_2025.xlsx',     size:'1.1 MB',  owner:'hr',         access:'internal',   updated:'2025-05-20', rows:640 },
];

const ACCESS_COLOR: Record<string,string> = {
  restricted:'bg-red-500/10 text-red-700 border-red-200',
  internal:'bg-blue-500/10 text-blue-700 border-blue-200',
  public:'bg-emerald-500/10 text-emerald-700 border-emerald-200',
};

export default function DataLockerPage() {
  const [q, setQ] = React.useState('');
  const filtered = LOCKERS.filter(l => !q || l.name.includes(q));

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Data Locker" description="Secure managed storage for pipeline inputs and outputs" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-5xl space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search files…" value={q} onChange={e=>setQ(e.target.value)} className="pl-8 h-8 text-xs" />
              </div>
              <Button size="sm" className="h-7 text-xs gap-1.5"><Upload className="h-3.5 w-3.5"/>Upload File</Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label:'Files',       value:'4',      icon: FileText },
                { label:'Total Size',  value:'20.0 MB', icon: Lock },
                { label:'Locked Files',value:'2',      icon: Lock },
              ].map(s=>(
                <Card key={s.label}>
                  <CardContent className="pt-4 pb-3 flex items-center gap-3">
                    <s.icon className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-lg font-bold">{s.value}</p>
                      <p className="text-[11px] text-muted-foreground">{s.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-muted/40 border-b">
                  <tr>
                    {['Name','Size','Rows','Owner','Access','Updated',''].map(h=>(
                      <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(f=>(
                    <tr key={f.id} className="border-b hover:bg-muted/20">
                      <td className="px-3 py-2 font-mono font-medium flex items-center gap-1.5">
                        <FileText className="h-3 w-3 text-muted-foreground" />{f.name}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{f.size}</td>
                      <td className="px-3 py-2 text-muted-foreground">{f.rows.toLocaleString()}</td>
                      <td className="px-3 py-2 text-muted-foreground">{f.owner}</td>
                      <td className="px-3 py-2">
                        <Badge variant="outline" className={`text-[10px] ${ACCESS_COLOR[f.access]}`}>{f.access}</Badge>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{f.updated}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-6 px-1.5"><Eye className="h-3 w-3"/></Button>
                          <Button size="sm" variant="ghost" className="h-6 px-1.5"><Download className="h-3 w-3"/></Button>
                          <Button size="sm" variant="ghost" className="h-6 px-1.5 text-destructive"><Trash2 className="h-3 w-3"/></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, GitCompare } from 'lucide-react';
import type { SchemaVersion, SchemaField } from '../../shared/types';

const MOCK_VERSIONS: SchemaVersion[] = [
  {
    version: 2, createdAt: '2025-05-10', changelog: 'Added region column; made revenue nullable.',
    fields: [
      { name:'customer_id', type:'STRING',  nullable:false },
      { name:'order_date',  type:'DATE',    nullable:false },
      { name:'revenue',     type:'DECIMAL', nullable:true },
      { name:'status',      type:'STRING',  nullable:false },
      { name:'region',      type:'STRING',  nullable:true, description:'ISO 3166-2 region code' },
    ],
  },
  {
    version: 1, createdAt: '2025-04-01', changelog: 'Initial schema.',
    fields: [
      { name:'customer_id', type:'STRING',  nullable:false },
      { name:'order_date',  type:'DATE',    nullable:false },
      { name:'revenue',     type:'DECIMAL', nullable:false },
      { name:'status',      type:'STRING',  nullable:false },
    ],
  },
];

export function SchemaRegistry({ versions = MOCK_VERSIONS }: { versions?: SchemaVersion[] }) {
  const [selected, setSelected] = React.useState(versions[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" /> Versions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {versions.map(v => (
            <button
              key={v.version}
              onClick={() => setSelected(v)}
              className={`w-full text-left rounded border p-2.5 text-xs transition-colors ${selected.version === v.version ? 'border-primary bg-primary/5' : 'hover:bg-muted/30'}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">v{v.version}</span>
                {v.version === versions[0].version && <Badge className="text-[10px] bg-primary/10 text-primary">latest</Badge>}
              </div>
              <p className="text-muted-foreground text-[10px] mt-0.5">{v.createdAt}</p>
              <p className="text-muted-foreground text-[10px] line-clamp-1">{v.changelog}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Schema v{selected.version}</span>
            <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1">
              <GitCompare className="h-3 w-3"/>Diff
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 border-b">
                <tr>{['Field','Type','Nullable','Description'].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {selected.fields.map((f: SchemaField) => (
                  <tr key={f.name} className="border-b hover:bg-muted/20">
                    <td className="px-3 py-2 font-mono font-medium">{f.name}</td>
                    <td className="px-3 py-2"><Badge variant="outline" className="text-[10px]">{f.type}</Badge></td>
                    <td className="px-3 py-2">
                      <span className={f.nullable ? 'text-amber-600' : 'text-emerald-600'}>{f.nullable ? 'yes' : 'no'}</span>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{f.description ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

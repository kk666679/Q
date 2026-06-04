'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart2 } from 'lucide-react';

interface ColumnProfile {
  name: string; type: string; nullPct: number;
  distinct: number; min?: string; max?: string; sample?: string;
}

const MOCK_PROFILE: ColumnProfile[] = [
  { name:'customer_id', type:'string',  nullPct:0,   distinct:12400, min:'C-0001', max:'C-12400' },
  { name:'order_date',  type:'date',    nullPct:0,   distinct:365,   min:'2024-01-01', max:'2024-12-31' },
  { name:'revenue',     type:'decimal', nullPct:1.2, distinct:9841,  min:'0.00', max:'84200.00' },
  { name:'status',      type:'string',  nullPct:0.3, distinct:3,     sample:'open, closed, pending' },
  { name:'region',      type:'string',  nullPct:4.1, distinct:14,    sample:'KL, Penang, Johor…' },
];

export function DataProfiler({ columns = MOCK_PROFILE }: { columns?: ColumnProfile[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-primary" /> Data Profiling
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 border-b">
              <tr>{['Column','Type','Null %','Distinct','Range / Sample'].map(h => (
                <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {columns.map(c => (
                <tr key={c.name} className="border-b hover:bg-muted/20">
                  <td className="px-3 py-2 font-mono font-medium">{c.name}</td>
                  <td className="px-3 py-2"><Badge variant="outline" className="text-[10px]">{c.type}</Badge></td>
                  <td className="px-3 py-2">
                    <span className={c.nullPct > 5 ? 'text-red-600 font-semibold' : c.nullPct > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                      {c.nullPct}%
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{c.distinct.toLocaleString()}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {c.sample ?? (c.min && c.max ? `${c.min} → ${c.max}` : '—')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

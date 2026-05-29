'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Activity, Download, Search } from 'lucide-react';
import { downloadCSV } from '@/lib/exportUtils';

interface TraceRecord {
  id: string;
  lotNumber: string;
  partNumber: string;
  supplier: string;
  receivedDate: string;
  usedIn: string[];
  status: 'active' | 'quarantine' | 'recalled';
}

const MOCK_RECORDS: TraceRecord[] = [
  { id: 'TR-001', lotNumber: 'LOT-2026-0412', partNumber: 'IC-MCU-001', supplier: 'Penang Components', receivedDate: '2026-04-12', usedIn: ['WO-8821', 'WO-8822'], status: 'active' },
  { id: 'TR-002', lotNumber: 'LOT-2026-0389', partNumber: 'CAP-100UF', supplier: 'KL Precision Parts', receivedDate: '2026-04-08', usedIn: ['WO-8800'], status: 'quarantine' },
  { id: 'TR-003', lotNumber: 'LOT-2026-0301', partNumber: 'RES-10K', supplier: 'Selangor Materials', receivedDate: '2026-03-28', usedIn: ['WO-8750', 'WO-8751', 'WO-8752'], status: 'recalled' },
  { id: 'TR-004', lotNumber: 'LOT-2026-0450', partNumber: 'PCB-MAIN-V3', supplier: 'Johor Packaging', receivedDate: '2026-04-18', usedIn: ['WO-8900'], status: 'active' },
];

const statusColor: Record<TraceRecord['status'], string> = {
  active: 'bg-green-100 text-green-800',
  quarantine: 'bg-yellow-100 text-yellow-800',
  recalled: 'bg-red-100 text-red-800',
};

export function TraceabilityPanel() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_RECORDS.filter(
    (r) =>
      r.lotNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.partNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.supplier.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          Traceability Panel
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => downloadCSV(MOCK_RECORDS as unknown as Record<string, unknown>[], 'traceability.csv')}>
          <Download className="h-4 w-4 mr-1" /> Export
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search lot, part, supplier..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-lg border p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{r.lotNumber}</p>
                <Badge className={`text-xs ${statusColor[r.status]}`}>{r.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-x-4 text-xs text-muted-foreground">
                <span>Part: <span className="text-foreground font-medium">{r.partNumber}</span></span>
                <span>Supplier: <span className="text-foreground font-medium">{r.supplier}</span></span>
                <span>Received: {r.receivedDate}</span>
                <span>Used in: {r.usedIn.join(', ')}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">No records found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

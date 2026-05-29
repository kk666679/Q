'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Star, AlertTriangle, Download } from 'lucide-react';
import { downloadCSV } from '@/lib/exportUtils';

interface SupplierRow {
  id: string;
  name: string;
  ppm: number;
  onTimeDelivery: number;
  auditScore: number;
  halalValid?: boolean;
  status: 'approved' | 'conditional' | 'blocked';
}

const MOCK_SUPPLIERS: SupplierRow[] = [
  { id: 'SUP-001', name: 'Penang Components Sdn Bhd', ppm: 120, onTimeDelivery: 97.2, auditScore: 88, status: 'approved' },
  { id: 'SUP-002', name: 'KL Precision Parts', ppm: 450, onTimeDelivery: 91.5, auditScore: 72, status: 'conditional' },
  { id: 'SUP-003', name: 'Selangor Materials Co', ppm: 2100, onTimeDelivery: 84.0, auditScore: 55, status: 'blocked' },
  { id: 'SUP-004', name: 'Johor Packaging Bhd', ppm: 80, onTimeDelivery: 98.8, auditScore: 94, status: 'approved' },
];

const statusColor: Record<SupplierRow['status'], string> = {
  approved: 'bg-green-100 text-green-800',
  conditional: 'bg-yellow-100 text-yellow-800',
  blocked: 'bg-red-100 text-red-800',
};

export function SupplierScorecard({ showHalal = false }: { showHalal?: boolean }) {
  const [suppliers] = useState<SupplierRow[]>(MOCK_SUPPLIERS);

  const avgScore = suppliers.reduce((a, s) => a + s.auditScore, 0) / suppliers.length;
  const blocked = suppliers.filter((s) => s.status === 'blocked').length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Supplier Scorecard
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => downloadCSV(suppliers as unknown as Record<string, unknown>[], 'supplier-scorecard.csv')}>
          <Download className="h-4 w-4 mr-1" /> Export
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-muted p-3 text-center">
            <p className="text-2xl font-bold">{avgScore.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Avg Audit Score</p>
          </div>
          <div className="rounded-lg bg-muted p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{suppliers.filter((s) => s.status === 'approved').length}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </div>
          <div className="rounded-lg bg-red-50 p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{blocked}</p>
            <p className="text-xs text-muted-foreground">Blocked</p>
          </div>
        </div>

        <div className="space-y-3">
          {suppliers.map((s) => (
            <div key={s.id} className="rounded-lg border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  {showHalal && (
                    <Badge variant={s.halalValid ? 'default' : 'destructive'} className="text-xs">
                      {s.halalValid ? 'Halal ✓' : 'Halal ?'}
                    </Badge>
                  )}
                  <Badge className={`text-xs ${statusColor[s.status]}`}>{s.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">PPM</p>
                  <p className={`font-semibold ${s.ppm > 500 ? 'text-red-600' : 'text-green-600'}`}>{s.ppm}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">On-Time</p>
                  <p className="font-semibold">{s.onTimeDelivery}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Audit</p>
                  <p className="font-semibold">{s.auditScore}%</p>
                </div>
              </div>
              <Progress value={s.auditScore} className="h-1.5" />
            </div>
          ))}
        </div>

        {blocked > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {blocked} supplier(s) auto-blocked due to high PPM or failed audit. Review required.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

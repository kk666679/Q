'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart2, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import { downloadCSV } from '@/lib/exportUtils';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';

interface SpcDataPoint { sample: number; value: number }

function generateSpcData(): SpcDataPoint[] {
  return Array.from({ length: 20 }, (_, i) => ({
    sample: i + 1,
    value: parseFloat((10 + (Math.random() - 0.5) * 4).toFixed(3)),
  }));
}

const UCL = 12.5;
const LCL = 7.5;
const MEAN = 10.0;

export function SpcChartPanel() {
  const [data] = useState<SpcDataPoint[]>(generateSpcData);
  const outOfControl = data.filter((d) => d.value > UCL || d.value < LCL);
  const cpk = ((UCL - MEAN) / (3 * 0.667)).toFixed(2);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-blue-500" />
          SPC Control Chart
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={parseFloat(cpk) >= 1.67 ? 'default' : 'destructive'}>
            Cpk {cpk}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => downloadCSV(data as unknown as Record<string, unknown>[], 'spc-data.csv')}>
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="rounded-lg bg-muted p-2">
            <p className="text-lg font-bold">{UCL}</p>
            <p className="text-xs text-muted-foreground">UCL</p>
          </div>
          <div className="rounded-lg bg-muted p-2">
            <p className="text-lg font-bold">{MEAN}</p>
            <p className="text-xs text-muted-foreground">Mean</p>
          </div>
          <div className="rounded-lg bg-muted p-2">
            <p className="text-lg font-bold">{LCL}</p>
            <p className="text-xs text-muted-foreground">LCL</p>
          </div>
          <div className={`rounded-lg p-2 ${outOfControl.length > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
            <p className={`text-lg font-bold ${outOfControl.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {outOfControl.length}
            </p>
            <p className="text-xs text-muted-foreground">OOC Points</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="sample" className="text-xs" />
            <YAxis domain={[5, 15]} className="text-xs" />
            <Tooltip />
            <ReferenceLine y={UCL} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'UCL', position: 'right', fontSize: 10 }} />
            <ReferenceLine y={LCL} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'LCL', position: 'right', fontSize: 10 }} />
            <ReferenceLine y={MEAN} stroke="#22c55e" strokeDasharray="4 4" label={{ value: 'Mean', position: 'right', fontSize: 10 }} />
            <Line type="monotone" dataKey="value" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>

        {outOfControl.length > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {outOfControl.length} out-of-control point(s) detected. Initiate CAPA per control plan.
          </div>
        )}
        {outOfControl.length === 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            Process in statistical control. Cpk target ≥ 1.67.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

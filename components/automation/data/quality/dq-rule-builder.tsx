'use client';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import type { DataQualityRule } from '../../shared/types';

const MOCK_RULES: DataQualityRule[] = [
  { id:'r1', name:'No null customer_id',  type:'completeness', expression:'customer_id IS NOT NULL',           severity:'error' },
  { id:'r2', name:'Unique order_id',      type:'uniqueness',   expression:'COUNT(order_id) = COUNT(DISTINCT order_id)', severity:'error' },
  { id:'r3', name:'Valid status values',  type:'validity',     expression:"status IN ('open','closed','pending')",      severity:'warning' },
  { id:'r4', name:'Revenue non-negative', type:'accuracy',     expression:'revenue >= 0',                               severity:'warning' },
];

const SEV_COLOR = { error:'text-red-600', warning:'text-amber-600', info:'text-blue-600' } as const;
const TYPE_COLOR: Record<string,string> = {
  completeness:'bg-blue-500/10 text-blue-700',
  uniqueness:'bg-purple-500/10 text-purple-700',
  accuracy:'bg-emerald-500/10 text-emerald-700',
  validity:'bg-amber-500/10 text-amber-700',
  consistency:'bg-indigo-500/10 text-indigo-700',
};

export function DQRuleBuilder({ rules = MOCK_RULES }: { rules?: DataQualityRule[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" /> Data Quality Rules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {rules.map(r => (
          <div key={r.id} className="flex items-center justify-between rounded border p-2.5 gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">{r.name}</span>
                <Badge className={`text-[10px] ${TYPE_COLOR[r.type]}`}>{r.type}</Badge>
              </div>
              <code className="text-[10px] text-muted-foreground">{r.expression}</code>
            </div>
            <span className={`text-[10px] font-semibold flex-shrink-0 ${SEV_COLOR[r.severity]}`}>{r.severity}</span>
          </div>
        ))}
        <Button size="sm" variant="outline" className="h-7 text-xs w-full">+ Add Rule</Button>
      </CardContent>
    </Card>
  );
}

export function DQScorecard({ score = 91 }: { score?: number }) {
  const color = score >= 90 ? 'text-emerald-600' : score >= 75 ? 'text-amber-600' : 'text-red-600';
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-sm">Quality Scorecard</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <span className={`text-4xl font-bold ${color}`}>{score}%</span>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500"/>Completeness: 98%</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500"/>Uniqueness: 100%</div>
          <div className="flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5 text-amber-500"/>Accuracy: 87%</div>
          <div className="flex items-center gap-1.5"><XCircle className="h-3.5 w-3.5 text-red-500"/>Validity: 79%</div>
        </div>
      </CardContent>
    </Card>
  );
}

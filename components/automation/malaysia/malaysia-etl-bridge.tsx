'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import type { PipelineResult } from '../runtime/pipeline-executor';

// ── Agent routing map ─────────────────────────────────────────────────────────
const AGENT_ROUTES: { tag: string; agent: string; label: string; module: string }[] = [
  { tag:'lhdn',    agent:'lhdn-agent',    label:'LHDN / MyInvois',         module:'tax/lhdn-tax-dashboard' },
  { tag:'epf',     agent:'epf-agent',     label:'EPF Compliance',           module:'hr/epf-socso-compliance-monitor' },
  { tag:'socso',   agent:'socso-agent',   label:'SOCSO Compliance',         module:'hr/epf-socso-compliance-monitor' },
  { tag:'ssm',     agent:'ssm-agent',     label:'SSM Filing',               module:'agencies/ssm-filing-tracker' },
  { tag:'jakim',   agent:'jakim-agent',   label:'JAKIM Halal',              module:'halal/jakim-halal-dashboard' },
  { tag:'dosh',    agent:'dosh-agent',    label:'DOSH / JKKP Safety',       module:'compliance/npra-compliance-dashboard' },
  { tag:'bursa',   agent:'bursa-esg',     label:'Bursa ESG',                module:'esg/bursa-esg-dashboard' },
  { tag:'customs', agent:'customs',       label:'Customs / Import-Export',  module:'customs/customs-clearance-workflow' },
];

interface RoutedOutput {
  tag: string;
  rows: number;
  status: 'pending' | 'routed' | 'error';
  routedAt?: string;
}

interface Props {
  pipelineResult: PipelineResult | null;
  outputTags?: string[];   // tags from publish node config, e.g. ['lhdn','epf']
}

export function MalaysiaETLBridge({ pipelineResult, outputTags = [] }: Props) {
  const [outputs, setOutputs] = React.useState<RoutedOutput[]>([]);
  const [routing, setRouting] = React.useState(false);

  const applicableRoutes = AGENT_ROUTES.filter(r => outputTags.includes(r.tag));

  const handleRoute = async () => {
    if (!pipelineResult || applicableRoutes.length === 0) return;
    setRouting(true);
    const initial: RoutedOutput[] = applicableRoutes.map(r => ({
      tag: r.tag, rows: pipelineResult.totalRows, status: 'pending',
    }));
    setOutputs(initial);

    for (let i = 0; i < applicableRoutes.length; i++) {
      await new Promise(r => setTimeout(r, 400 + Math.random() * 300));
      setOutputs(prev => prev.map((o, idx) =>
        idx === i ? { ...o, status: 'routed', routedAt: new Date().toLocaleTimeString() } : o
      ));
    }
    setRouting(false);
  };

  if (applicableRoutes.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            🇲🇾 Malaysia Regulatory Bridge
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          Add output tags (lhdn, epf, socso, ssm, jakim, dosh, bursa, customs) to your Publish nodes
          to automatically route pipeline outputs to the corresponding regulatory agent.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">🇲🇾 Malaysia Regulatory Bridge</span>
          <Button
            size="sm" className="h-6 text-[10px] gap-1"
            disabled={!pipelineResult || routing}
            onClick={handleRoute}
          >
            <ArrowRight className="h-3 w-3"/>
            {routing ? 'Routing…' : 'Route Outputs'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {applicableRoutes.map(route => {
          const out = outputs.find(o => o.tag === route.tag);
          return (
            <div key={route.tag} className="flex items-center justify-between rounded border p-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-mono">{route.tag}</Badge>
                <span className="font-medium">{route.label}</span>
                <span className="text-muted-foreground">→ {route.agent}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!out && <span className="text-muted-foreground">Not routed</span>}
                {out?.status === 'pending' && <Clock className="h-3.5 w-3.5 text-amber-500 animate-spin"/>}
                {out?.status === 'routed'  && (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5"/>{out.rows.toLocaleString()} rows · {out.routedAt}
                  </span>
                )}
                {out?.status === 'error'   && <AlertTriangle className="h-3.5 w-3.5 text-red-500"/>}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/** Helper — extract malaysia tags from node configs */
export function extractMalaysiaTags(nodeConfigs: Record<string, Record<string, string>>): string[] {
  const ALL_TAGS = AGENT_ROUTES.map(r => r.tag);
  const found = new Set<string>();
  for (const cfg of Object.values(nodeConfigs)) {
    for (const val of Object.values(cfg)) {
      ALL_TAGS.forEach(t => { if (val.toLowerCase().includes(t)) found.add(t); });
    }
  }
  return Array.from(found);
}

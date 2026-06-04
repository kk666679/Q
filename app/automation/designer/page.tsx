'use client';

import * as React from 'react';
import { Handle, Position } from '@xyflow/react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { EnhancedFlowCanvas } from '@/components/automation/layout/EnhancedFlowCanvas';
import { ETLToolbox } from '@/components/automation/node/ETLToolbox';
import { NodeInspector } from '@/components/automation/node/NodeInspector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play, Save, Upload, Download, Sparkles, BarChart3,
  BrainCircuit, GitBranch, Zap, SlidersHorizontal, CheckCircle2,
} from 'lucide-react';
import type { ETLNodeDef } from '@/components/automation/shared/types';
import { useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import type { Connection, Node } from '@xyflow/react';
import { runPipeline, type NodeExecResult } from '@/components/automation/runtime/pipeline-executor';
import { AnalyticsStudio } from '@/components/automation/analytics/analytics-studio';

// ── Custom ETL canvas node ────────────────────────────────────────────────────
function ETLCanvasNode({ data }: { data: Record<string, unknown> }) {
  const cat = (data.category as string) ?? 'transform';
  const CAT_COLORS: Record<string, string> = {
    import:'#3b82f6', preparation:'#8b5cf6', combine:'#06b6d4',
    transform:'#f59e0b', quality:'#10b981', schema:'#6366f1',
    analytics:'#ec4899', publish:'#f97316', control:'#64748b', custom:'#a16207',
  };
  const color = CAT_COLORS[cat] ?? '#64748b';
  const rows = data.rowCount as number | undefined;
  const status = data.execStatus as string | undefined;

  return (
    <div
      className="bg-card border-2 rounded-lg shadow-sm min-w-[140px] transition-all"
      style={{ borderColor: status === 'running' ? '#3b82f6' : status === 'done' ? '#10b981' : color }}
    >
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !border-2 !border-white" style={{ background: color }} />
      <div className="px-3 py-2 rounded-t-[6px]" style={{ background: color }}>
        <p className="text-[10px] font-bold text-white uppercase tracking-wide">{cat}</p>
      </div>
      <div className="px-3 py-2">
        <p className="text-xs font-semibold truncate">{data.label as string}</p>
        {rows != null && (
          <p className="text-[10px] text-emerald-600 font-medium mt-0.5">{rows.toLocaleString()} rows</p>
        )}
        {status === 'running' && <p className="text-[10px] text-blue-500 animate-pulse">Running…</p>}
      </div>
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !border-2 !border-white" style={{ background: color }} />
    </div>
  );
}

const NODE_TYPES = { etlNode: ETLCanvasNode };

// ── Designer Page ─────────────────────────────────────────────────────────────
export default function AutomationDesignerPage() {
  const [tab, setTab] = React.useState<'etl'|'analytics'|'mlops'|'control'>('etl');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selected, setSelected] = React.useState<Node | null>(null);
  const [nodeConfigs, setNodeConfigs] = React.useState<Record<string, Record<string, string>>>({});
  const [execResults, setExecResults] = React.useState<Record<string, NodeExecResult>>({});
  const [runState, setRunState] = React.useState<'idle'|'running'|'done'|'failed'>('idle');

  const onConnect = React.useCallback(
    (c: Connection) => setEdges(eds => addEdge(c, eds)), [setEdges],
  );

  // Drop node from toolbox
  const handleDrop = (def: ETLNodeDef) => {
    const id = `${def.id}-${Date.now()}`;
    setNodes(ns => [...ns, {
      id,
      type: 'etlNode',
      position: { x: 180 + (ns.length % 4) * 180, y: 80 + Math.floor(ns.length / 4) * 120 },
      data: { label: def.label, category: def.category, defId: def.id },
    }]);
  };

  // Node selection
  const handleSelectionChange = React.useCallback(({ nodes: sel }: { nodes: Node[] }) => {
    setSelected(sel[0] ?? null);
  }, []);

  // Label change from inspector
  const handleLabelChange = (label: string) => {
    if (!selected) return;
    setNodes(ns => ns.map(n => n.id === selected.id ? { ...n, data: { ...n.data, label } } : n));
  };

  // Config change from inspector
  const handleConfigChange = (key: string, value: string) => {
    if (!selected) return;
    setNodeConfigs(prev => ({
      ...prev,
      [selected.id]: { ...(prev[selected.id] ?? {}), [key]: value },
    }));
  };

  // Run pipeline
  const handleRun = async () => {
    setRunState('running');
    setExecResults({});
    // Mark all nodes as pending
    setNodes(ns => ns.map(n => ({ ...n, data: { ...n.data, execStatus: 'pending', rowCount: undefined } })));

    const result = await runPipeline(nodes, edges, (r) => {
      setExecResults(prev => ({ ...prev, [r.nodeId]: r }));
      setNodes(ns => ns.map(n => n.id === r.nodeId
        ? { ...n, data: { ...n.data, execStatus: r.status, rowCount: r.rowCount } }
        : n,
      ));
    });

    setRunState(result.status === 'completed' ? 'done' : 'failed');
  };

  const selectedConfig = selected ? (nodeConfigs[selected.id] ?? {}) : {};
  const selectedDefId = selected ? (selected.data as Record<string, unknown>)?.defId as string : null;
  const selectedLabel = selected ? (selected.data as Record<string, unknown>)?.label as string : null;
  const selectedCategory = selected ? (selected.data as Record<string, unknown>)?.category as string : null;
  const selectedRowCount = selected ? (execResults[selected.id]?.rowCount ?? null) : null;

  const doneCount = Object.values(execResults).filter(r => r.status === 'done').length;
  const totalRows = Object.values(execResults).reduce((s, r) => Math.max(s, r.rowCount), 0);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Automation Designer" description="Visual ETL/ELT · Analytics Studio · MLOps · Workflow Control" />
        <main className="flex-1 overflow-hidden flex flex-col p-4 gap-3">

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {nodes.length} nodes · {edges.length} edges
              </Badge>
              {runState === 'running' && (
                <Badge className="bg-blue-500 text-white animate-pulse text-xs">
                  Running {doneCount}/{nodes.length}
                </Badge>
              )}
              {runState === 'done' && (
                <Badge className="bg-emerald-500 text-white text-xs gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Completed · {totalRows.toLocaleString()} rows
                </Badge>
              )}
              {runState === 'failed' && (
                <Badge className="bg-red-500 text-white text-xs">Failed</Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5">
                <Upload className="h-3.5 w-3.5" />Import
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5">
                <Download className="h-3.5 w-3.5" />Export
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5">
                <Save className="h-3.5 w-3.5" />Save
              </Button>
              <Button
                size="sm" className="h-7 text-xs gap-1.5"
                onClick={handleRun}
                disabled={runState === 'running' || nodes.length === 0}
              >
                <Play className="h-3.5 w-3.5" />Run
              </Button>
            </div>
          </div>

          <Tabs value={tab} onValueChange={v => setTab(v as typeof tab)} className="flex-1 flex flex-col min-h-0">
            <TabsList className="h-8 text-xs w-fit">
              <TabsTrigger value="etl"       className="text-xs gap-1.5"><Zap className="h-3 w-3"/>ETL / ELT</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs gap-1.5"><BarChart3 className="h-3 w-3"/>Analytics</TabsTrigger>
              <TabsTrigger value="mlops"     className="text-xs gap-1.5"><BrainCircuit className="h-3 w-3"/>MLOps</TabsTrigger>
              <TabsTrigger value="control"   className="text-xs gap-1.5"><GitBranch className="h-3 w-3"/>Control</TabsTrigger>
            </TabsList>

            {/* ── ETL Canvas ──────────────────────────────────────────────── */}
            <TabsContent value="etl" className="flex-1 min-h-0 mt-2">
              <div className="h-[calc(100vh-13rem)] flex gap-3">

                {/* Node Palette */}
                <div className="w-52 flex-shrink-0 rounded-lg border bg-card overflow-hidden flex flex-col">
                  <div className="px-3 py-2 border-b bg-muted/30">
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <SlidersHorizontal className="h-3.5 w-3.5"/>Node Palette
                    </p>
                  </div>
                  <ETLToolbox onDragStart={handleDrop} />
                </div>

                {/* Canvas */}
                <div className="flex-1 rounded-lg border overflow-hidden">
                  <EnhancedFlowCanvas
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={NODE_TYPES}
                    onSelectionChange={handleSelectionChange}
                    fitView
                    showMiniMap
                    showControls
                    canvasClassName="bg-muted/10"
                  />
                </div>

                {/* Inspector */}
                <div className="w-52 flex-shrink-0 rounded-lg border bg-card flex flex-col overflow-hidden">
                  <div className="px-3 py-2 border-b bg-muted/30 flex-shrink-0">
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5"/>Inspector
                    </p>
                  </div>
                  <NodeInspector
                    nodeId={selected?.id ?? null}
                    nodeType={selectedDefId}
                    nodeLabel={selectedLabel}
                    nodeCategory={selectedCategory}
                    config={selectedConfig}
                    onConfigChange={handleConfigChange}
                    onLabelChange={handleLabelChange}
                    rowCount={selectedRowCount}
                  />
                </div>
              </div>
            </TabsContent>

            {/* ── Analytics Studio ───────────────────────────────────────── */}
            <TabsContent value="analytics" className="flex-1 mt-2 min-h-0 overflow-auto">
              <AnalyticsStudio />
            </TabsContent>

            {/* ── MLOps ──────────────────────────────────────────────────── */}
            <TabsContent value="mlops" className="flex-1 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title:'Model Registry',    desc:'Version and deploy ML models. Track lineage from training to production.' },
                  { title:'Experiment Tracker', desc:'Compare runs, parameters, and metrics. Promote best experiments.' },
                  { title:'Feature Store',      desc:'Curate, share, and reuse features across models and teams.' },
                  { title:'Drift Detector',     desc:'Monitor model performance and data drift in production.' },
                  { title:'Retraining Workflow',desc:'Automated triggers for model retraining based on drift or schedule.' },
                  { title:'Analytics Copilot',  desc:'AI-assisted model selection, hyperparameter tuning suggestions.' },
                ].map(({ title, desc }) => (
                  <Card key={title}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <BrainCircuit className="h-4 w-4 text-primary"/>{title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">{desc}</CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* ── Control ────────────────────────────────────────────────── */}
            <TabsContent value="control" className="flex-1 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title:'Cron Scheduler',   desc:'Schedule pipelines with full cron expression support.' },
                  { title:'Event Trigger',    desc:'Fire workflows on webhooks, queue messages, or file arrivals.' },
                  { title:'Retry Center',     desc:'Configure backoff, max attempts and dead-letter handling.' },
                  { title:'Error Handler',    desc:'Route failures to alert channels or compensating workflows.' },
                  { title:'Parallel Branch',  desc:'Fan-out execution across independent data partitions.' },
                  { title:'Approval Gate',    desc:'Pause pipeline execution until a human approves progression.' },
                ].map(({ title, desc }) => (
                  <Card key={title}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-primary"/>{title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">{desc}</CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

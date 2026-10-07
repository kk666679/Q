'use client';

import * as React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { NodeCatalog } from '@/components/automation/node-catalog/NodeCatalog';
import { EnhancedFlowCanvas } from '@/components/automation/layout/EnhancedFlowCanvas';
import { nodeTypeRegistry } from '@/components/automation/node-catalog/nodeLibrary';
import { ReactFlowProvider, useNodesState, useEdgesState, useReactFlow, type Node, type Edge } from '@xyflow/react';

const DROP_MIME = 'application/automation-node';

const initialNodes: Node[] = [
  {
    id: 'init-1',
    type: 'trigger',
    position: { x: 80, y: 80 },
    data: { event: 'On Start', source: 'manual', label: 'Start Trigger' },
  },
  {
    id: 'init-2',
    type: 'ms-audit',
    position: { x: 80, y: 220 },
    data: { label: 'MS Audit Step', auditType: 'Internal Audit' },
  },
  {
    id: 'init-3',
    type: 'halal-audit',
    position: { x: 80, y: 360 },
    data: { label: 'Halal Audit Step', halalStatus: 'pending' },
  },
  {
    id: 'init-4',
    type: 'gmp-workflow',
    position: { x: 320, y: 80 },
    data: { label: 'GMP Compliance', complianceStatus: 'pending' },
  },
  {
    id: 'init-5',
    type: 'dmaic-phase',
    position: { x: 320, y: 220 },
    data: { label: 'DMAIC Define', dmaikPhase: 'Define' },
  },
  {
    id: 'init-6',
    type: 'slack-connector',
    position: { x: 320, y: 360 },
    data: { label: 'Notify Slack', connectionStatus: 'disconnected' },
  },
];

function CatalogCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState<Edge>([]);
  const reactFlow = useReactFlow();

  const onDragOver = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData(DROP_MIME);
      if (!raw) return;
      let payload: { type?: string; defaultData?: Record<string, unknown> };
      try {
        payload = JSON.parse(raw);
      } catch {
        return;
      }
      const type = payload?.type;
      if (!type || typeof type !== 'string') return;
      const position = reactFlow.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      setNodes((prev) => [
        ...prev,
        { id: crypto.randomUUID(), type, position, data: payload.defaultData ?? {} } as Node,
      ]);
    },
    [reactFlow, setNodes]
  );

  return (
    <div className="flex flex-1 min-h-0 gap-3">
      <div className="w-72 rounded-lg border bg-card overflow-hidden flex flex-col">
        <NodeCatalog draggable className="h-full flex flex-col" />
      </div>
      <div
        className="flex-1 rounded-lg border overflow-hidden"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <EnhancedFlowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange as any}
          onEdgesChange={onEdgesChange as any}
          nodeTypes={nodeTypeRegistry}
          fitView
          showControls
          showMiniMap
          showBackground
          backgroundColor="#f3f4f6"
          canvasClassName="bg-muted/10"
        />
      </div>
    </div>
  );
}

export default function NodeCatalogDemoPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Node Catalog" description="Browse, search and drag nodes onto the canvas" />
        <main className="flex-1 overflow-hidden flex flex-col p-4">
          <ReactFlowProvider>
            <CatalogCanvas />
          </ReactFlowProvider>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

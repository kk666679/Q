'use client';

import * as React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppHeader } from '@/components/sidebar/app-header';
import { NodeCatalog } from '@/components/automation/node-catalog/NodeCatalog';
import { EnhancedFlowCanvas } from '@/components/automation/layout/EnhancedFlowCanvas';
import { nodeTypeRegistry } from '@/components/automation/node-catalog/nodeLibrary';

import { useNodesState, useEdgesState, type Node, type Edge, useReactFlow } from '@xyflow/react';

const DROP_MIME = 'application/automation-node';


export default function NodeCatalogDemoPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onDragOver = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const raw = event.dataTransfer.getData(DROP_MIME);
      if (!raw) return;

      let payload: any;
      try {
        payload = JSON.parse(raw);
      } catch {
        return;
      }

      const type = payload?.type;
      const defaultData = payload?.defaultData ?? {};
      if (!type || typeof type !== 'string') return;

      const reactFlow = useReactFlow();
      const position = reactFlow.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });


      setNodes((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type,
          position,
          data: defaultData,
        } as Node,
      ]);
    },
    [setNodes]
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Node Catalog" description="Demo page for automation node registry" />
        <main className="flex-1 overflow-hidden flex flex-col p-4">
          <div className="flex flex-1 min-h-0 gap-3">
            <div className="w-80 rounded-lg border bg-card overflow-hidden">
              <NodeCatalog draggable />
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
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


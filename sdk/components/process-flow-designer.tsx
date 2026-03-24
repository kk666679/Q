'use client';

import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useCreateProcess, useUpdateProcess } from '../client/hooks';
import type { Process, ProcessNode as QMSProcessNode, ProcessEdge } from '../types';

const nodeTypes = {
  start: 'input',
  end: 'output',
  task: 'default',
  decision: 'default',
  subprocess: 'group',
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 25 },
  },
];

const initialEdges: Edge[] = [];

interface ProcessFlowDesignerProps {
  process?: Process;
  onSave?: (process: Process) => void;
  readOnly?: boolean;
}

export function ProcessFlowDesigner({ 
  process, 
  onSave, 
  readOnly = false 
}: ProcessFlowDesignerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    process?.nodes as Node[] || initialNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    process?.edges as Edge[] || initialEdges
  );
  const [selectedNodeType, setSelectedNodeType] = useState<string>('task');
  const [processName, setProcessName] = useState(process?.name || '');
  const [processDescription, setProcessDescription] = useState(process?.description || '');

  const createProcessMutation = useCreateProcess();
  const updateProcessMutation = useUpdateProcess();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = useCallback(() => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: nodeTypes[selectedNodeType as keyof typeof nodeTypes] || 'default',
      data: { 
        label: `${selectedNodeType.charAt(0).toUpperCase() + selectedNodeType.slice(1)} ${nodes.length + 1}`,
        nodeType: selectedNodeType,
      },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [nodes.length, selectedNodeType, setNodes]);

  const saveProcess = useCallback(async () => {
    const processData = {
      name: processName,
      description: processDescription,
      nodes: nodes as any,
      edges: edges as any,
    };

    try {
      if (process?.id) {
        await updateProcessMutation.mutateAsync({
          id: process.id,
          data: processData,
        });
      } else {
        await createProcessMutation.mutateAsync(processData);
      }
      onSave?.(processData as Process);
    } catch (error) {
      console.error('Failed to save process:', error);
    }
  }, [
    processName,
    processDescription,
    nodes,
    edges,
    process?.id,
    updateProcessMutation,
    createProcessMutation,
    onSave,
  ]);

  const validateProcess = useCallback(() => {
    const hasStart = nodes.some(node => node.type === 'input');
    const hasEnd = nodes.some(node => node.type === 'output');
    const allNodesConnected = nodes.every(node => 
      edges.some(edge => edge.source === node.id || edge.target === node.id)
    );

    return {
      valid: hasStart && hasEnd && allNodesConnected,
      issues: [
        ...(!hasStart ? ['Missing start node'] : []),
        ...(!hasEnd ? ['Missing end node'] : []),
        ...(!allNodesConnected ? ['Some nodes are not connected'] : []),
      ],
    };
  }, [nodes, edges]);

  const validation = validateProcess();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      {!readOnly && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Process Designer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Process Name</label>
                <input
                  type="text"
                  value={processName}
                  onChange={(e) => setProcessName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter process name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={processDescription}
                  onChange={(e) => setProcessDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter description"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Node Type</label>
                <select
                  value={selectedNodeType}
                  onChange={(e) => setSelectedNodeType(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="start">Start</option>
                  <option value="end">End</option>
                  <option value="task">Task</option>
                  <option value="decision">Decision</option>
                  <option value="subprocess">Subprocess</option>
                </select>
              </div>
              <Button onClick={addNode} className="mt-6">
                Add Node
              </Button>
              <Button 
                onClick={saveProcess} 
                className="mt-6"
                disabled={createProcessMutation.isPending || updateProcessMutation.isPending}
              >
                Save Process
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={validation.valid ? 'default' : 'destructive'}>
                {validation.valid ? 'Valid' : 'Invalid'}
              </Badge>
              {validation.issues.length > 0 && (
                <span className="text-sm text-red-600">
                  Issues: {validation.issues.join(', ')}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex-1 border rounded-lg overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodesDraggable={!readOnly}
          nodesConnectable={!readOnly}
          elementsSelectable={!readOnly}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </motion.div>
  );
}
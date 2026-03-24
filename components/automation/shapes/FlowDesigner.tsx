/**
 * FlowDesigner Component
 * 
 * Main flowchart designer with React Flow.
 * Features:
 * - Drag and drop shapes from sidebar
 * - Custom shape nodes with different types
 * - Color editing via toolbar
 * - MiniMap with shape preview
 * - Controls and background
 * 
 * Uses @xyflow/react (React Flow) for the canvas.
 */

"use client";

import React, { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Panel,
  ReactFlowProvider,
  Node,
  Edge,
  BackgroundVariant,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ShapeNode, shapeNodeType, ShapeNodeData } from './ShapeNode';
import { Sidebar } from './Sidebar';
import { ColorToolbar } from './ColorToolbar';
import { ShapeType } from './Shape';

// Define custom node types
type FlowNode = Node<ShapeNodeData>;
type FlowEdge = Edge;

// Define node types for React Flow
const nodeTypes = {
  [shapeNodeType]: ShapeNode,
};

// Initial nodes with sample flowchart
const initialNodes: FlowNode[] = [
  {
    id: '1',
    type: shapeNodeType,
    position: { x: 100, y: 200 },
    data: {
      type: 'circle',
      color: '#dcfce7',
      label: 'Start',
    },
  },
  {
    id: '2',
    type: shapeNodeType,
    position: { x: 300, y: 180 },
    data: {
      type: 'parallelogram',
      color: '#dbeafe',
      label: 'Input: Order',
    },
  },
  {
    id: '3',
    type: shapeNodeType,
    position: { x: 500, y: 180 },
    data: {
      type: 'rectangle',
      color: '#fef9c3',
      label: 'Validate Order',
    },
  },
  {
    id: '4',
    type: shapeNodeType,
    position: { x: 700, y: 180 },
    data: {
      type: 'diamond',
      color: '#fce7f3',
      label: 'Is Valid?',
    },
  },
  {
    id: '5',
    type: shapeNodeType,
    position: { x: 900, y: 100 },
    data: {
      type: 'hexagon',
      color: '#ffedd5',
      label: 'Quality Check',
    },
  },
  {
    id: '6',
    type: shapeNodeType,
    position: { x: 900, y: 280 },
    data: {
      type: 'rectangle',
      color: '#fee2e2',
      label: 'Reject Order',
    },
  },
  {
    id: '7',
    type: shapeNodeType,
    position: { x: 1100, y: 180 },
    data: {
      type: 'rounded-rectangle',
      color: '#e0e7ff',
      label: 'Process Order',
    },
  },
  {
    id: '8',
    type: shapeNodeType,
    position: { x: 1300, y: 180 },
    data: {
      type: 'circle',
      color: '#f3e8ff',
      label: 'End',
    },
  },
];

// Initial edges
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-3', source: '2', target: '3', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3-4', source: '3', target: '4', markerEnd: { type: MarkerType.ArrowClosed } },
  { 
    id: 'e4-5', 
    source: '4', 
    sourceHandle: 'bottom',
    target: '5', 
    label: 'Yes',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#22c55e' },
  },
  { 
    id: 'e4-6', 
    source: '4', 
    sourceHandle: 'right',
    target: '6', 
    label: 'No',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#ef4444' },
  },
  { id: 'e5-7', source: '5', target: '7', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e7-8', source: '7', target: '8', markerEnd: { type: MarkerType.ArrowClosed } },
];

// Custom MiniMap node color function
const getMinimapNodeColor = (node: Node) => {
  const data = node.data as ShapeNodeData;
  return data?.color || '#dbeafe';
};

function FlowDesignerInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Get selected node data
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedNodeData = selectedNode?.data as ShapeNodeData | undefined;

  // Handle connection
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `e-${params.source}-${params.target}`,
        markerEnd: { type: MarkerType.ArrowClosed },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Handle drag over
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/shape-type') as ShapeType;
      if (!type) return;

      // Get position
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left - 75,
        y: event.clientY - reactFlowBounds.top - 40,
      };

      // Create new node
      const newNode: Node<ShapeNodeData> = {
        id: `node-${Date.now()}`,
        type: shapeNodeType,
        position,
        data: {
          type,
          color: '#dbeafe',
          label: type.charAt(0).toUpperCase() + type.slice(1),
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  // Handle color change
  const handleColorChange = useCallback(
    (color: string) => {
      if (!selectedNodeId) return;
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNodeId) {
            return {
              ...node,
              data: { ...node.data, color },
            };
          }
          return node;
        })
      );
    },
    [selectedNodeId, setNodes]
  );

  // Handle label change
  const handleLabelChange = useCallback(
    (label: string) => {
      if (!selectedNodeId) return;
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNodeId) {
            return {
              ...node,
              data: { ...node.data, label },
            };
          }
          return node;
        })
      );
    },
    [selectedNodeId, setNodes]
  );

  // Handle delete
  const handleDelete = useCallback(() => {
    if (!selectedNodeId) return;
    setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId)
    );
    setSelectedNodeId(null);
  }, [selectedNodeId, setNodes, setEdges]);

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Flowchart Designer</h1>
            <p className="text-sm text-gray-500">Create professional flowcharts with custom shapes</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {nodes.length} nodes • {edges.length} connections
            </span>
          </div>
        </div>
      </header>

      {/* Color Toolbar */}
      <ColorToolbar
        selectedNodeId={selectedNodeId}
        currentColor={selectedNodeData?.color || '#dbeafe'}
        onColorChange={handleColorChange}
        onDelete={selectedNodeId ? handleDelete : undefined}
        onLabelChange={handleLabelChange}
        currentLabel={selectedNodeData?.label || ''}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Canvas */}
        <div ref={reactFlowWrapper} className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.1}
            maxZoom={2}
            defaultEdgeOptions={{
              type: 'smoothstep',
              style: { strokeWidth: 2 },
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" />
            <Controls className="!bg-white !border-gray-200 !shadow-lg" />
            <MiniMap
              nodeColor={getMinimapNodeColor}
              maskColor="rgba(236, 72, 153, 0.1)"
              className="!bg-white !border !border-gray-200 !shadow-lg"
            />
            <Panel position="top-right" className="!bg-white/90 !backdrop-blur !border !border-gray-200 !rounded-lg !p-3 !m-4 !shadow-lg">
              <div className="text-xs space-y-1">
                <div className="font-medium text-gray-700 mb-2">Legend</div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-200 border border-green-400"></div>
                  <span className="text-gray-600">Start/End</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 bg-yellow-200 border border-yellow-400"></div>
                  <span className="text-gray-600">Process</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rotate-45 bg-pink-200 border border-pink-400"></div>
                  <span className="text-gray-600">Decision</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 bg-orange-200 border border-orange-400"></div>
                  <span className="text-gray-600">Checkpoint</span>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

// Main FlowDesigner component with provider
export function FlowDesigner() {
  return (
    <ReactFlowProvider>
      <FlowDesignerInner />
    </ReactFlowProvider>
  );
}

export default FlowDesigner;


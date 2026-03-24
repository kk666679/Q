/**
 * Custom React Flow Hooks
 * 
 * Reusable hooks for common React Flow operations:
 * - Auto-layout with dagre
 * - Node/edge operations
 * - Viewport management
 * - Selection handling
 * - Undo/redo
 */

"use client";

import { useCallback, useState, useRef, useEffect } from 'react';
import { 
  useReactFlow,
  useOnSelectionChange,
  type Node,
  type Edge,
  type XYPosition,
  type FitViewOptions,
} from '@xyflow/react';
import dagre from 'dagre';

// ============================================================================
// Auto Layout Hook
// ============================================================================

export interface UseAutoLayoutOptions {
  direction?: 'TB' | 'LR' | 'RL' | 'BT';
  nodeSpacing?: number;
  rankSpacing?: number;
}

export function useAutoLayout(options: UseAutoLayoutOptions = {}) {
  const { direction = 'TB', nodeSpacing = 100, rankSpacing = 150 } = options;
  const { getNodes, getEdges, setNodes } = useReactFlow();

  const applyLayout = useCallback(() => {
    const nodes = getNodes();
    const edges = getEdges();

    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ 
      rankdir: direction, 
      nodesep: nodeSpacing, 
      ranksep: rankSpacing 
    });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { 
        width: node.width || 180, 
        height: node.height || 80 
      });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - (node.width || 180) / 2,
          y: nodeWithPosition.y - (node.height || 80) / 2,
        },
      };
    });

    setNodes(layoutedNodes);
  }, [direction, nodeSpacing, rankSpacing, getNodes, getEdges, setNodes]);

  return { applyLayout };
}

// ============================================================================
// Node Operations Hook
// ============================================================================

export function useNodeOperations() {
  const { getNodes, setNodes, addNodes, deleteElements } = useReactFlow();

  const addNode = useCallback((node: Partial<Node> & { id: string; position: XYPosition }) => {
    const newNode: Node = {
      type: 'default',
      data: {},
      ...node,
    };
    addNodes([newNode]);
    return newNode;
  }, [addNodes]);

  const updateNode = useCallback((nodeId: string, updates: Partial<Node>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      )
    );
  }, [setNodes]);

  const updateNodeData = useCallback((nodeId: string, data: Record<string, any>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId 
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    );
  }, [setNodes]);

  const deleteNode = useCallback((nodeId: string) => {
    deleteElements({ nodes: [{ id: nodeId }] });
  }, [deleteElements]);

  const deleteSelectedNodes = useCallback(() => {
    const selectedNodes = getNodes().filter(n => n.selected);
    if (selectedNodes.length > 0) {
      deleteElements({ nodes: selectedNodes });
    }
  }, [getNodes, deleteElements]);

  const duplicateNode = useCallback((nodeId: string) => {
    const node = getNodes().find(n => n.id === nodeId);
    if (!node) return;

    const newNode: Node = {
      ...node,
      id: `${node.id}-copy-${Date.now()}`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
      selected: false,
    };
    addNodes([newNode]);
    return newNode;
  }, [getNodes, addNodes]);

  return {
    addNode,
    updateNode,
    updateNodeData,
    deleteNode,
    deleteSelectedNodes,
    duplicateNode,
  };
}

// ============================================================================
// Selection Hook
// ============================================================================

export interface SelectionState {
  nodes: Node[];
  edges: Edge[];
  hasSelection: boolean;
  nodeCount: number;
  edgeCount: number;
}

export function useSelection() {
  const [selection, setSelection] = useState<SelectionState>({
    nodes: [],
    edges: [],
    hasSelection: false,
    nodeCount: 0,
    edgeCount: 0,
  });

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      setSelection({
        nodes,
        edges,
        hasSelection: nodes.length > 0 || edges.length > 0,
        nodeCount: nodes.length,
        edgeCount: edges.length,
      });
    },
  });

  return selection;
}

// ============================================================================
// Viewport Hook
// ============================================================================

export function useViewportOperations() {
  const { fitView, zoomIn, zoomOut, setViewport, getViewport, getNode } = useReactFlow();

  const fitToView = useCallback((options?: FitViewOptions) => {
    fitView({ padding: 0.2, duration: 800, ...options });
  }, [fitView]);

  const zoomToNode = useCallback((nodeId: string) => {
    const node = getNode(nodeId);
    if (node) {
      setViewport(
        { 
          x: -node.position.x + window.innerWidth / 2, 
          y: -node.position.y + window.innerHeight / 2, 
          zoom: 1.5 
        },
        { duration: 800 }
      );
    }
  }, [setViewport, getNode]);

  const resetViewport = useCallback(() => {
    setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 800 });
  }, [setViewport]);

  return {
    fitToView,
    zoomIn,
    zoomOut,
    zoomToNode,
    resetViewport,
  };
}

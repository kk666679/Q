/**
 * MiniMap Node Component
 * 
 * Custom MiniMap component for React Flow canvas.
 * Provides a minimap overview of the flow for easy navigation.
 * 
 * @param nodeColor - Function to determine color of each node
 * @param maskColor - Color of the mask around the minimap
 * @param className - Additional CSS classes
 */

"use client";

import React from 'react';
import { MiniMap, Node } from '@xyflow/react';

interface MiniMapNodeProps {
  nodeColor?: (node: Node) => string;
  maskColor?: string;
  className?: string;
  pannable?: boolean;
  zoomable?: boolean;
}

export function MiniMapNode({
  nodeColor,
  maskColor = 'rgba(236, 72, 153, 0.1)',
  className = '',
  pannable = true,
  zoomable = false
}: MiniMapNodeProps) {
  // Default node color function if not provided
  const getNodeColor = (node: Node): string => {
    if (nodeColor) {
      return nodeColor(node);
    }
    // Default colors based on node type or data
    const data = node.data as Record<string, unknown>;
    return (data?.color as string) || '#dbeafe';
  };

  return (
    <MiniMap
      nodeColor={getNodeColor}
      maskColor={maskColor}
      className={className}
      pannable={pannable}
      zoomable={zoomable}
    />
  );
}

export default MiniMapNode;


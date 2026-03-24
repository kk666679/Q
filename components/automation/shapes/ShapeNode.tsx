/**
 * ShapeNode Component
 * 
 * Custom React Flow node that renders shapes using the Shape component.
 * Supports drag, connect, select, and color editing.
 * 
 * @param data - Node data containing shape type, color, and label
 * @param selected - Whether the node is currently selected
 */

"use client";

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Shape, ShapeType } from './Shape';

export interface ShapeNodeData {
  type: ShapeType;
  color: string;
  label: string;
  onColorChange?: (nodeId: string, color: string) => void;
  [key: string]: unknown;
}

// ShapeNode component
export function ShapeNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as ShapeNodeData;
  
  // Determine handle positions based on shape type
  const getHandlePositions = () => {
    switch (nodeData.type) {
      case 'diamond':
      case 'hexagon':
      case 'triangle':
        return {
          target: { top: true },
          source: { bottom: true }
        };
      case 'circle':
        return {
          target: { left: true },
          source: { right: true }
        };
      default:
        return {
          target: { left: true },
          source: { right: true }
        };
    }
  };

  const handles = getHandlePositions();

  return (
    <div 
      className={`relative ${selected ? 'ring-2 ring-violet-500 ring-offset-2' : ''}`}
      role="button"
      aria-label={`${nodeData.type} node: ${nodeData.label}`}
      tabIndex={0}
    >
      {/* Target Handle (Top) */}
      {handles.target.top && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !bg-gray-600 !border-2 !border-white hover:!bg-violet-500 transition-colors"
          aria-label="Input handle"
        />
      )}

      {/* Target Handle (Left) */}
      {handles.target.left && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-gray-600 !border-2 !border-white hover:!bg-violet-500 transition-colors"
          aria-label="Input handle"
        />
      )}

      {/* Shape */}
      <Shape
        type={nodeData.type}
        color={nodeData.color}
        label={nodeData.label}
        selected={selected}
      />

      {/* Source Handle (Bottom) */}
      {handles.source.bottom && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !bg-gray-600 !border-2 !border-white hover:!bg-violet-500 transition-colors"
          aria-label="Output handle"
        />
      )}

      {/* Source Handle (Right) */}
      {handles.source.right && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-gray-600 !border-2 !border-white hover:!bg-violet-500 transition-colors"
          aria-label="Output handle"
        />
      )}
    </div>
  );
}

// Node type configuration
export const shapeNodeType = 'shape';


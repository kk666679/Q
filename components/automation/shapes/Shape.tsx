/**
 * Shape Component
 * 
 * Renders different SVG shapes based on the type parameter.
 * Used by ShapeNode to render various flowchart shapes.
 * 
 * @param type - Shape type: circle, rectangle, diamond, hexagon, triangle, cylinder, parallelogram, rounded-rectangle
 * @param color - Fill color for the shape
 * @param label - Text label to display
 * @param selected - Whether the node is selected (for focus ring)
 */

"use client";

import React from 'react';

export type ShapeType = 'circle' | 'rectangle' | 'diamond' | 'hexagon' | 'triangle' | 'cylinder' | 'parallelogram' | 'rounded-rectangle';

interface ShapeProps {
  type: ShapeType;
  color: string;
  label: string;
  selected?: boolean;
  width?: number;
  height?: number;
}

// Shape dimensions
const SHAPE_CONFIG = {
  width: 150,
  height: 80,
};

export function Shape({ type, color, label, selected = false, width = SHAPE_CONFIG.width, height = SHAPE_CONFIG.height }: ShapeProps) {
  // Generate SVG path based on shape type
  const getShapePath = (): string => {
    switch (type) {
      case 'circle':
        return `
          M ${width / 2} 10
          A ${width / 2 - 10} ${height / 2 - 10} 0 1 1 ${width / 2} ${height - 10}
          A ${width / 2 - 10} ${height / 2 - 10} 0 1 1 ${width / 2} 10
        `;
      
      case 'rectangle':
        return `
          M 10 10
          L ${width - 10} 10
          L ${width - 10} ${height - 10}
          L 10 ${height - 10}
          Z
        `;
      
      case 'diamond':
        return `
          M ${width / 2} 5
          L ${width - 5} ${height / 2}
          L ${width / 2} ${height - 5}
          L 5 ${height / 2}
          Z
        `;
      
      case 'hexagon':
        return `
          M ${width * 0.25} 10
          L ${width * 0.75} 10
          L ${width - 10} ${height / 2}
          L ${width * 0.75} ${height - 10}
          L ${width * 0.25} ${height - 10}
          L 10 ${height / 2}
          Z
        `;
      
      case 'triangle':
        return `
          M ${width / 2} 10
          L ${width - 10} ${height - 10}
          L 10 ${height - 10}
          Z
        `;
      
      case 'cylinder':
        return `
          M 10 ${height * 0.2}
          L 10 ${height - 15}
          A ${width / 2 - 10} 10 0 0 0 ${width - 10} ${height - 15}
          L ${width - 10} ${height * 0.2}
          A ${width / 2 - 10} 10 0 0 0 10 ${height * 0.2}
        `;
      
      case 'parallelogram':
        return `
          M 30 10
          L ${width - 10} 10
          L ${width - 30} ${height - 10}
          L 10 ${height - 10}
          Z
        `;
      
      case 'rounded-rectangle':
        return `
          M 20 10
          L ${width - 20} 10
          A 10 10 0 0 1 ${width - 10} 20
          L ${width - 10} ${height - 20}
          A 10 10 0 0 1 ${width - 20} ${height - 10}
          L 20 ${height - 10}
          A 10 10 0 0 1 10 ${height - 20}
          L 10 20
          A 10 10 0 0 1 20 10
          Z
        `;
      
      default:
        return '';
    }
  };

  // Get stroke color based on selection
  const strokeColor = selected ? '#8b5cf6' : '#6b7280';
  const strokeWidth = selected ? 3 : 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-label={`${type} shape: ${label}`}
      role="img"
    >
      {/* Shape fill */}
      <path
        d={getShapePath()}
        fill={color}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        className="transition-all duration-200"
      />
      
      {/* Label text */}
      <text
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#1f2937"
        fontSize="12"
        fontWeight="500"
        className="pointer-events-none"
      >
        {label.length > 15 ? `${label.substring(0, 15)}...` : label}
      </text>
    </svg>
  );
}

// Export shape types for use in other components
export const SHAPE_TYPES: { type: ShapeType; label: string; description: string }[] = [
  { type: 'circle', label: 'Circle', description: 'Start/End points' },
  { type: 'rectangle', label: 'Rectangle', description: 'Process steps' },
  { type: 'diamond', label: 'Diamond', description: 'Decision points' },
  { type: 'hexagon', label: 'Hexagon', description: 'Control checkpoints' },
  { type: 'triangle', label: 'Triangle', description: 'Data/merge points' },
  { type: 'cylinder', label: 'Cylinder', description: 'Database/storage' },
  { type: 'parallelogram', label: 'Parallelogram', description: 'Input/Output' },
  { type: 'rounded-rectangle', label: 'Rounded', description: 'Sub-processes' },
];

// Color options for nodes
export const NODE_COLORS = [
  { name: 'Blue', value: '#dbeafe', border: '#3b82f6' },
  { name: 'Green', value: '#dcfce7', border: '#22c55e' },
  { name: 'Yellow', value: '#fef9c3', border: '#eab308' },
  { name: 'Red', value: '#fee2e2', border: '#ef4444' },
  { name: 'Purple', value: '#f3e8ff', border: '#a855f7' },
  { name: 'Pink', value: '#fce7f3', border: '#ec4899' },
  { name: 'Orange', value: '#ffedd5', border: '#f97316' },
  { name: 'Cyan', value: '#cffafe', border: '#06b6d4' },
];


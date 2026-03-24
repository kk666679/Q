/**
 * Sidebar Component
 * 
 * Left sidebar with draggable shape buttons for the flowchart designer.
 * Users can drag shapes from the sidebar onto the canvas.
 * 
 * @param onDragStart - Callback when drag starts with shape type
 */

"use client";

import React from 'react';
import { SHAPE_TYPES, ShapeType } from './Shape';

interface SidebarProps {
  onDragStart?: (type: ShapeType) => void;
}

export function Sidebar({ onDragStart }: SidebarProps) {
  // Handle drag start event
  const handleDragStart = (event: React.DragEvent, type: ShapeType) => {
    event.dataTransfer.setData('application/shape-type', type);
    event.dataTransfer.effectAllowed = 'move';
    onDragStart?.(type);
  };

  // Get icon for each shape type
  const getShapeIcon = (type: ShapeType) => {
    switch (type) {
      case 'circle':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
      case 'rectangle':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <rect x="3" y="5" width="18" height="14" rx="1" />
          </svg>
        );
      case 'diamond':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <polygon points="12,2 22,12 12,22 2,12" />
          </svg>
        );
      case 'hexagon':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" />
          </svg>
        );
      case 'triangle':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <polygon points="12,3 21,20 3,20" />
          </svg>
        );
      case 'cylinder':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <ellipse cx="12" cy="5" rx="8" ry="3" />
            <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
          </svg>
        );
      case 'parallelogram':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <polygon points="8,3 21,3 16,21 3,21" />
          </svg>
        );
      case 'rounded-rectangle':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <rect x="3" y="5" width="18" height="14" rx="4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Shapes</h2>
        <p className="text-sm text-gray-500 mt-1">
          Drag shapes onto the canvas
        </p>
      </div>

      {/* Shape Buttons */}
      <div className="space-y-3">
        {SHAPE_TYPES.map((shape) => (
          <div
            key={shape.type}
            draggable
            onDragStart={(e) => handleDragStart(e, shape.type)}
            className="flex items-center gap-3 p-3 bg-white border-2 border-gray-200 rounded-lg cursor-grab hover:border-violet-400 hover:shadow-md transition-all active:cursor-grabbing group"
            role="button"
            aria-label={`Drag ${shape.label} shape`}
            tabIndex={0}
          >
            {/* Shape Icon */}
            <div className="w-10 h-10 flex items-center justify-center text-gray-600 group-hover:text-violet-600 transition-colors">
              {getShapeIcon(shape.type)}
            </div>
            
            {/* Shape Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm">{shape.label}</p>
              <p className="text-xs text-gray-500 truncate">{shape.description}</p>
            </div>
            
            {/* Drag Indicator */}
            <div className="text-gray-400 group-hover:text-violet-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 text-sm mb-2">How to use</h3>
        <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
          <li>Drag a shape from above</li>
          <li>Drop it on the canvas</li>
          <li>Connect shapes by dragging handles</li>
          <li>Click a shape to edit its label</li>
        </ol>
      </div>
    </aside>
  );
}


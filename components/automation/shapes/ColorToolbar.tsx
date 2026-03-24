/**
 * ColorToolbar Component
 * 
 * Toolbar for editing the color of selected nodes.
 * Displays when a node is selected.
 * 
 * @param selectedNodeId - ID of the currently selected node
 * @param currentColor - Current color of the selected node
 * @param onColorChange - Callback when color changes
 * @param onDelete - Callback when delete is clicked
 */

"use client";

import React from 'react';
import { NODE_COLORS } from './Shape';

interface ColorToolbarProps {
  selectedNodeId: string | null;
  currentColor: string;
  onColorChange: (color: string) => void;
  onDelete?: () => void;
  onLabelChange?: (label: string) => void;
  currentLabel?: string;
}

export function ColorToolbar({ 
  selectedNodeId, 
  currentColor, 
  onColorChange, 
  onDelete,
  currentLabel = ''
}: ColorToolbarProps) {
  if (!selectedNodeId) {
    return (
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <p className="text-sm text-gray-500 text-center">
          Select a node to edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Label Edit */}
        <div className="flex-1 max-w-xs">
          <label htmlFor="node-label" className="block text-xs font-medium text-gray-700 mb-1">
            Label
          </label>
          <input
            id="node-label"
            type="text"
            value={currentLabel}
            onChange={(e) => onLabelChange?.(e.target.value)}
            placeholder="Enter label..."
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>

        {/* Color Picker */}
        <div>
          <span className="block text-xs font-medium text-gray-700 mb-1">Color</span>
          <div className="flex gap-1">
            {NODE_COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => onColorChange(color.value)}
                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                  currentColor === color.value 
                    ? 'border-violet-500 ring-2 ring-violet-200' 
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color.value }}
                aria-label={`Set color to ${color.name}`}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={onDelete}
            className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}


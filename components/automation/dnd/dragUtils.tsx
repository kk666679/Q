
/**
 * DND Utilities for Automation Components
 * 
 * Drag and drop utilities for the automation flow designer.
 */

"use client";

import type { Node, Edge, Connection } from '@xyflow/react';

export interface DragData {
  type: string;
  nodeType?: string;
  label?: string;
  color?: string;
}

export type DropEffect = 'copy' | 'move' | 'link' | 'none';

export const createShapeDragData = (shapeType: string): DragData => ({
  type: 'shape',
  nodeType: shapeType,
  label: shapeType.charAt(0).toUpperCase() + shapeType.slice(1),
  color: '#dbeafe',
});

export const getDragData = (event: DragEvent | React.DragEvent): DragData | null => {
  const data = event.dataTransfer?.getData('application/json');
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return null;
};

export const setDragData = (event: DragEvent | React.DragEvent, data: DragData): void => {
  event.dataTransfer?.setData('application/json', JSON.stringify(data));
  event.dataTransfer!.effectAllowed = 'move';
};

export const DRAG_MIME_TYPES = {
  SHAPE_TYPE: 'application/shape-type',
  NODE_DATA: 'application/node-data',
  JSON: 'application/json',
} as const;

export const isValidDropTarget = (event: DragEvent | React.DragEvent): boolean => {
  const target = event.target as HTMLElement;
  return !target.closest('[data-no-drop]');
};

export const getDropPosition = (
  event: DragEvent | React.DragEvent,
  container: HTMLElement
): { x: number; y: number } => {
  const rect = container.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};

export const createDragHandlers = (
  onDragStart?: (type: string) => void,
  onDragEnd?: () => void
) => ({
  onDragStart: (event: React.DragEvent, type: string) => {
    event.dataTransfer.setData('application/shape-type', type);
    event.dataTransfer.effectAllowed = 'move';
    onDragStart?.(type);
  },
  onDragEnd: () => {
    onDragEnd?.();
  },
});

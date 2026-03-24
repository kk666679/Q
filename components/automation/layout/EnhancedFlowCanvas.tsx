/**
 * Enhanced Flow Canvas Component
 * 
 * Production-ready React Flow canvas with all features:
 * - Background patterns
 * - Controls (zoom, fit view)
 * - MiniMap with custom colors
 * - Panels for custom UI
 * - Keyboard shortcuts
 * - Selection handling
 * - Viewport management
 */

"use client";

import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  Panel,
  BackgroundVariant,
  type ReactFlowProps,
  type Node,
  type PanelPosition,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

export interface EnhancedFlowCanvasProps extends Omit<ReactFlowProps, 'children'> {
  // Background
  showBackground?: boolean;
  backgroundVariant?: BackgroundVariant;
  backgroundGap?: number;
  backgroundSize?: number;
  backgroundColor?: string;
  
  // Controls
  showControls?: boolean;
  controlsPosition?: PanelPosition;
  
  // MiniMap
  showMiniMap?: boolean;
  miniMapPosition?: PanelPosition;
  miniMapNodeColor?: string | ((node: Node) => string);
  
  // Panels
  topLeftPanel?: ReactNode;
  topRightPanel?: ReactNode;
  bottomLeftPanel?: ReactNode;
  bottomRightPanel?: ReactNode;
  
  // Styling
  canvasClassName?: string;
}

export function EnhancedFlowCanvas({
  // Background props
  showBackground = true,
  backgroundVariant = BackgroundVariant.Dots,
  backgroundGap = 20,
  backgroundSize = 1,
  backgroundColor = '#e5e7eb',
  
  // Controls props
  showControls = true,
  controlsPosition = 'bottom-left',
  
  // MiniMap props
  showMiniMap = false,
  miniMapPosition = 'bottom-right',
  miniMapNodeColor = '#ec4899',
  
  // Panel props
  topLeftPanel,
  topRightPanel,
  bottomLeftPanel,
  bottomRightPanel,
  
  // Styling
  canvasClassName,
  className,
  
  // ReactFlow props
  ...reactFlowProps
}: EnhancedFlowCanvasProps) {
  return (
    <ReactFlow
      className={cn('h-full w-full', canvasClassName, className)}
      deleteKeyCode={['Backspace', 'Delete']}
      multiSelectionKeyCode="Shift"
      panOnScroll
      selectionOnDrag
      fitView
      {...reactFlowProps}
    >
      {/* Background */}
      {showBackground && (
        <Background 
          variant={backgroundVariant}
          gap={backgroundGap}
          size={backgroundSize}
          color={backgroundColor}
        />
      )}
      
      {/* Controls */}
      {showControls && (
        <Controls 
          position={controlsPosition}
          showZoom
          showFitView
          showInteractive
        />
      )}
      
      {/* MiniMap */}
      {showMiniMap && (
        <MiniMap 
          position={miniMapPosition}
          nodeColor={miniMapNodeColor}
          maskColor="rgba(236, 72, 153, 0.1)"
          pannable
          zoomable
        />
      )}
      
      {/* Custom Panels */}
      {topLeftPanel && (
        <Panel position="top-left">{topLeftPanel}</Panel>
      )}
      {topRightPanel && (
        <Panel position="top-right">{topRightPanel}</Panel>
      )}
      {bottomLeftPanel && (
        <Panel position="bottom-left">{bottomLeftPanel}</Panel>
      )}
      {bottomRightPanel && (
        <Panel position="bottom-right">{bottomRightPanel}</Panel>
      )}
    </ReactFlow>
  );
}

/**
 * Automation Canvas Components
 * 
 * Enhanced ReactFlow canvas components for automation workflows.
 * Uses @xyflow/react (React Flow 12+) core components.
 */

"use client";

import { 
  ReactFlow, 
  Background, 
  BackgroundVariant, 
  Controls, 
  MiniMap, 
  Panel,
  ReactFlowProvider,
  useReactFlow,
  type ReactFlowProps,
  type Node,
  type Edge,
  type Connection,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type NodeChange,
  type EdgeChange,
  type MarkerType,
  type Viewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";
import { memo } from "react";

// Re-export types for convenience
export type { ReactFlowProps, Node, Edge, Connection, OnNodesChange, OnEdgesChange, OnConnect, NodeChange, EdgeChange, MarkerType, Viewport };

// Base Canvas Component
export type AutomationCanvasProps = ReactFlowProps & {
  showBackground?: boolean;
  showControls?: boolean;
  showMiniMap?: boolean;
  backgroundVariant?: BackgroundVariant;
  backgroundColor?: string;
};

const AutomationBackground = memo(({ 
  variant = BackgroundVariant.Dots, 
  color = "var(--sidebar)",
  gap = 20,
  size = 1
}: Partial<ComponentProps<typeof Background>>) => (
  <Background 
    variant={variant} 
    color={color} 
    gap={gap} 
    size={size} 
  />
));

AutomationBackground.displayName = "AutomationBackground";

const AutomationMiniMap = memo(({ 
  nodeColor = "#EC4899",
  maskColor = "rgba(236, 72, 153, 0.1)"
}: Partial<ComponentProps<typeof MiniMap>>) => (
  <MiniMap 
    nodeColor={nodeColor}
    maskColor={maskColor}
    pannable
    zoomable
  />
));

AutomationMiniMap.displayName = "AutomationMiniMap";

export const AutomationCanvas = ({
  children,
  showBackground = true,
  showControls = true,
  showMiniMap = false,
  backgroundVariant = BackgroundVariant.Dots,
  backgroundColor = "var(--sidebar)",
  className,
  ...props
}: AutomationCanvasProps) => {
  return (
    <ReactFlow
      deleteKeyCode={["Backspace", "Delete"]}
      fitView
      panOnScroll
      selectionOnDrag={true}
      zoomOnDoubleClick={false}
      className={cn("h-full w-full", className)}
      {...props}
    >
      {showBackground && (
        <AutomationBackground 
          variant={backgroundVariant} 
          color={backgroundColor}
        />
      )}
      {children}
      {showControls && <Controls />}
      {showMiniMap && <AutomationMiniMap />}
    </ReactFlow>
  );
};

export type AutomationControlsProps = ComponentProps<typeof Controls> & {
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
};

export const AutomationControls = memo(({
  className,
  showZoom = true,
  showFitView = true,
  showInteractive = true,
  ...props
}: AutomationControlsProps) => (
  <Controls
    className={cn("gap-1", className)}
    showZoom={showZoom}
    showFitView={showFitView}
    showInteractive={showInteractive}
    {...props}
  />
));

AutomationControls.displayName = "AutomationControls";

export type AutomationPanelProps = ComponentProps<typeof Panel> & {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

export const AutomationPanel = ({
  children,
  className,
  position = "top-left",
  ...props
}: AutomationPanelProps) => {
  return (
    <Panel position={position as any}>
      <div className={className} {...props}>
        {children}
      </div>
    </Panel>
  );
};

export type AutomationSidebarProps = ComponentProps<"div"> & {
  title?: string;
  children: ReactNode;
};

export const AutomationSidebar = memo(({
  className,
  title,
  children,
  ...props
}: AutomationSidebarProps) => (
  <div
    className={cn(
      "flex flex-col rounded-lg border bg-card shadow-sm",
      className
    )}
    {...props}
  >
    {title && (
      <div className="border-b px-4 py-3 font-semibold">
        {title}
      </div>
    )}
    <div className="flex-1 overflow-auto p-4">
      {children}
    </div>
  </div>
));

AutomationSidebar.displayName = "AutomationSidebar";

export type AutomationToolsPanelProps = ComponentProps<"div"> & {
  categories?: {
    label: string;
    items: Array<{
      type: string;
      label: string;
      icon?: ReactNode;
    }>;
  }[];
};

export const AutomationToolsPanel = memo(({
  className,
  categories,
  children,
  ...props
}: AutomationToolsPanelProps) => (
  <div
    className={cn(
      "flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

AutomationToolsPanel.displayName = "AutomationToolsPanel";

// Re-export from @xyflow/react for convenience
export { 
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Panel,
  Controls,
  Background,
  MiniMap,
} from "@xyflow/react";


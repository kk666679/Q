/**
 * Automation Edge Components
 * 
 * Enhanced edge components for automation workflows
 * Leverages @xyflow/react from ai-elements
 */

"use client";

import { Connection } from "@/components/ai-elements/connection";
import { 
  getBezierPath, 
  getSmoothStepPath,
  getStraightPath,
  BaseEdge as XYBaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
} from "@xyflow/react";
import { cn } from "@/lib/utils";
import { memo, type ReactNode } from "react";
import { AnimatedSVGEdge } from "./animatedEdge";

// ============================================================================
// Standard Connection Line
// ============================================================================

export const AutomationConnection = Connection;

// ============================================================================
// Label Container Component
// ============================================================================

const LabelContainer = ({ 
  label, 
  labelX, 
  labelY 
}: { 
  label: ReactNode; 
  labelX: number; 
  labelY: number 
}) => (
  <EdgeLabelRenderer>
    <div
      style={{
        position: "absolute",
        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
        pointerEvents: "all",
      }}
      className="nodrag nopan"
    >
      {label}
    </div>
  </EdgeLabelRenderer>
);

// ============================================================================
// Standard Bezier Edge
// ============================================================================

export const AutomationEdge = memo((props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
  } = props;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <XYBaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: "var(--primary)",
          strokeWidth: 2,
          ...style,
        }}
        markerEnd={markerEnd}
      />
      {data?.label && (
        <LabelContainer 
          label={<div className="px-2 py-1 text-xs bg-card border rounded-md shadow-sm">{String(data.label)}</div>}
          labelX={labelX}
          labelY={labelY}
        />
      )}
    </>
  );
});

AutomationEdge.displayName = "AutomationEdge";

// ============================================================================
// Animated Flow Edge
// ============================================================================

export const AnimatedFlowEdge = memo((props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
  } = props;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {/* Glow effect */}
      <path
        d={edgePath}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={6}
        opacity={0.2}
        style={{ filter: "blur(4px)" }}
      />
      
      {/* Main path */}
      <path
        d={edgePath}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={2}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeDasharray: "5 5",
        }}
      />
      
      {/* Animated circle */}
      <circle r="4" fill="var(--primary)">
        <animateMotion
          dur="2s"
          path={edgePath}
          repeatCount="indefinite"
        />
      </circle>

      {data?.label && (
        <LabelContainer 
          label={<div className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md shadow-md">{String(data.label)}</div>}
          labelX={labelX}
          labelY={labelY}
        />
      )}
    </>
  );
});

AnimatedFlowEdge.displayName = "AnimatedFlowEdge";

// ============================================================================
// Step Edge (Smooth Step)
// ============================================================================

export const StepEdge = memo((props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
  } = props;

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 20,
  });

  return (
    <XYBaseEdge
      id={id}
      path={edgePath}
      style={{
        stroke: "var(--muted-foreground)",
        strokeWidth: 2,
        ...style,
      }}
      markerEnd={markerEnd}
    />
  );
});

StepEdge.displayName = "StepEdge";

// ============================================================================
// Straight Edge
// ============================================================================

export const StraightEdge = memo((props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    style = {},
    markerEnd,
    data,
  } = props;

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <XYBaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: "var(--muted-foreground)",
          strokeWidth: 2,
          ...style,
        }}
        markerEnd={markerEnd}
      />
      {data?.label && (
        <LabelContainer 
          label={<div className="px-2 py-1 text-xs bg-card border rounded-md shadow-sm">{String(data.label)}</div>}
          labelX={labelX}
          labelY={labelY}
        />
      )}
    </>
  );
});

StraightEdge.displayName = "StraightEdge";

// ============================================================================
// Status Edge - Changes color based on status
// ============================================================================

export type StatusEdgeData = {
  status?: "idle" | "running" | "success" | "error";
  label?: string;
};

export const StatusEdge = memo((props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
  } = props;

  const statusColors = {
    idle: "var(--muted-foreground)",
    running: "#3B82F6",
    success: "#22C55E",
    error: "#EF4444",
  };

  const status = (data as StatusEdgeData)?.status || "idle";
  const color = statusColors[status];

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <XYBaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: color,
          strokeWidth: 2,
          ...style,
        }}
        markerEnd={markerEnd}
      />
      {(data as StatusEdgeData)?.label && (
        <LabelContainer 
          label={<div className="px-2 py-1 text-xs rounded-md shadow-sm" style={{ backgroundColor: color, color: "white" }}>{(data as StatusEdgeData).label}</div>}
          labelX={labelX}
          labelY={labelY}
        />
      )}
    </>
  );
});

StatusEdge.displayName = "StatusEdge";

// ============================================================================
// Conditional Edge - Shows branching
// ============================================================================

export type ConditionalEdgeData = {
  condition?: string;
  branch?: "true" | "false";
};

export const ConditionalEdge = memo((props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
  } = props;

  const branch = (data as ConditionalEdgeData)?.branch;
  const isTrue = branch === "true";
  
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 10,
  });

  const color = isTrue ? "#22C55E" : "#EF4444";

  return (
    <>
      <XYBaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: color,
          strokeWidth: 2,
          ...style,
        }}
        markerEnd={markerEnd}
      />
      <LabelContainer 
        label={<div className={cn("px-2 py-1 text-xs rounded-full font-medium", isTrue ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>{isTrue ? "Yes" : "No"}</div>}
        labelX={labelX}
        labelY={labelY}
      />
    </>
  );
});

ConditionalEdge.displayName = "ConditionalEdge";

// ============================================================================
// Dashed Edge - For pending connections
// ============================================================================

export const DashedEdge = memo((props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
  } = props;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <XYBaseEdge
      id={id}
      path={edgePath}
      style={{
        stroke: "var(--muted-foreground)",
        strokeWidth: 2,
        strokeDasharray: "5 5",
        ...style,
      }}
      markerEnd={markerEnd}
    />
  );
});

DashedEdge.displayName = "DashedEdge";

// ============================================================================
// Thick Edge - For important connections
// ============================================================================

export const ThickEdge = memo((props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    selected,
  } = props;

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 20,
  });

  return (
    <>
      {/* Shadow on selection */}
      {selected && (
        <path
          d={edgePath}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={10}
          opacity={0.3}
          style={{ filter: "blur(6px)" }}
        />
      )}
      <XYBaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? "var(--primary)" : "var(--ring)",
          strokeWidth: selected ? 4 : 3,
          ...style,
        }}
        markerEnd={markerEnd}
      />
    </>
  );
});

ThickEdge.displayName = "ThickEdge";

// ============================================================================
// Export all edge types
// ============================================================================

export const automationEdgeTypes = {
  automation: AutomationEdge,
  animated: AnimatedFlowEdge,
  animatedSVG: AnimatedSVGEdge,
  step: StepEdge,
  straight: StraightEdge,
  status: StatusEdge,
  conditional: ConditionalEdge,
  dashed: DashedEdge,
  thick: ThickEdge,
};

// Export utilities from @xyflow/react
export {
  Connection,
  EdgeLabelRenderer,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  XYBaseEdge as BaseEdge,
};
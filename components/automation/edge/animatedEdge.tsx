/**
 * Animated SVG Edge Component
 * 
 * An edge component that animates a circle along the path using SVG animation.
 * Provides visual feedback for flow direction in automation workflows.
 */

"use client";

import React, { memo } from "react";
import { 
  EdgeProps, 
  getSmoothStepPath,
  BaseEdge,
} from "@xyflow/react";

// ============================================================================
// Animated SVG Edge
// ============================================================================

/**
 * An edge component that displays an animated circle traveling along the edge path.
 * Uses SVG animateMotion for smooth animation along the smooth step path.
 * 
 * @param id - Unique edge identifier
 * @param sourceX - Source node X position
 * @param sourceY - Source node Y position
 * @param targetX - Target node X position
 * @param targetY - Target node Y position
 * @param sourcePosition - Source position (top, right, bottom, left)
 * @param targetPosition - Target position (top, right, bottom, left)
 */
export const AnimatedSVGEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <circle r="10" fill="#ff0073">
        <animateMotion 
          dur="2s" 
          repeatCount="indefinite" 
          path={edgePath} 
        />
      </circle>
    </>
  );
});

AnimatedSVGEdge.displayName = "AnimatedSVGEdge";

// ============================================================================
// Animated SVG Edge with Customizable Color
// ============================================================================

export type AnimatedSVGEdgeData = {
  color?: string;
  circleRadius?: number;
  duration?: string;
};

export const AnimatedSVGEdgeWithOptions = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeData = data as AnimatedSVGEdgeData | undefined;
  const color = edgeData?.color || "#ff0073";
  const radius = edgeData?.circleRadius || 10;
  const duration = edgeData?.duration || "2s";

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <circle r={radius} fill={color}>
        <animateMotion 
          dur={duration} 
          repeatCount="indefinite" 
          path={edgePath} 
        />
      </circle>
    </>
  );
});

AnimatedSVGEdgeWithOptions.displayName = "AnimatedSVGEdgeWithOptions";

// ============================================================================
// Export all animated edge types
// ============================================================================

export const animatedEdgeTypes = {
  animatedSVG: AnimatedSVGEdge,
  animatedSVGWithOptions: AnimatedSVGEdgeWithOptions,
};


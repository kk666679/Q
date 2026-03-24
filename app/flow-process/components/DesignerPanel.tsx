/**
 * Designer Panel Component
 * 
 * Right sidebar panel for designer settings (edge types, layout, viewport).
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { 
  LayoutList, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  LucideIcon
} from "lucide-react";

export interface DesignerPanelProps {
  /** Current edge type selection */
  selectedEdgeType?: string;
  /** Callback when edge type changes */
  onEdgeTypeChange?: (type: string) => void;
  /** Current layout direction */
  layoutDirection?: "TB" | "LR";
  /** Callback when layout direction changes */
  onLayoutDirectionChange?: (direction: "TB" | "LR") => void;
  /** Callback for fit to view */
  onFitToView?: () => void;
  /** Callback for zoom in */
  onZoomIn?: () => void;
  /** Callback for zoom out */
  onZoomOut?: () => void;
  /** Callback for auto layout */
  onAutoLayout?: () => void;
  /** Additional className */
  className?: string;
}

const edgeTypes = [
  { id: "smoothstep", label: "Smooth" },
  { id: "animated", label: "Animated" },
  { id: "step", label: "Step" },
  { id: "dashed", label: "Dashed" },
  { id: "straight", label: "Straight" },
  { id: "conditional", label: "Conditional" },
];

export function DesignerPanel({
  selectedEdgeType = "smoothstep",
  onEdgeTypeChange,
  layoutDirection = "TB",
  onLayoutDirectionChange,
  onFitToView,
  onZoomIn,
  onZoomOut,
  onAutoLayout,
  className,
}: DesignerPanelProps) {
  return (
    <div className={`p-4 space-y-6 overflow-y-auto h-full ${className}`}>
      {/* Edge Type Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Edge Type</h3>
        <div className="flex gap-2 flex-wrap">
          {edgeTypes.map((edge) => (
            <Button
              key={edge.id}
              size="sm"
              variant={selectedEdgeType === edge.id ? "default" : "outline"}
              onClick={() => onEdgeTypeChange?.(edge.id)}
              className="text-xs"
            >
              {edge.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Layout Direction Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Layout Direction</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={layoutDirection === "TB" ? "default" : "outline"}
            onClick={() => onLayoutDirectionChange?.("TB")}
            className="flex-1"
          >
            Top-Bottom
          </Button>
          <Button
            size="sm"
            variant={layoutDirection === "LR" ? "default" : "outline"}
            onClick={() => onLayoutDirectionChange?.("LR")}
            className="flex-1"
          >
            Left-Right
          </Button>
        </div>
      </div>

      {/* Viewport Controls Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Viewport</h3>
        <div className="space-y-2">
          <Button
            size="sm"
            variant="outline"
            className="w-full justify-start"
            onClick={onFitToView}
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            Fit View
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full justify-start"
            onClick={onZoomIn}
          >
            <ZoomIn className="h-4 w-4 mr-2" />
            Zoom In
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full justify-start"
            onClick={onZoomOut}
          >
            <ZoomOut className="h-4 w-4 mr-2" />
            Zoom Out
          </Button>
        </div>
      </div>

      {/* Auto Layout */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Auto Layout</h3>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={onAutoLayout}
        >
          <LayoutList className="h-4 w-4 mr-2" />
          Apply Auto Layout
        </Button>
      </div>
    </div>
  );
}

export default DesignerPanel;


/**
 * Properties Panel Component
 * 
 * Right sidebar panel for viewing and editing selected node properties.
 */

"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers, Info, Settings, Trash2, Copy, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PropertiesPanelProps {
  /** ID of the currently selected node */
  selectedNodeId?: string | null;
  /** Node data to display */
  nodeData?: Record<string, any>;
  /** Callback when node data changes */
  onNodeDataChange?: (nodeId: string, data: Record<string, any>) => void;
  /** Callback when delete is clicked */
  onDelete?: (nodeId: string) => void;
  /** Callback when duplicate is clicked */
  onDuplicate?: (nodeId: string) => void;
  /** Additional className */
  className?: string;
}

export function PropertiesPanel({
  selectedNodeId,
  nodeData = {},
  onNodeDataChange,
  onDelete,
  onDuplicate,
  className,
}: PropertiesPanelProps) {
  if (!selectedNodeId) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full p-4 text-center", className)}>
        <Layers className="h-12 w-12 text-muted-foreground/30 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">No Node Selected</p>
        <p className="text-xs text-muted-foreground mt-1">
          Select a node to view and edit its properties.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("p-4 overflow-y-auto h-full", className)}>
      {/* Node Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Node Properties</span>
        </div>
        <Badge variant="outline">{selectedNodeId}</Badge>
      </div>

      {/* Node Data Fields */}
      <div className="space-y-4">
        {Object.entries(nodeData).map(([key, value]) => {
          if (key.startsWith("on") || typeof value === "function") return null;
          
          return (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="text-xs text-muted-foreground capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </Label>
              {typeof value === "boolean" ? (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={key}
                    checked={value}
                    onChange={(e) => onNodeDataChange?.(selectedNodeId, { [key]: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm">{value ? "Enabled" : "Disabled"}</span>
                </div>
              ) : typeof value === "number" ? (
                <Input
                  id={key}
                  type="number"
                  value={value}
                  onChange={(e) => onNodeDataChange?.(selectedNodeId, { [key]: Number(e.target.value) })}
                />
              ) : Array.isArray(value) ? (
                <Textarea
                  id={key}
                  value={JSON.stringify(value, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      onNodeDataChange?.(selectedNodeId, { [key]: parsed });
                    } catch {}
                  }}
                  rows={3}
                />
              ) : typeof value === "object" ? (
                <Textarea
                  id={key}
                  value={JSON.stringify(value, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      onNodeDataChange?.(selectedNodeId, { [key]: parsed });
                    } catch {}
                  }}
                  rows={4}
                />
              ) : (
                <Input
                  id={key}
                  value={String(value)}
                  onChange={(e) => onNodeDataChange?.(selectedNodeId, { [key]: e.target.value })}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-6 pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onDuplicate?.(selectedNodeId)}
        >
          <Copy className="h-4 w-4 mr-1" />
          Duplicate
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={() => onDelete?.(selectedNodeId)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="h-3 w-3" />
          <span>Edit properties directly above</span>
        </div>
      </div>
    </div>
  );
}

export default PropertiesPanel;


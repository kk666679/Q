/**
 * Automation Node Components
 * 
 * Enhanced node components for automation workflows
 * Leverages @xyflow/react from ai-elements
 */

"use client";

import {
  Node,
  NodeHeader,
  NodeTitle,
  NodeDescription,
  NodeAction,
  NodeContent,
  NodeFooter,
  type NodeProps,
} from "@/components/ai-elements/node";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";
import { memo } from "react";

// ============================================================================
// Base Automation Nodes
// ============================================================================

export type AutomationNodeProps = NodeProps & {
  variant?: "default" | "compact" | "expanded";
  status?: "idle" | "running" | "success" | "error";
};

export const AutomationNode = memo(({
  handles,
  className,
  variant = "default",
  status = "idle",
  children,
  ...props
}: AutomationNodeProps) => {
  const statusStyles = {
    idle: "border-border",
    running: "border-blue-400 animate-pulse",
    success: "border-green-400",
    error: "border-red-400",
  };

  return (
    <Node
      handles={handles}
      className={cn(
        "transition-all duration-200",
        statusStyles[status],
        variant === "compact" && "w-48",
        variant === "expanded" && "w-80",
        className
      )}
      {...props}
    >
      {children}
    </Node>
  );
});

AutomationNode.displayName = "AutomationNode";

// ============================================================================
// Task Node - Represents a task in the automation workflow
// ============================================================================

export type TaskNodeData = {
  title: string;
  description?: string;
  status?: "pending" | "running" | "completed" | "failed";
  assignee?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  tags?: string[];
};

export type TaskNodeProps = NodeProps & {
  data: TaskNodeData;
};

export const TaskNode = memo(({ data, selected }: TaskNodeProps) => {
  const priorityColors = {
    low: "bg-blue-100 text-blue-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  const statusColors = {
    pending: "bg-gray-100 text-gray-700",
    running: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <Node handles={{ target: true, source: true }} className={cn(selected && "ring-2 ring-primary")}>
      <NodeHeader>
        <div className="flex items-center justify-between w-full">
          <NodeTitle>{data.title}</NodeTitle>
          {data.priority && (
            <span className={cn("text-xs px-2 py-0.5 rounded-full", priorityColors[data.priority])}>
              {data.priority}
            </span>
          )}
        </div>
        {data.description && <NodeDescription>{data.description}</NodeDescription>}
      </NodeHeader>
      <NodeContent>
        <div className="space-y-2">
          {data.assignee && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Assignee: {data.assignee}</span>
            </div>
          )}
          {data.dueDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Due: {data.dueDate}</span>
            </div>
          )}
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {data.tags.map((tag, index) => (
                <span key={index} className="text-xs bg-muted px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </NodeContent>
      <NodeFooter>
        <span className={cn("text-xs px-2 py-1 rounded-full", statusColors[data.status || "pending"])}>
          {data.status || "pending"}
        </span>
      </NodeFooter>
    </Node>
  );
});

TaskNode.displayName = "TaskNode";

// ============================================================================
// Condition Node - Represents a branching condition
// ============================================================================

export type ConditionNodeData = {
  condition: string;
  trueLabel?: string;
  falseLabel?: string;
};

export type ConditionNodeProps = NodeProps & {
  data: ConditionNodeData;
};

export const ConditionNode = memo(({ data, selected }: ConditionNodeProps) => {
  return (
    <Node handles={{ target: true, source: true }} className={cn(selected && "ring-2 ring-primary")}>
      <Handle type="source" position={Position.Right} id="true" className="!bg-green-500" />
      <Handle type="source" position={Position.Bottom} id="false" className="!bg-red-500" />
      
      <NodeHeader>
        <NodeTitle>Condition</NodeTitle>
      </NodeHeader>
      <NodeContent>
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium">{data.condition}</p>
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span className="text-green-600">{data.trueLabel || "True"} →</span>
          <span className="text-red-600">↓ {data.falseLabel || "False"}</span>
        </div>
      </NodeContent>
    </Node>
  );
});

ConditionNode.displayName = "ConditionNode";

// ============================================================================
// Action Node - Represents an automated action
// ============================================================================

export type ActionNodeData = {
  action: string;
  provider?: string;
  status?: "idle" | "running" | "success" | "error";
  result?: string;
};

export type ActionNodeProps = NodeProps & {
  data: ActionNodeData;
};

export const ActionNode = memo(({ data, selected }: ActionNodeProps) => {
  const statusColors = {
    idle: "border-border",
    running: "border-blue-400",
    success: "border-green-400",
    error: "border-red-400",
  };

  return (
    <Node 
      handles={{ target: true, source: true }} 
      className={cn(
        selected && "ring-2 ring-primary",
        statusColors[data.status || "idle"]
      )}
    >
      <NodeHeader>
        <NodeTitle>Action</NodeTitle>
        {data.provider && <NodeDescription>{data.provider}</NodeDescription>}
      </NodeHeader>
      <NodeContent>
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium">{data.action}</p>
        </div>
        {data.result && (
          <p className="mt-2 text-xs text-muted-foreground">{data.result}</p>
        )}
      </NodeContent>
    </Node>
  );
});

ActionNode.displayName = "ActionNode";

// ============================================================================
// Trigger Node - Represents a workflow trigger
// ============================================================================

export type TriggerNodeData = {
  event: string;
  source?: string;
  config?: Record<string, any>;
};

export type TriggerNodeProps = NodeProps & {
  data: TriggerNodeData;
};

export const TriggerNode = memo(({ data, selected }: TriggerNodeProps) => {
  return (
    <Node handles={{ target: false, source: true }} className={cn(selected && "ring-2 ring-primary")}>
      <NodeHeader className="bg-primary/10">
        <NodeTitle>Trigger</NodeTitle>
        {data.source && <NodeDescription>{data.source}</NodeDescription>}
      </NodeHeader>
      <NodeContent>
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm font-medium">{data.event}</p>
        </div>
      </NodeContent>
    </Node>
  );
});

TriggerNode.displayName = "TriggerNode";

// ============================================================================
// End Node - Represents workflow completion
// ============================================================================

export type EndNodeData = {
  result?: string;
  summary?: string;
};

export type EndNodeProps = NodeProps & {
  data: EndNodeData;
};

export const EndNode = memo(({ data, selected }: EndNodeProps) => {
  return (
    <Node handles={{ target: true, source: false }} className={cn(selected && "ring-2 ring-primary")}>
      <NodeHeader className="bg-green-50">
        <NodeTitle className="text-green-700">Complete</NodeTitle>
      </NodeHeader>
      <NodeContent>
        {data.result && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm">{data.result}</p>
          </div>
        )}
        {data.summary && (
          <p className="mt-2 text-xs text-muted-foreground">{data.summary}</p>
        )}
      </NodeContent>
    </Node>
  );
});

EndNode.displayName = "EndNode";

// ============================================================================
// Group Node - Container for grouping nodes
// ============================================================================

export type GroupNodeData = {
  title: string;
  description?: string;
  color?: string;
};

export type GroupNodeProps = NodeProps & {
  data: GroupNodeData;
};

export const GroupNode = memo(({ data, selected, style }: GroupNodeProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border-2 border-dashed p-4 transition-all",
        selected ? "border-primary" : "border-muted-foreground/30",
        "bg-muted/20"
      )}
      style={{ ...style, minHeight: "200px" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div 
          className="w-4 h-4 rounded" 
          style={{ backgroundColor: data.color || "#EC4899" }} 
        />
        <h3 className="font-semibold">{data.title}</h3>
      </div>
      {data.description && (
        <p className="text-sm text-muted-foreground">{data.description}</p>
      )}
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
    </div>
  );
});

GroupNode.displayName = "GroupNode";

// ============================================================================
// Wait Node - Represents a delay in the workflow
// ============================================================================

export type WaitNodeData = {
  duration: number;
  unit: "seconds" | "minutes" | "hours" | "days";
};

export type WaitNodeProps = NodeProps & {
  data: WaitNodeData;
};

export const WaitNode = memo(({ data, selected }: WaitNodeProps) => {
  return (
    <Node handles={{ target: true, source: true }} className={cn(selected && "ring-2 ring-primary")}>
      <NodeHeader>
        <NodeTitle>Wait</NodeTitle>
      </NodeHeader>
      <NodeContent>
        <div className="flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{data.duration}</p>
            <p className="text-sm text-muted-foreground">{data.unit}</p>
          </div>
        </div>
      </NodeContent>
    </Node>
  );
});

WaitNode.displayName = "WaitNode";

// ============================================================================
// SubWorkflow Node - Represents a nested workflow
// ============================================================================

export type SubWorkflowNodeData = {
  name: string;
  description?: string;
  inputCount?: number;
  outputCount?: number;
};

export type SubWorkflowNodeProps = NodeProps & {
  data: SubWorkflowNodeData;
};

export const SubWorkflowNode = memo(({ data, selected }: SubWorkflowNodeProps) => {
  return (
    <Node handles={{ target: true, source: true }} className={cn(selected && "ring-2 ring-primary")}>
      <NodeHeader className="bg-purple-50">
        <NodeTitle className="text-purple-700">Sub-Workflow</NodeTitle>
        {data.description && <NodeDescription>{data.description}</NodeDescription>}
      </NodeHeader>
      <NodeContent>
        <div className="space-y-2">
          <p className="font-medium">{data.name}</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            {data.inputCount !== undefined && <span>Inputs: {data.inputCount}</span>}
            {data.outputCount !== undefined && <span>Outputs: {data.outputCount}</span>}
          </div>
        </div>
      </NodeContent>
    </Node>
  );
});

SubWorkflowNode.displayName = "SubWorkflowNode";

// ============================================================================
// Export all nodes
// ============================================================================

export const automationNodeTypes = {
  task: TaskNode,
  condition: ConditionNode,
  action: ActionNode,
  trigger: TriggerNode,
  end: EndNode,
  group: GroupNode,
  wait: WaitNode,
  subWorkflow: SubWorkflowNode,
};

export {
  Node,
  NodeHeader,
  NodeTitle,
  NodeDescription,
  NodeAction,
  NodeContent,
  NodeFooter,
  Handle,
  Position,
};

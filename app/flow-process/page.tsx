/**
 * Flow Process Designer Page
 * 
 * Main workflow designer page with full features including AI assistant.
 * Uses shared FlowDesigner component for consistent architecture.
 */

"use client";

import React from "react";
import { FlowDesigner } from "./components";

// Default workflow nodes
const initialNodes = [
  { 
    id: "trigger-1", 
    type: "trigger", 
    position: { x: 100, y: 200 }, 
    data: { event: "Order Received", source: "Webhook" }
  },
  { 
    id: "task-1", 
    type: "task", 
    position: { x: 350, y: 180 }, 
    data: { title: "Validate Order", description: "Check order details", status: "pending", priority: "high" }
  },
  { 
    id: "condition-1", 
    type: "condition", 
    position: { x: 600, y: 180 }, 
    data: { condition: "Is valid?", trueLabel: "Yes", falseLabel: "No" }
  },
  { 
    id: "action-1", 
    type: "action", 
    position: { x: 850, y: 100 }, 
    data: { action: "Process Payment", provider: "Stripe", status: "idle" }
  },
  { 
    id: "action-2", 
    type: "action", 
    position: { x: 850, y: 280 }, 
    data: { action: "Send Rejection", provider: "Email", status: "idle" }
  },
  { 
    id: "wait-1", 
    type: "wait", 
    position: { x: 1100, y: 180 }, 
    data: { duration: 24, unit: "hours" }
  },
  { 
    id: "end-1", 
    type: "end", 
    position: { x: 1350, y: 180 }, 
    data: { result: "Order Complete", summary: "Successfully processed" }
  },
];

const initialEdges = [
  { id: "e1", source: "trigger-1", target: "task-1", type: "smoothstep", markerEnd: { type: "arrowclosed" as const } },
  { id: "e2", source: "task-1", target: "condition-1", type: "smoothstep", markerEnd: { type: "arrowclosed" as const } },
  { id: "e3", source: "condition-1", sourceHandle: "true", target: "action-1", type: "conditional", data: { branch: "true" }, markerEnd: { type: "arrowclosed" as const }, style: { stroke: "#22c55e" } },
  { id: "e4", source: "condition-1", sourceHandle: "false", target: "action-2", type: "conditional", data: { branch: "false" }, markerEnd: { type: "arrowclosed" as const }, style: { stroke: "#ef4444" } },
  { id: "e5", source: "action-1", target: "wait-1", type: "animated", markerEnd: { type: "arrowclosed" as const } },
  { id: "e6", source: "wait-1", target: "end-1", type: "smoothstep", markerEnd: { type: "arrowclosed" as const } },
];

// Workflow execution handler
async function handleWorkflowExecute(nodes: any[], edges: any[]) {
  console.log("Executing workflow:", { nodes, edges });
  
  // In a real implementation, this would:
  // 1. Find trigger nodes
  // 2. Execute the workflow graph
  // 3. Handle branching (conditions)
  // 4. Return results
  
  // Simulate execution
  for (const node of nodes) {
    console.log(`Executing node: ${node.id} (${node.type})`);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log("Workflow execution complete!");
}

export default function FlowDesignerPage() {
  return (
    <FlowDesigner
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      enableAI={true}
      leftSidebarCollapsible={true}
      rightSidebarCollapsible={true}
      defaultEdgeType="smoothstep"
      defaultShowMinimap={true}
      defaultShowControls={true}
      workflowName="Flow Process Designer"
      onWorkflowExecute={handleWorkflowExecute}
      onWorkflowSave={(nodes, edges) => {
        console.log("Saving workflow:", { nodes, edges });
      }}
      onWorkflowExport={(nodes, edges) => {
        console.log("Exporting workflow:", { nodes, edges });
      }}
      onWorkflowImport={(data) => {
        console.log("Importing workflow:", data);
      }}
    />
  );
}

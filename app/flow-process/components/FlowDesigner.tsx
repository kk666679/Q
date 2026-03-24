/**
 * Flow Designer Component
 * 
 * Core shared flow designer component used by both the main flow-process page
 * and the enhanced page. Provides workflow creation, visualization, execution,
 * and AI assistance capabilities.
 */

"use client";

import React, { useState, useCallback, useRef, useMemo } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
  type Node,
  type Edge,
  type OnConnect,
  MarkerType,
  BackgroundVariant,
} from "@xyflow/react";

// Automation components
import { EnhancedFlowCanvas } from "@/components/automation/canvas/EnhancedFlowCanvas";
import {
  useAutoLayout,
  useNodeOperations,
  useSelection,
  useViewportOperations,
} from "@/components/automation/hooks";

// Node types
import {
  TaskNode,
  ConditionNode,
  ActionNode,
  TriggerNode,
  EndNode,
  WaitNode,
  GroupNode,
  SubWorkflowNode,
  type TaskNodeData,
  type ConditionNodeData,
  type ActionNodeData,
  type TriggerNodeData,
  type EndNodeData,
  type GroupNodeData,
  type WaitNodeData,
  type SubWorkflowNodeData,
} from "@/components/automation/node/AutomationNodes";

// Custom node types
import {
  EnhancedEmployeeNode,
  DepartmentGroupNode,
  CompactCardNode,
  CircularNode,
  DiamondNode,
  HexagonNode,
  StadiumNode,
  AnnotationNode,
  MetricCardNode,
} from "@/components/automation/node/CustomNodes";

// Edge types
import {
  AnimatedFlowEdge,
  StepEdge,
  StatusEdge,
  ConditionalEdge,
  DashedEdge,
} from "@/components/automation/edge/automationEdge";

// Shape node
import { ShapeNode, type ShapeNodeData } from "@/components/automation/shapes/ShapeNode";

// UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Layers,
  Play,
  Workflow,
  Database,
  GitBranch,
  LayoutGrid,
  LayoutList,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  Table2,
  Zap,
  CheckCircle2,
  Clock,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Sparkles,
  Send,
  Save,
  Download,
  Upload,
  Trash2,
  Copy,
  Settings,
} from "lucide-react";

// Local components
import { CollapsibleSidebar } from "./CollapsibleSidebar";
import { NodeLibrary, type NodeLibraryItem } from "./NodeLibrary";
import { DesignerPanel } from "./DesignerPanel";
import { PropertiesPanel } from "./PropertiesPanel";
import { AIPanel, type WorkflowMessage } from "./AIPanel";

// Flow types
export type FlowNode = Node<
  | ShapeNodeData
  | TaskNodeData
  | ConditionNodeData
  | ActionNodeData
  | TriggerNodeData
  | EndNodeData
  | GroupNodeData
  | WaitNodeData
  | SubWorkflowNodeData
>;

export interface FlowDesignerProps {
  /** Initial nodes to display */
  initialNodes?: FlowNode[];
  /** Initial edges to display */
  initialEdges?: Edge[];
  /** Enable AI assistant */
  enableAI?: boolean;
  /** Left sidebar collapsible */
  leftSidebarCollapsible?: boolean;
  /** Right sidebar collapsible */
  rightSidebarCollapsible?: boolean;
  /** Default edge type */
  defaultEdgeType?: string;
  /** Show minimap by default */
  defaultShowMinimap?: boolean;
  /** Show controls by default */
  defaultShowControls?: boolean;
  /** Workflow name */
  workflowName?: string;
  /** Workflow description */
  workflowDescription?: string;
  /** Callback when workflow executes */
  onWorkflowExecute?: (nodes: FlowNode[], edges: Edge[]) => Promise<void>;
  /** Callback when workflow is saved */
  onWorkflowSave?: (nodes: FlowNode[], edges: Edge[]) => void;
  /** Callback when workflow is exported */
  onWorkflowExport?: (nodes: FlowNode[], edges: Edge[]) => void;
  /** Callback when workflow is imported */
  onWorkflowImport?: (data: { nodes: FlowNode[]; edges: Edge[] }) => void;
}

// Default node library
const getDefaultNodeLibrary = (): NodeLibraryItem[] => [
  // Shapes
  { type: "circle", label: "Circle", category: "shapes", icon: <div className="w-4 h-4 rounded-full bg-green-400" />, data: { type: "circle", color: "#22c55e", label: "Circle" } },
  { type: "rectangle", label: "Rectangle", category: "shapes", icon: <div className="w-5 h-4 bg-amber-400 rounded" />, data: { type: "rectangle", color: "#f59e0b", label: "Rectangle" } },
  { type: "diamond", label: "Diamond", category: "shapes", icon: <div className="w-4 h-4 rotate-45 bg-violet-400" />, data: { type: "diamond", color: "#8b5cf6", label: "Diamond" } },
  { type: "triangle", label: "Triangle", category: "shapes", icon: <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] bg-transparent" style={{ borderBottomColor: '#f97316' }} />, data: { type: "triangle", color: "#f97316", label: "Triangle" } },
  { type: "hexagon", label: "Hexagon", category: "shapes", icon: <div className="w-5 h-4 bg-orange-400" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} />, data: { type: "hexagon", color: "#f97316", label: "Hexagon" } },
  { type: "cylinder", label: "Cylinder", category: "shapes", icon: <div className="w-4 h-5 bg-indigo-400 rounded-t-full rounded-b-md" />, data: { type: "cylinder", color: "#6366f1", label: "Cylinder" } },
  { type: "parallelogram", label: "Parallelogram", category: "shapes", icon: <div className="w-5 h-3 bg-blue-400 transform -skew-x-12" />, data: { type: "parallelogram", color: "#3b82f6", label: "Parallelogram" } },
  { type: "rounded-rectangle", label: "Rounded", category: "shapes", icon: <div className="w-5 h-4 bg-pink-400 rounded-lg" />, data: { type: "rounded-rectangle", color: "#ec4899", label: "Rounded" } },
  // Automation
  { type: "trigger", label: "Trigger", category: "automation", icon: <Play className="w-4 h-4 text-blue-500" />, data: { event: "New Event", source: "Webhook" } },
  { type: "task", label: "Task", category: "automation", icon: <CheckCircle2 className="w-4 h-4 text-amber-500" />, data: { title: "New Task", status: "pending" } },
  { type: "condition", label: "Condition", category: "automation", icon: <GitBranch className="w-4 h-4 text-violet-500" />, data: { condition: "Check condition" } },
  { type: "action", label: "Action", category: "automation", icon: <Zap className="w-4 h-4 text-emerald-500" />, data: { action: "Execute action" } },
  { type: "wait", label: "Wait", category: "automation", icon: <Clock className="w-4 h-4 text-cyan-500" />, data: { duration: 1, unit: "hour" } },
  { type: "end", label: "End", category: "automation", icon: <CheckCircle2 className="w-4 h-4 text-green-500" />, data: { result: "Complete" } },
  // Database
  { type: "table", label: "Table", category: "database", icon: <Table2 className="w-4 h-4" />, data: { name: "users", columns: [] } },
];

// Minimap node color helper
const getMinimapNodeColor = (node: Node) => {
  const typeColors: Record<string, string> = {
    circle: "#22c55e",
    rectangle: "#f59e0b",
    diamond: "#8b5cf6",
    triangle: "#f97316",
    hexagon: "#f97316",
    cylinder: "#6366f1",
    parallelogram: "#3b82f6",
    "rounded-rectangle": "#ec4899",
    trigger: "#3b82f6",
    task: "#f59e0b",
    condition: "#8b5cf6",
    action: "#10b981",
    end: "#22c55e",
    wait: "#06b6d4",
    group: "#ec4899",
    subWorkflow: "#f97316",
    table: "#14b8a6",
  };
  return typeColors[node.type || ""] || "#94a3b8";
};

// Inner FlowDesigner component (needs to be inside ReactFlowProvider)
function FlowDesignerInner({
  initialNodes = [],
  initialEdges = [],
  enableAI = false,
  leftSidebarCollapsible = true,
  rightSidebarCollapsible = true,
  defaultEdgeType = "smoothstep",
  defaultShowMinimap = true,
  defaultShowControls = true,
  workflowName = "Untitled Workflow",
  onWorkflowExecute,
  onWorkflowSave,
  onWorkflowExport,
  onWorkflowImport,
}: FlowDesignerProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  // Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // UI state
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("designer");
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  
  // Canvas settings
  const [showMinimap, setShowMinimap] = useState(defaultShowMinimap);
  const [showControls, setShowControls] = useState(defaultShowControls);
  const [selectedEdgeType, setSelectedEdgeType] = useState(defaultEdgeType);
  const [layoutDirection, setLayoutDirection] = useState<"TB" | "LR">("TB");
  
  // AI state
  const [messages, setMessages] = useState<WorkflowMessage[]>([]);
  const [aiInputValue, setAiInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Custom hooks
  const { screenToFlowPosition } = useReactFlow();
  const { applyLayout } = useAutoLayout({ direction: layoutDirection });
  const { deleteSelectedNodes, duplicateNode, updateNodeData } = useNodeOperations();
  const selection = useSelection();
  const { fitToView, zoomIn, zoomOut } = useViewportOperations();

  // Filtered node library
  const nodeLibrary = useMemo(() => getDefaultNodeLibrary(), []);
  const filteredLibrary = useMemo(() => {
    return nodeLibrary.filter((item) => {
      const matchesSearch = item.label.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !filterCategory || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [nodeLibrary, searchQuery, filterCategory]);

  // Connection handler
  const onConnect: OnConnect = useCallback((params) => {
    if (params.source && params.target && params.source !== params.target) {
      setEdges((eds) => addEdge({
        ...params,
        type: selectedEdgeType,
        markerEnd: { type: MarkerType.ArrowClosed },
        animated: selectedEdgeType === "animated",
      }, eds));
    }
  }, [setEdges, selectedEdgeType]);

  // Drag handlers
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!reactFlowWrapper.current) return;
    
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData("application/reactflow");
    const nodeDataStr = event.dataTransfer.getData("application/node-data");
    const nodeData = nodeDataStr ? JSON.parse(nodeDataStr) : {};
    
    if (!type) return;
    
    const position = screenToFlowPosition({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    
    const newNode: FlowNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: nodeData,
    };
    
    setNodes((nds) => nds.concat(newNode));
  }, [screenToFlowPosition, setNodes]);

  // Node click handler
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  // Pane click handler
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Add node from library
  const handleAddNodeFromLibrary = useCallback((item: NodeLibraryItem) => {
    const newNode: FlowNode = {
      id: `${item.type}-${Date.now()}`,
      type: item.type,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: item.data || {},
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  // AI message handler
  const handleSendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    
    const userMessage: WorkflowMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setAiInputValue("");
    setIsProcessing(true);
    
    // Simulate AI response (in real app, this would call an AI API)
    setTimeout(() => {
      const assistantMessage: WorkflowMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: "I've processed your request. You can now update the workflow based on your needs.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1500);
  }, []);

  // Execute workflow
  const handleExecute = useCallback(async () => {
    if (onWorkflowExecute) {
      await onWorkflowExecute(nodes, edges);
    } else {
      // Default execution - just log for now
      console.log("Executing workflow:", { nodes, edges });
      alert("Workflow execution started! Check console for details.");
    }
  }, [nodes, edges, onWorkflowExecute]);

  // Save workflow
  const handleSave = useCallback(() => {
    if (onWorkflowSave) {
      onWorkflowSave(nodes, edges);
    } else {
      console.log("Saving workflow:", { nodes, edges });
    }
  }, [nodes, edges, onWorkflowSave]);

  // Export workflow
  const handleExport = useCallback(() => {
    const workflowData = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([workflowData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workflowName.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges, workflowName]);

  // Node type map
  const nodeTypes = useMemo(() => ({
    shape: ShapeNode,
    circle: CircularNode,
    diamond: DiamondNode,
    rectangle: ShapeNode,
    triangle: ShapeNode,
    hexagon: HexagonNode,
    cylinder: ShapeNode,
    parallelogram: ShapeNode,
    "rounded-rectangle": ShapeNode,
    task: TaskNode,
    condition: ConditionNode,
    action: ActionNode,
    trigger: TriggerNode,
    end: EndNode,
    group: GroupNode,
    wait: WaitNode,
    subWorkflow: SubWorkflowNode,
    enhancedEmployee: EnhancedEmployeeNode,
    departmentGroup: DepartmentGroupNode,
    compactCard: CompactCardNode,
    stadium: StadiumNode,
    annotation: AnnotationNode,
    metricCard: MetricCardNode,
    table: ShapeNode,
  }), []);

  // Edge type map
  const edgeTypes = useMemo(() => ({
    animated: AnimatedFlowEdge,
    step: StepEdge,
    status: StatusEdge,
    conditional: ConditionalEdge,
    dashed: DashedEdge,
  }), []);

  // Get selected node data
  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId);
  }, [nodes, selectedNodeId]);

  return (
    <div className="flex h-screen w-full flex-col">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between border-b px-4 py-2 bg-background">
        <div className="flex items-center gap-2">
          <Workflow className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold">{workflowName}</h1>
          <Badge variant="outline" className="ml-2">v2.0</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowMinimap(!showMinimap)}>
            <Layers className="h-4 w-4 mr-1" />
            Minimap
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowControls(!showControls)}>
            <LayoutGrid className="h-4 w-4 mr-1" />
            Controls
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyLayout()}>
            <LayoutList className="h-4 w-4 mr-1" />
            Auto-Layout
          </Button>
          <Button variant="default" size="sm" onClick={handleExecute}>
            <Play className="h-4 w-4 mr-1" />
            Run
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Node Library */}
        <CollapsibleSidebar
          collapsed={leftSidebarCollapsed}
          onToggle={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
          collapsible={leftSidebarCollapsible}
          side="left"
          title="Node Library"
          titleIcon={<Database className="h-4 w-4" />}
        >
          <NodeLibrary
            items={filteredLibrary}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={filterCategory}
            onCategoryChange={setFilterCategory}
            onNodeAdd={handleAddNodeFromLibrary}
          />
        </CollapsibleSidebar>

        {/* Center - Flow Canvas */}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <EnhancedFlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes as any}
            edgeTypes={edgeTypes as any}
            nodesConnectable={true}
            connectionLineStyle={{ stroke: "#ff0073", strokeWidth: 2 }}
            connectionLineType={selectedEdgeType as any}
            showBackground
            backgroundVariant={BackgroundVariant.Dots}
            backgroundGap={12}
            showControls={showControls}
            showMiniMap={showMinimap}
            miniMapNodeColor={getMinimapNodeColor}
            fitViewOptions={{ padding: 0.2 }}
            defaultEdgeOptions={{ type: selectedEdgeType, animated: selectedEdgeType === "animated" }}
            topRightPanel={
              <div className="bg-white/90 backdrop-blur border rounded-lg p-3 shadow-lg">
                <div className="text-xs space-y-2">
                  <div className="font-medium">Flow Stats</div>
                  <div className="flex items-center justify-between">
                    <span>Nodes:</span>
                    <Badge variant="secondary">{nodes.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Edges:</span>
                    <Badge variant="secondary">{edges.length}</Badge>
                  </div>
                  {selection.hasSelection && (
                    <div className="pt-2 border-t mt-2">
                      <div className="flex items-center justify-between">
                        <span>Selected:</span>
                        <Badge variant="default">{selection.nodeCount}</Badge>
                      </div>
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full mt-2"
                    onClick={deleteSelectedNodes}
                    disabled={!selection.hasSelection}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            }
          />
        </div>

        {/* Right Sidebar - Properties / AI / Designer */}
        <CollapsibleSidebar
          collapsed={rightSidebarCollapsed}
          onToggle={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
          collapsible={rightSidebarCollapsible}
          side="right"
          title="Properties"
          titleIcon={<Settings className="h-4 w-4" />}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full mx-2 mt-2">
              <TabsTrigger value="designer" className="flex-1 text-xs">
                <Workflow className="h-3 w-3 mr-1" />
                Designer
              </TabsTrigger>
              {enableAI && (
                <TabsTrigger value="ai" className="flex-1 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI
                </TabsTrigger>
              )}
              <TabsTrigger value="properties" className="flex-1 text-xs">
                <Layers className="h-3 w-3 mr-1" />
                Properties
              </TabsTrigger>
            </TabsList>

            {/* Designer Tab */}
            <TabsContent value="designer" className="flex-1 overflow-hidden m-0">
              <DesignerPanel
                selectedEdgeType={selectedEdgeType}
                onEdgeTypeChange={setSelectedEdgeType}
                layoutDirection={layoutDirection}
                onLayoutDirectionChange={setLayoutDirection}
                onFitToView={fitToView}
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                onAutoLayout={applyLayout}
              />
            </TabsContent>

            {/* AI Tab */}
            {enableAI && (
              <TabsContent value="ai" className="flex-1 overflow-hidden m-0 p-0">
                <AIPanel
                  messages={messages}
                  inputValue={aiInputValue}
                  onInputChange={setAiInputValue}
                  onSendMessage={handleSendMessage}
                  onClearChat={() => setMessages([])}
                  isProcessing={isProcessing}
                  enabled={enableAI}
                />
              </TabsContent>
            )}

            {/* Properties Tab */}
            <TabsContent value="properties" className="flex-1 overflow-hidden m-0 p-0">
              <PropertiesPanel
                selectedNodeId={selectedNodeId}
                nodeData={selectedNode?.data}
                onNodeDataChange={(nodeId, data) => updateNodeData(nodeId, data)}
                onDelete={(nodeId) => {
                  setSelectedNodeId(null);
                  deleteSelectedNodes();
                }}
                onDuplicate={(nodeId) => duplicateNode(nodeId)}
              />
            </TabsContent>
          </Tabs>
        </CollapsibleSidebar>
      </div>
    </div>
  );
}

// Wrapper component with ReactFlowProvider
export function FlowDesigner(props: FlowDesignerProps) {
  return (
    <ReactFlowProvider>
      <FlowDesignerInner {...props} />
    </ReactFlowProvider>
  );
}

export default FlowDesigner;


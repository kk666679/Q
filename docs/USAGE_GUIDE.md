# React Flow Integration Guide

Complete guide for using React Flow (xyFlow) in the QMS platform.

## 🎯 Overview

The QMS platform uses React Flow v11+ for:
- Process flow diagrams
- Workflow automation
- Organizational charts
- Database diagrams
- Flowcharts

## 📦 Installation

Already installed in the project:
```json
{
  "@xyflow/react": "^12.x",
  "dagre": "^0.8.5"
}
```

## 🏗️ Architecture

```
Flow Application
├── ReactFlowProvider (Wrapper)
├── EnhancedFlowCanvas (Main Canvas)
│   ├── Background
│   ├── Controls
│   ├── MiniMap
│   └── Panels
├── Custom Nodes
│   ├── TaskNode
│   ├── ConditionNode
│   └── ActionNode
├── Custom Edges
│   ├── AnimatedFlowEdge
│   └── ConditionalEdge
└── Custom Hooks
    ├── useAutoLayout
    ├── useNodeOperations
    └── useSelection
```

## 🚀 Quick Start

### 1. Basic Setup

```tsx
import { ReactFlowProvider } from '@xyflow/react';
import { EnhancedFlowCanvas } from '@/components/automation';
import '@xyflow/react/dist/style.css';

export default function MyFlowPage() {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100vw', height: '100vh' }}>
        <EnhancedFlowCanvas
          nodes={[]}
          edges={[]}
          showBackground
          showControls
        />
      </div>
    </ReactFlowProvider>
  );
}
```

### 2. With State Management

```tsx
import { useNodesState, useEdgesState } from '@xyflow/react';

function FlowWithState() {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  ]);
  
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  return (
    <EnhancedFlowCanvas
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    />
  );
}
```

### 3. With Custom Nodes

```tsx
import { TaskNode, ConditionNode } from '@/components/automation';

const nodeTypes = {
  task: TaskNode,
  condition: ConditionNode,
};

const nodes = [
  {
    id: '1',
    type: 'task',
    position: { x: 0, y: 0 },
    data: {
      title: 'Process Order',
      status: 'pending',
      priority: 'high',
    },
  },
];

<EnhancedFlowCanvas nodeTypes={nodeTypes} nodes={nodes} />
```

## 🎨 Customization

### Background Patterns

```tsx
import { BackgroundVariant } from '@xyflow/react';

<EnhancedFlowCanvas
  showBackground
  backgroundVariant={BackgroundVariant.Dots}  // or Lines, Cross
  backgroundGap={20}
  backgroundSize={1}
  backgroundColor="#e5e7eb"
/>
```

### MiniMap Colors

```tsx
<EnhancedFlowCanvas
  showMiniMap
  miniMapNodeColor={(node) => {
    switch (node.type) {
      case 'task': return '#f59e0b';
      case 'condition': return '#8b5cf6';
      default: return '#94a3b8';
    }
  }}
/>
```

### Custom Panels

```tsx
<EnhancedFlowCanvas
  topRightPanel={
    <div className="bg-white p-4 rounded shadow">
      <h3>Stats</h3>
      <p>{nodes.length} nodes</p>
    </div>
  }
  bottomLeftPanel={<CustomToolbar />}
/>
```

## 🪝 Using Custom Hooks

### Auto Layout

```tsx
import { useAutoLayout } from '@/components/automation';

function LayoutControls() {
  const { applyLayout } = useAutoLayout({
    direction: 'LR',  // Left to Right
    nodeSpacing: 100,
    rankSpacing: 150,
  });

  return (
    <button onClick={applyLayout}>
      Auto Layout
    </button>
  );
}
```

### Node Operations

```tsx
import { useNodeOperations } from '@/components/automation';

function NodeControls() {
  const {
    addNode,
    updateNodeData,
    deleteSelectedNodes,
    duplicateNode,
  } = useNodeOperations();

  const handleAddTask = () => {
    addNode({
      id: `task-${Date.now()}`,
      type: 'task',
      position: { x: 100, y: 100 },
      data: { title: 'New Task' },
    });
  };

  return (
    <div>
      <button onClick={handleAddTask}>Add Task</button>
      <button onClick={deleteSelectedNodes}>Delete Selected</button>
    </div>
  );
}
```

### Selection Tracking

```tsx
import { useSelection } from '@/components/automation';

function SelectionInfo() {
  const selection = useSelection();

  return (
    <div>
      {selection.hasSelection && (
        <p>Selected: {selection.nodeCount} nodes</p>
      )}
    </div>
  );
}
```

### Viewport Control

```tsx
import { useViewportOperations } from '@/components/automation';

function ViewportControls() {
  const {
    fitToView,
    zoomIn,
    zoomOut,
    zoomToNode,
    resetViewport,
  } = useViewportOperations();

  return (
    <div>
      <button onClick={() => fitToView()}>Fit View</button>
      <button onClick={() => zoomIn()}>Zoom In</button>
      <button onClick={() => zoomOut()}>Zoom Out</button>
      <button onClick={() => zoomToNode('node-1')}>Focus Node</button>
    </div>
  );
}
```

## 🎯 Common Patterns

### Drag and Drop

```tsx
const onDragOver = useCallback((event: React.DragEvent) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
}, []);

const onDrop = useCallback((event: React.DragEvent) => {
  event.preventDefault();
  
  const type = event.dataTransfer.getData('application/reactflow');
  const position = screenToFlowPosition({
    x: event.clientX,
    y: event.clientY,
  });
  
  const newNode = {
    id: `${type}-${Date.now()}`,
    type,
    position,
    data: {},
  };
  
  setNodes((nds) => nds.concat(newNode));
}, []);

<EnhancedFlowCanvas
  onDrop={onDrop}
  onDragOver={onDragOver}
/>
```

### Connection Handling

```tsx
import { addEdge, MarkerType } from '@xyflow/react';

const onConnect = useCallback((params) => {
  setEdges((eds) => addEdge({
    ...params,
    type: 'smoothstep',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  }, eds));
}, []);

<EnhancedFlowCanvas onConnect={onConnect} />
```

### Node Click Handler

```tsx
const onNodeClick = useCallback((event, node) => {
  console.log('Clicked node:', node.id);
  setSelectedNode(node);
}, []);

<EnhancedFlowCanvas onNodeClick={onNodeClick} />
```

### Conditional Edges

```tsx
const edges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    sourceHandle: 'true',
    type: 'conditional',
    data: { branch: 'true' },
    style: { stroke: '#22c55e' },
    label: 'Yes',
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    sourceHandle: 'false',
    type: 'conditional',
    data: { branch: 'false' },
    style: { stroke: '#ef4444' },
    label: 'No',
  },
];
```

## 🎨 Styling

### Node Styling

```tsx
const node = {
  id: '1',
  position: { x: 0, y: 0 },
  data: { label: 'Styled Node' },
  style: {
    background: '#f59e0b',
    color: '#fff',
    border: '2px solid #d97706',
    borderRadius: '8px',
    padding: '10px',
  },
  className: 'custom-node-class',
};
```

### Edge Styling

```tsx
const edge = {
  id: 'e1-2',
  source: '1',
  target: '2',
  style: {
    stroke: '#8b5cf6',
    strokeWidth: 3,
  },
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#8b5cf6',
  },
};
```

## 🔧 Advanced Features

### Multi-Handle Nodes

```tsx
import { Handle, Position } from '@xyflow/react';

function MultiHandleNode({ data }) {
  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Left} id="left" />
      
      <div>{data.label}</div>
      
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
    </div>
  );
}
```

### Custom Edge with Label

```tsx
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from '@xyflow/react';

function CustomEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
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
      <path d={edgePath} className="react-flow__edge-path" />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
          className="nodrag nopan"
        >
          <button className="edge-button">{data.label}</button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
```

### Validation

```tsx
const isValidConnection = useCallback((connection) => {
  // Prevent self-connections
  if (connection.source === connection.target) return false;
  
  // Prevent duplicate connections
  const exists = edges.some(
    (edge) =>
      edge.source === connection.source &&
      edge.target === connection.target
  );
  
  return !exists;
}, [edges]);

<EnhancedFlowCanvas isValidConnection={isValidConnection} />
```

## 📊 Performance Tips

1. **Memoize callbacks** with `useCallback`
2. **Use node/edge types** instead of inline components
3. **Limit re-renders** with proper state management
4. **Use fitView sparingly** (expensive operation)
5. **Debounce expensive operations** (save, API calls)

```tsx
const onNodesChange = useCallback(
  (changes) => {
    // Filter or modify changes if needed
    onNodesChangeHandler(changes);
  },
  [onNodesChangeHandler]
);
```

## 🐛 Troubleshooting

### Issue: Nodes not draggable
**Solution:** Ensure `draggable` prop is not set to `false`

### Issue: Edges not connecting
**Solution:** Check `isValidConnection` and handle IDs

### Issue: MiniMap not showing
**Solution:** Ensure `showMiniMap={true}` and nodes have positions

### Issue: Layout not applying
**Solution:** Ensure dagre is installed and nodes have width/height

## 📚 Resources

- [React Flow Documentation](https://reactflow.dev)
- [xyFlow GitHub](https://github.com/xyflow/xyflow)
- [QMS REACT_FLOW_API.md](./REACT_FLOW_API.md)
- [QMS Automation README](./README.md)

## 🎯 Next Steps

1. Explore `/app/flow-process/enhanced/page.tsx` for complete example
2. Read `REACT_FLOW_API.md` for detailed API reference
3. Check `README.md` for component documentation
4. Try custom hooks in your flow application

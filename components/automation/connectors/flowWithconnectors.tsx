import { ReactFlow, ReactFlowProvider, type Node, type Edge } from '@xyflow/react';
import { BasicConnectorNode, MultiHandleNode, ValidatedNode, OriginDemoNode } from './connectorNodes';
import { validateConnection } from './validation';
import { CustomConnectionLine } from './connectionLine';


// ReactFlow's NodeTypes is generic/strict; keep a permissive cast to avoid type incompatibilities.
// Behavior is unchanged.
const nodeTypes: any = {
  basic: BasicConnectorNode,
  multi: MultiHandleNode,
  validated: ValidatedNode,
  originDemo: OriginDemoNode,
};



type FlowWithConnectorsProps = {
  nodes?: Node[]
  edges?: Edge[]
}

export function FlowWithConnectors({
  nodes = [
    { id: '1', type: 'basic', position: { x: 100, y: 100 }, data: { label: 'Source' } },
    { id: '2', type: 'validated', position: { x: 400, y: 100 }, data: { label: 'Target' } },
  ],
  edges,
}: FlowWithConnectorsProps) {
  return (
    <ReactFlowProvider>
      <ReactFlow
        nodeTypes={nodeTypes}
        connectionLineComponent={CustomConnectionLine}
        isValidConnection={validateConnection}
        nodes={nodes}
        edges={edges}
      />
    </ReactFlowProvider>
  );
}


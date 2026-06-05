import { ReactFlow, ReactFlowProvider } from '@xyflow/react';
import { BasicConnectorNode, MultiHandleNode, ValidatedNode, OriginDemoNode } from './connectorNodes';
import { validateConnection } from './validation';
import { CustomConnectionLine } from './connectionLine';

const nodeTypes = {
  basic: BasicConnectorNode,
  multi: MultiHandleNode,
  validated: ValidatedNode,
  originDemo: OriginDemoNode,
};

export function FlowWithConnectors() {
  return (
    <ReactFlowProvider>
      <ReactFlow
        nodeTypes={nodeTypes}
        connectionLineComponent={CustomConnectionLine}
        isValidConnection={validateConnection}
        nodes={[
          { id: '1', type: 'basic', position: { x: 100, y: 100 }, data: { label: 'Source' } },
          { id: '2', type: 'validated', position: { x: 400, y: 100 }, data: { label: 'Target' } },
        ]}
      />
    </ReactFlowProvider>
  );
}
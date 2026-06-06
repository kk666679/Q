import { Handle, Position, type NodeProps } from '@xyflow/react';

export const ValidatedNode: React.FC<any> = ({ data }: any) => (
  <div
    style={{
      padding: 10,
      border: '2px solid #e6a700',
      borderRadius: 8,
      background: '#fff8e7',
      width: 140,
      textAlign: 'center',
    }}
  >
    <div>{data.label}</div>
    <Handle type="target" position={Position.Left} id="in" />
    <Handle type="source" position={Position.Right} id="out" />
    <div style={{ fontSize: 10, color: '#666' }}>Validated Connection</div>
  </div>
);
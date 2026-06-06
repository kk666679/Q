import { Handle, Position, type NodeProps } from '@xyflow/react';

interface BasicNodeData {
  label: string;
  color?: string;
}

export const BasicConnectorNode: React.FC<any> = ({ data, selected }: any) => (
  <div
    style={{
      padding: '10px 15px',
border: `2px solid ${selected ? '#ff0072' : (data?.color as string | undefined) || '#1a192b'}`,
      borderRadius: 8,
      background: 'white',
      minWidth: 120,
      textAlign: 'center',
    }}
  >
<div style={{ fontWeight: 'bold', marginBottom: 8 }}>{(data?.label as string) ?? ''}</div>
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20 }}>
      <Handle type="target" position={Position.Left} id="left-target" style={{ background: '#555' }} />
      <Handle type="source" position={Position.Right} id="right-source" style={{ background: '#555' }} />
    </div>
  </div>
);
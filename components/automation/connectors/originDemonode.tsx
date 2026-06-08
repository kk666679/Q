import { Handle, Position, type NodeProps } from '@xyflow/react'

type OriginDemoNodeData = {
  label: string
}

export const OriginDemoNode = ({ data }: NodeProps<any>) => (
  <div
    style={{
      padding: 8,
      border: '2px solid #00a878',
      borderRadius: 4,
      background: '#e0f7f0',
      width: 100,
      textAlign: 'center',
    }}
  >
    {(data as OriginDemoNodeData).label}
    <Handle type="source" position={Position.Right} id="out" />
  </div>
);


export const MultiHandleNode: React.FC<NodeProps<{ label: string }>> = ({ data }) => (
  <div
    style={{
      padding: 10,
      border: '2px solid #0041d0',
      borderRadius: 12,
      background: '#eef2ff',
      width: 150,
      textAlign: 'center',
    }}
  >
    <div style={{ fontWeight: 'bold' }}>{data.label}</div>
    <Handle type="target" position={Position.Top} id="top" style={{ top: -8 }} />
    <Handle type="source" position={Position.Bottom} id="bottom" style={{ bottom: -8 }} />
    <Handle type="target" position={Position.Left} id="left" />
    <Handle type="source" position={Position.Right} id="right" />
  </div>
);
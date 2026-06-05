export const OriginDemoNode: React.FC<NodeProps<{ label: string }>> = ({ data }) => (
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
    {data.label}
    <Handle type="source" position={Position.Right} id="out" />
  </div>
);
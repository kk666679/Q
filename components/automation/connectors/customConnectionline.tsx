import type { ConnectionLineComponentProps } from '@xyflow/react';

export const CustomConnectionLine: React.FC<ConnectionLineComponentProps> = ({
  fromX, fromY, toX, toY, connectionLineStyle,
}) => (
  <g>
    <path
      fill="none"
      stroke="#ff0072"
      strokeWidth={3}
      strokeDasharray="5,5"
      d={`M${fromX},${fromY} C ${fromX} ${toY}, ${toX} ${fromY}, ${toX} ${toY}`}
      style={connectionLineStyle}
    />
    <circle cx={toX} cy={toY} r={5} fill="#ff0072" />
  </g>
);
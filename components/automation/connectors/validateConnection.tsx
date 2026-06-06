import type { HandleConnection, IsValidConnection } from '@xyflow/react';

export const validateConnection: IsValidConnection = (connection: any) => {
  // Prevent self‑connection
  if (connection.source === connection.target) return false;
  // Example: only allow node '4' to connect to node '2'
  if (connection.source === '4' && connection.target !== '2') return false;
  return true;
};
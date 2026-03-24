/**
 * Background Node Component
 * 
 * Custom background component for React Flow canvas.
 * Provides various background patterns (dots, lines, cross).
 * 
 * @param variant - Background pattern type: dots, lines, cross
 * @param gap - Gap between pattern elements
 * @param size - Size of pattern elements
 * @param color - Color of pattern elements
 */

"use client";

import React from 'react';
import { Background, BackgroundVariant } from '@xyflow/react';

export type BackgroundVariantType = 'dots' | 'lines' | 'cross';

interface BackgroundNodeProps {
  variant?: BackgroundVariantType;
  gap?: number;
  size?: number;
  color?: string;
  className?: string;
}

export function BackgroundNode({
  variant = 'dots',
  gap = 20,
  size = 1,
  color = '#e5e7eb',
  className = ''
}: BackgroundNodeProps) {
  // Map our variant to React Flow's BackgroundVariant
  const getBackgroundVariant = (): BackgroundVariant => {
    switch (variant) {
      case 'lines':
        return BackgroundVariant.Lines;
      case 'cross':
        return BackgroundVariant.Cross;
      case 'dots':
      default:
        return BackgroundVariant.Dots;
    }
  };

  return (
    <Background
      variant={getBackgroundVariant()}
      gap={gap}
      size={size}
      color={color}
      className={className}
    />
  );
}

export default BackgroundNode;


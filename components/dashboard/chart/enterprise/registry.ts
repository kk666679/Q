'use client'

import type { ComponentType } from 'react'
import {
  Area,
  Bar,
  Line,
  Pie,
  Scatter,
} from 'recharts'

export type ChartType = 'area' | 'bar' | 'line' | 'pie' | 'scatter'

export type ChartSeriesKey = string

export interface ChartSeriesConfig {
  /** Recharts dataKey to read values from */
  key: ChartSeriesKey
  /** Friendly label for legend/tooltip */
  label: string
  /** Optional color token (css var or tailwind color) */
  color?: string
}

export interface ChartRendererConfig {
  /** Recharts primitive to render (Area/Bar/Line/Pie/Scatter). */
  component: ComponentType<any>
  /** Default props for the primitive. */
  defaultProps?: Record<string, any>
}

const registry = new Map<ChartType, ChartRendererConfig>()

export function registerChartType(type: ChartType, config: ChartRendererConfig) {
  registry.set(type, config)
}

export function getChartRendererConfig(type: ChartType) {
  return registry.get(type)
}

export function getAllChartRendererConfigs() {
  return registry
}

// Built-ins
registerChartType('area', {
  component: Area,
  defaultProps: {
    type: 'monotone',
    strokeWidth: 2,
    fillOpacity: 0.3,
  },
})

registerChartType('bar', {
  component: Bar,
  defaultProps: {
    radius: [4, 4, 0, 0],
  },
})

registerChartType('line', {
  component: Line,
  defaultProps: {
    type: 'monotone',
    strokeWidth: 2,
    dot: false,
  },
})

registerChartType('pie', {
  component: Pie,
  defaultProps: {
    innerRadius: 60,
    outerRadius: 80,
    paddingAngle: 2,
  },
})

registerChartType('scatter', {
  component: Scatter,
  defaultProps: {
    shape: 'circle',
    fillOpacity: 0.6,
  },
})


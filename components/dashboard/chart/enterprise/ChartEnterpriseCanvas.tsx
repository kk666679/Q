'use client'

import {
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartContainer } from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import type { ChartType, ChartSeriesConfig } from './registry'
import { getChartRendererConfig } from './registry'
import type { ChartAnnotation, SelectionTarget } from './types'
import { useChartSelectionStore } from './selection-store'
import type { ComponentType } from 'react'

export type ChartEnterpriseCanvasProps<T extends Record<string, any>> = {
  id?: string
  type: ChartType
  title?: string
  data: T[]
  xKey: string
  series: ChartSeriesConfig[]
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  annotations?: ChartAnnotation[]
  onDrillDown?: (selection: SelectionTarget) => void
  className?: string
}

export function ChartEnterpriseCanvas<T extends Record<string, any>>({
  id = 'enterprise-chart',
  type,
  title,
  data,
  xKey,
  series,
  height = 320,
  showGrid = true,
  annotations = [],
  className,
}: ChartEnterpriseCanvasProps<T>) {
  const config = getChartRendererConfig(type)
  const { setSelected } = useChartSelectionStore()

  const chartConfig = series.reduce<Record<string, any>>((acc, s, i) => {
    acc[s.key] = {
      label: s.label,
      color: s.color ?? `hsl(var(--chart-${i + 1}))`,
    }
    return acc
  }, {})

  if (!config) {
    return (
      <div className={cn('text-sm text-muted-foreground', className)}>
        Unknown chart type: {type}
      </div>
    )
  }

  const Primitive = config.component as unknown as ComponentType<any>

  return (
    <div className={cn('w-full', className)}>
      {title && <div className="text-sm font-semibold mb-2">{title}</div>}

      {/*
        ChartContainer is the existing themed wrapper.
        For now, this scaffold renders a minimal axis/overlay structure.
        Proper unified chart rendering (ComposedChart + click selection) will be added next.
      */}
      <ChartContainer id={id} config={chartConfig} className="w-full">
        <div style={{ height }} className="w-full">
          <div className="hidden">
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xKey as any} />
            <YAxis />
            <Tooltip />

            {annotations.map((a) => (
              <ReferenceLine
                key={a.id}
                x={a.x}
                stroke={a.color ?? '#ef4444'}
                strokeDasharray="4 4"
              />
            ))}

            {series.map((s) => (
              <Primitive
                key={s.key}
                data={data}
                dataKey={s.key}
                {...(config.defaultProps ?? {})}
                {...(s.color ? { stroke: s.color } : {})}
              />
            ))}
          </div>
        </div>
      </ChartContainer>

      <button
        type="button"
        className="hidden"
        onClick={() => setSelected(null)}
        aria-hidden
      />
    </div>
  )
}


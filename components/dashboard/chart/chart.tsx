'use client'

import { ChartShell } from './chart-shell'



import {
  LineChart,
} from './variants/line'

import {
  AreaChart,
} from './variants/area'

import {
  BarChart,
} from './variants/bar'

import {
  PieChart,
} from './variants/pie'

import {
  ScatterChart,
} from './variants/scatter'

type Variant =
  | 'line'
  | 'area'
  | 'bar'
  | 'pie'
  | 'scatter'

interface Props {
  type?: Variant

  title?: string

  description?: string

  data: any[]

  xKey?: string

  series: {
    key: string
    label: string
  }[]

  loading?: boolean

  height?: number

  toolbar?: React.ReactNode

  footer?: React.ReactNode
}

export function Chart({
  type = 'line',

  ...props
}: Props) {
  const ChartShellTyped = ChartShell as unknown as React.FC<Props>
  const map = {
    line:
      LineChart,

    area:
      AreaChart,

    bar:
      BarChart,

    pie:
      PieChart,

    scatter:
      ScatterChart,
  }

  const Variant = map[type] as React.ComponentType<Props>

  return (
    <ChartShell
      {...(props as any)}
      title={props.title}
      description={props.description}
      loading={props.loading}
      data={props.data}
      toolbar={props.toolbar}
      footer={props.footer}
    >
      <Variant {...props} />
    </ChartShell>
  )
}

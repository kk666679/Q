export type SelectionTarget = {
  /** Usually x-axis value (date/month) or category */
  x: string | number
  /** Optional series key if selecting a specific y-series */
  seriesKey?: string
  /** Free-form payload from recharts */
  raw?: any
}

export type ChartAnnotation = {
  id: string
  /** x coordinate in chartData space */
  x: string | number
  label: string
  color?: string
}

export type ExportFormat = 'csv' | 'png' | 'pdf' | 'excel'


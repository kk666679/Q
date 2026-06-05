'use client'

import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { downloadCSV } from '@/lib/exportUtils'
import { ChartEnterpriseCanvas } from '@/components/dashboard/chart/enterprise/ChartEnterpriseCanvas'

type SalesRow = {
  month: string
  revenue: number
  orders: number
}

const data: SalesRow[] = [
  { month: 'Jan', revenue: 120000, orders: 820 },
  { month: 'Feb', revenue: 135000, orders: 860 },
  { month: 'Mar', revenue: 128000, orders: 840 },
  { month: 'Apr', revenue: 152000, orders: 910 },
  { month: 'May', revenue: 170000, orders: 980 },
  { month: 'Jun', revenue: 162000, orders: 950 },
]

export default function ChartPhase2Page() {
  const csvName = 'sales-phase2.csv'

  const csvData = useMemo(
    () =>
      data.map((d) => ({
        month: d.month,
        revenue: d.revenue,
        orders: d.orders,
      })),
    [],
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard Chart Infrastructure — Phase 2</h1>
          <p className="text-muted-foreground text-sm">Linked selection + annotations + CSV export scaffold</p>
        </div>
        <Button
          variant="outline"
          onClick={() => downloadCSV(csvData, csvName)}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <ChartEnterpriseCanvas<SalesRow>
              id="revenue-chart"
              type="line"
              title="Revenue Trend"
              data={data}
              xKey="month"
              series={[{ key: 'revenue', label: 'Revenue', color: 'var(--chart-1)' }]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <ChartEnterpriseCanvas<SalesRow>
              id="orders-chart"
              type="bar"
              title="Orders Trend"
              data={data}
              xKey="month"
              series={[{ key: 'orders', label: 'Orders', color: 'var(--chart-2)' }]}
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        Note: selection + annotation overlay wiring will be completed in the next iteration.
      </div>
    </div>
  )
}


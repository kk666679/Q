'use client'

import {
  Download,
  RefreshCcw,
  Maximize,
  Calendar,
} from 'lucide-react'

import {
  Button,
} from '@/components/ui/button'

export function ChartToolbar() {
  return (
    <div className="flex gap-2">

      <Button
        size="icon"
        variant="ghost"
      >
        <Calendar />
      </Button>

      <Button
        size="icon"
        variant="ghost"
      >
        <RefreshCcw />
      </Button>

      <Button
        size="icon"
        variant="ghost"
      >
        <Download />
      </Button>

      <Button
        size="icon"
        variant="ghost"
      >
        <Maximize />
      </Button>

    </div>
  )
}
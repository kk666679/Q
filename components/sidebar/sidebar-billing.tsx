'use client'

import { Badge } from '@/components/ui/badge'
import { CreditCard } from 'lucide-react'

export interface SidebarBillingProps {
  cardBrand: string
  cardLast4: string
}

export function SidebarBilling({ cardBrand, cardLast4 }: SidebarBillingProps) {
  return (
    <div className="flex items-center justify-between rounded-md border p-2">
      <div className="flex items-center gap-2">
        <CreditCard className="size-4 text-muted-foreground" />
        <span className="text-sm">{cardBrand} •••• {cardLast4}</span>
      </div>
      <Badge variant="outline" className="text-xs">
        Default
      </Badge>
    </div>
  )
}


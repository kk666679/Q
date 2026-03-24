'use client'

import { Badge } from '@/components/ui/badge'
import { Sparkles, Wallet } from 'lucide-react'

export type SubscriptionPlan = 'Free' | 'Pro' | 'Enterprise'

export interface SidebarSubscriptionProps {
  plan: SubscriptionPlan
  credits: number
  creditLimit: number
}

export function SidebarSubscription({ plan, credits, creditLimit }: SidebarSubscriptionProps) {
  const creditsPercentage = Math.min((credits / creditLimit) * 100, 100)

  return (
    <div className="space-y-3">
      {/* Subscription Badge */}
      <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <span className="text-sm font-medium">Subscription</span>
        </div>
        <Badge variant="default" className="bg-primary text-primary-foreground">
          {plan}
        </Badge>
      </div>

      {/* Credits Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Wallet className="size-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">AI Credits</span>
          </div>
          <span className="font-medium">
            {credits.toLocaleString()} / {creditLimit.toLocaleString()}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div 
            className="h-full bg-primary transition-all"
            style={{ width: `${creditsPercentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}


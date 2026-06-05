'use client'

import * as React from 'react'
import {
  ArrowDown,
  ArrowUp,
  Minus,
  LucideIcon,
} from 'lucide-react'

import {
  Card,
  CardContent,
} from '@/components/ui/card'

import { cn } from '@/lib/utils'

type Trend = 'up' | 'down' | 'neutral'

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon

  description?: string

  trend?: {
    value?: number
    direction?: Trend
    label?: string
  }

  progress?: number

  badge?: string

  loading?: boolean

  format?: (
    value: number | string
  ) => React.ReactNode

  variant?: 'default' | 'compact' | 'expanded'

  className?: string

  footer?: React.ReactNode

  sparkline?: React.ReactNode

  onClick?: () => void
}

function TrendIcon({
  direction,
}: {
  direction?: Trend
}) {
  if (direction === 'up')
    return (
      <ArrowUp className="size-3 text-emerald-500" />
    )

  if (direction === 'down')
    return (
      <ArrowDown className="size-3 text-red-500" />
    )

  return (
    <Minus className="size-3 text-muted-foreground" />
  )
}

function Progress({
  value,
}: {
  value: number
}) {
  return (
    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
      <div
        className={cn(
          'h-full rounded-full transition-all',
          value >= 80 &&
            'bg-emerald-500',
          value >= 50 &&
            value < 80 &&
            'bg-amber-500',
          value < 50 &&
            'bg-red-500'
        )}
        style={{
          width: `${Math.min(
            Math.max(value, 0),
            100
          )}%`,
        }}
      />
    </div>
  )
}

function Skeleton() {
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="h-3 w-40 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  )
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  progress,
  badge,
  loading,
  format,
  variant = 'default',
  className,
  footer,
  sparkline,
  onClick,
}: StatCardProps) {
  if (loading) {
    return <Skeleton />
  }

  const display =
    format?.(value) ?? value

  return (
    <Card
      onClick={onClick}
      className={cn(
        `
        group
        relative
        overflow-hidden
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
        `,
        onClick &&
          'cursor-pointer',
        className
      )}
    >
      <CardContent
        className={cn(
          'space-y-4 p-6',
          variant ===
            'compact' &&
            'space-y-2 p-4',
          variant ===
            'expanded' &&
            'space-y-6 p-8'
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">
              {title}
            </div>

            {badge && (
              <span
                className="
                inline-flex
                rounded-md
                border
                px-2
                py-0.5
                text-xs
                "
              >
                {badge}
              </span>
            )}
          </div>

          <div
            className="
            rounded-xl
            bg-primary/10
            p-2
            text-primary
            transition
            group-hover:scale-110
            "
          >
            <Icon className="size-5" />
          </div>
        </div>

        {/* Value */}
        <div>
          <div
            className="
            text-3xl
            font-bold
            tracking-tight
            "
          >
            {display}
          </div>

          {description && (
            <div className="mt-1 text-sm text-muted-foreground">
              {description}
            </div>
          )}
        </div>

        {/* Trend */}
        {trend && (
          <div
            className="
            flex
            items-center
            gap-2
            text-xs
            "
          >
            <TrendIcon
              direction={
                trend.direction
              }
            />

            <span>
              {trend.value}%
            </span>

            <span className="text-muted-foreground">
              {trend.label}
            </span>
          </div>
        )}

        {/* Progress */}
        {progress !== undefined && (
          <Progress value={progress} />
        )}

        {/* Sparkline */}
        {sparkline && (
          <div>{sparkline}</div>
        )}

        {/* Footer */}
        {footer}
      </CardContent>
    </Card>
  )
}

type DashboardStats = {
  totalProjects: number
  activeProjects: number
  totalDocuments: number
  averageCompliance: number
  documentsThisMonth: number
  scansThisWeek: number
  recentActivity: Array<{
    type: string
    action: string
    item: string
    time: string
  }>
}

// Matches usage in app/dashboard/page.tsx
export function StatsCards({
  stats,
}: {
  stats: DashboardStats
}) {
  // Lazy icon imports kept local to avoid affecting other bundles
  const {
    Folder,
    Users,
    FileText,
    Shield,
    Calendar,
    Scan,
  } = require('lucide-react') as typeof import('lucide-react')

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard
        title="Total Projects"
        value={stats.totalProjects}
        icon={Folder}
        badge="Active portfolio"
        trend={{ value: 6, direction: 'up', label: 'vs. last' }}
      />

      <StatCard
        title="Active Projects"
        value={stats.activeProjects}
        icon={Users}
        badge="In flight"
        trend={{ value: 3, direction: 'up', label: 'vs. last' }}
      />

      <StatCard
        title="Total Documents"
        value={stats.totalDocuments}
        icon={FileText}
        badge="Approved + drafts"
        trend={{ value: 8, direction: 'up', label: 'vs. last' }}
      />

      <StatCard
        title="Avg Compliance"
        value={`${Math.round(stats.averageCompliance)}%`}
        icon={Shield}
        badge="ISO score"
        progress={Math.round(stats.averageCompliance)}
        trend={{ value: 2, direction: 'up', label: 'stable' }}
        format={(v) => v}
      />

      <StatCard
        title="Docs This Month"
        value={stats.documentsThisMonth}
        icon={Calendar}
        badge="This period"
        trend={{ value: 5, direction: 'up', label: 'growth' }}
      />

      <StatCard
        title="Scans This Week"
        value={stats.scansThisWeek}
        icon={Scan}
        badge="Automation"
        trend={{ value: 0, direction: 'neutral', label: 'this week' }}
      />
    </div>
  )
}


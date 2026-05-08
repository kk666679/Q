'use client'

import { 
  Sparkles, 
  X, 
  Bell, 
  ArrowRight,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'

interface WelcomeBannerProps {
  title?: string
  message?: string
  showDismiss?: boolean
}

const tips = [
  {
    title: 'Generate Your First QMS',
    description: 'Use the AI generator to create a complete quality management system.',
    link: '/generator',
    linkText: 'Start Generating'
  },
  {
    title: 'Design Process Flows',
    description: 'Create visual process diagrams with our drag-and-drop designer.',
    link: '/flow-process',
    linkText: 'Open Designer'
  },
  {
    title: 'Conduct Risk Assessment',
    description: 'Identify and mitigate risks with our AI-powered risk assessment tool.',
    link: '/iso/risk/assess',
    linkText: 'Start Assessment'
  },
  {
    title: 'Generate Audit Reports',
    description: 'Automate your ISO audit documentation with AI assistance.',
    link: '/iso/audit/generate',
    linkText: 'Create Audit'
  }
]

export function WelcomeBanner({
  title = 'Welcome to QMS Generator',
  message = 'Your AI-powered quality management system is ready.',
  showDismiss = true
}: WelcomeBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="relative overflow-hidden rounded-lg border bg-gradient-to-r from-primary/5 via-primary/5 to-primary/10 p-6">
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 opacity-10">
        <Sparkles className="h-32 w-32" />
      </div>

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <p className="text-muted-foreground">{message}</p>
        </div>

        {showDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={() => setDismissed(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Quick Tips */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tips.map((tip, index) => (
          <Link
            key={index}
            href={tip.link}
            className="group flex items-center justify-between rounded-lg border bg-background/50 p-3 transition-all hover:border-primary/50 hover:bg-background/80"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {index + 1}
                </span>
                <span className="font-medium text-sm">{tip.title}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                {tip.description}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  )
}

// Feature highlight card
interface FeatureHighlightProps {
  icon: React.ReactNode
  title: string
  description: string
  stats?: { value: string; label: string }[]
  link?: string
  linkText?: string
}

export function FeatureHighlight({
  icon,
  title,
  description,
  stats,
  link,
  linkText = 'Learn More'
}: FeatureHighlightProps) {
  return (
    <div className="group rounded-lg border p-6 transition-all hover:border-primary/50 hover:shadow-lg">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      
      {stats && stats.length > 0 && (
        <div className="mb-4 flex gap-4">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {link && (
        <Link
          href={link}
          className="group/link inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
        >
          {linkText}
          <ChevronRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
        </Link>
      )}
    </div>
  )
}

// Quick stats card
interface QuickStatsProps {
  items: { label: string; value: string; change?: string; trend?: 'up' | 'down' | 'neutral' }[]
}

export function QuickStatsCard({ items }: QuickStatsProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl font-bold">{item.value}</div>
            <div className="text-xs text-muted-foreground">{item.label}</div>
            {item.change && (
              <div className={`text-xs ${
                item.trend === 'up' ? 'text-green-500' : 
                item.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
              }`}>
                {item.change}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default WelcomeBanner

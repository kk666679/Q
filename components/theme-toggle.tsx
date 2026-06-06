'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Monitor } from 'lucide-react'

type Mode = 'light' | 'dark' | 'system'

function getIcon(theme: string | undefined) {
  if (theme === 'dark') return Moon
  if (theme === 'light') return Sun
  return Monitor
}

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()

  // Avoid flicker on first paint; render a disabled button until mounted.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const effectiveTheme: Mode extends any ? string : never = theme === 'system' ? (systemTheme ?? 'system') : theme ?? 'system'
  const Icon = getIcon(mounted ? effectiveTheme : undefined)

  const cycle: Mode[] = ['system', 'light', 'dark']
  const currentIndex = Math.max(0, cycle.indexOf((theme as Mode) ?? 'system'))
  const nextTheme = cycle[(currentIndex + 1) % cycle.length]

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(nextTheme)}
      className="relative"
    >
      <Icon className="size-4" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}


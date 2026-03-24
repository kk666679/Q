'use client'

import { ReactNode, useEffect, useState } from 'react'

interface ClientOnlyChartProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ClientOnlyChart({ children, fallback = null }: ClientOnlyChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

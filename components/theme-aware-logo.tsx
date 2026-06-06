'use client'

import Image from 'next/image'
import * as React from 'react'
import { useTheme } from 'next-themes'

export function ThemeAwareLogo({
  className,
  width = 36,
  height = 36,
}: {
  className?: string
  width?: number
  height?: number
}) {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const effectiveTheme = theme === 'system' ? systemTheme : theme
  const isDark = mounted && effectiveTheme === 'dark'

  return (
    <Image
      src={isDark ? '/Logo-MY-QMS-Dark.svg' : '/Logo-My-QMS-Light.svg'}
      alt="MyQMS"
      width={width}
      height={height}
      priority
      className={className ?? 'rounded-xl object-contain'}
    />
  )
}


'use client'

import * as React from 'react'

export function ChartCard({
  title,
  description,
  toolbar,
  children,
  footer,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  toolbar?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <section className="rounded-lg border bg-card p-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          {title && <h2 className="text-sm font-semibold">{title}</h2>}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {toolbar}
      </header>

      <div className="mt-4">{children}</div>

      {footer ? <div className="mt-4">{footer}</div> : null}
    </section>
  )
}


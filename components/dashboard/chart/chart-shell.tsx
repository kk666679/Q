'use client'

import {
  ChartCard,
} from './chart-card'

import {
  ChartToolbar,
} from './chart-toolbar'

import {
  ChartLoading,
} from './chart-loading'

import {
  ChartEmpty,
} from './chart-empty'

import type React from 'react'

interface ChartShellProps {
  loading?: boolean
  data: any[]
  children?: React.ReactNode
  title?: string
  description?: string
  toolbar?: React.ReactNode
  footer?: React.ReactNode
}

export function ChartShell({
  loading,
  data,
  children,

  ...props
}: ChartShellProps) {       
  return (
    <ChartCard
      title={
        props.title
      }

      description={
        props.description
      }

      toolbar={
        props.toolbar ??
        <ChartToolbar />
      }
    >
      {loading && (
        <ChartLoading />
      )}

      {!loading &&
        !data.length && (
          <ChartEmpty />
        )}

      {!loading &&
        !!data.length &&
        children}

      {props.footer}
    </ChartCard>
  )
}
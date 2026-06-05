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

export function ChartShell({
  loading,
  data,
  children,

  ...props
}: any) {
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
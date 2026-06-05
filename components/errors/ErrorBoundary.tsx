'use client'

import * as React from 'react'
import Link from 'next/link'

type ErrorBoundaryProps = {
  children: React.ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    // Central place for logging. Later we can wire to Sentry or tRPC.
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-lg w-full text-center space-y-5 rounded-2xl border border-border bg-card/60 backdrop-blur p-6 shadow-sm">
          <div className="text-4xl font-black text-muted-foreground">⚠️</div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">
              The page failed to render. You can return to a safe page and try again.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Back to Dashboard
            </Link>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Try again
            </button>
          </div>

          {process.env.NODE_ENV !== 'production' && this.state.error?.message && (
            <pre className="text-left text-xs text-muted-foreground overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-3">
              {this.state.error.message}
            </pre>
          )}
        </div>
      </div>
    )
  }
}


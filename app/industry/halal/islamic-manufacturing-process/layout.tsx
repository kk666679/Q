import type { ReactNode } from 'react'

export default function IslamicManufacturingProcessLayout({
  children,
}: {
  children: ReactNode
}) {
  // Uses the existing global RootLayout for Theme/SDK/ErrorBoundary.
  // Feature pages compose their own AppShell.
  return children
}


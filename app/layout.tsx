import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { QMSProvider } from '@/sdk/client/provider'
import { ThemeProvider } from '@/components/theme-provider'


// Load Geist fonts and capture their font-family strings
const geist = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QMS Generator - ISO 9001 Quality Management System',
  description: 'AI-powered Quality Management System generator for ISO 9001 compliance',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="dark"
    >
      <body className={`${geist.className} ${geistMono.className} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QMSProvider>
            {children}
          </QMSProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
import type { Metadata } from 'next'
import TrpcProvider from '@/lib/trpc/provider'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from './_components/theme-provider'
import NextAuthProvider from './_components/next-auth-provider'
import './globals.css'
import { mono, sans } from '@/lib/fonts'

import '../../node_modules/react-grid-layout/css/styles.css'

export const metadata: Metadata = {
  title: 'Dopplr',
  description: 'An analytical tool for creating beautiful dashboards from sql queries',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <NextAuthProvider>
            <TrpcProvider>{children}</TrpcProvider>
          </NextAuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

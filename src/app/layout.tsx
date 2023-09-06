import { getServerSession } from 'next-auth'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from './_components/theme-provider'
import AppShell from './_components/app-shell'
import TrpcProvider from '@/lib/trpc/provider'
import NextAuthProvider from '@/lib/auth/provider'
import './globals.css'

const sans = Inter({ subsets: ['latin'], variable: '--font-sans' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Dopplr',
  description: 'An analytical tool for creating beautiful dashboards from sql queries',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()

  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <AppShell>
            <TrpcProvider>
              <NextAuthProvider session={session}>{children}</NextAuthProvider>
            </TrpcProvider>
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  )
}

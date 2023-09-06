import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from './(authenticated-app)/_components/theme-provider'
import TrpcProvider from '@/lib/trpc/provider'
import './globals.css'
import { getUserAuth } from '@/lib/auth/utils'
import NextAuthProvider from '@/lib/auth/provider'

const sans = Inter({ subsets: ['latin'], variable: '--font-sans' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Dopplr',
  description: 'An analytical tool for creating beautiful dashboards from sql queries',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { session } = await getUserAuth()

  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <NextAuthProvider session={session}>
            <TrpcProvider>{children}</TrpcProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

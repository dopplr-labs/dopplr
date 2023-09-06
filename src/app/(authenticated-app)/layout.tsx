import type { Metadata } from 'next'
import AppShell from './_components/app-shell'
import { checkAuth } from '@/lib/auth/utils'

export const metadata: Metadata = {
  title: 'Dopplr',
  description: 'An analytical tool for creating beautiful dashboards from sql queries',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await checkAuth()
  return <AppShell>{children}</AppShell>
}

'use client'

import ChartsAppShell from './_components/charts-app-shell'

export default function ChartsLayout({ children }: { children: React.ReactNode }) {
  return <ChartsAppShell>{children}</ChartsAppShell>
}

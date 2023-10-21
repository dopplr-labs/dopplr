'use-client'

import ChartsList from './charts-list'

type ChartsAppShellProps = {
  children: React.ReactNode
}

export default function ChartsAppShell({ children }: ChartsAppShellProps) {
  return (
    <div className="flex h-full">
      <div className="w-[280px] overflow-auto border-r p-3">
        <ChartsList />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

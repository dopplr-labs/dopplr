'use client'

import { DatabaseZapIcon } from 'lucide-react'

type ResourceAppShellProps = {
  children: React.ReactNode
}

export default function ResourceAppShell({ children }: ResourceAppShellProps) {
  return (
    <div className="flex h-full flex-1">
      <div className="flex h-full w-[280px] flex-col items-center justify-center gap-4 border-r p-4">
        <DatabaseZapIcon className="h-10 w-10 text-muted-foreground" />
        <div className="text-center text-xs text-muted-foreground">
          You have not added any resource. Get started by adding a resource D
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

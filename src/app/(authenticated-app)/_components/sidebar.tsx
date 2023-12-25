'use client'

import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useStore } from '@/stores'

type SidebarProps = {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export default function Sidebar({ className, style, children }: SidebarProps) {
  const sidebarVisible = useStore((store) => store.sidebarVisible)
  const setSidebarVisible = useStore((store) => store.setSidebarVisible)

  return (
    <div
      className={cn('relative', className, {
        hidden: !sidebarVisible,
      })}
      style={style}
    >
      <div className="absolute inset-x-0 bottom-0 flex h-12 w-full items-center border-t bg-background px-4">
        <Button
          icon={<ArrowLeft />}
          variant="ghost"
          onClick={() => {
            setSidebarVisible(false)
          }}
        >
          Close
        </Button>
      </div>

      <div className="mb-12">{children}</div>
    </div>
  )
}

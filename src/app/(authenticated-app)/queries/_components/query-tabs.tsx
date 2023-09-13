'use client'

import { PlusIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type QueryTabsProps = {
  className?: string
  style?: React.CSSProperties
}

export default function QueryTabs({ className, style }: QueryTabsProps) {
  return (
    <div className={cn('flex items-end space-x-2 px-2 pt-2.5', className)} style={style}>
      <div className="relative flex items-center space-x-2 rounded-t-md border border-b-0 py-2 pl-3 pr-2 text-xs after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:w-full after:bg-primary">
        <div>New Query</div>
        <Button size="icon-xs" icon={<XIcon />} variant="ghost" />
      </div>
      <div className="flex items-center justify-center rounded-t-md border border-b-0 p-2">
        <Button size="icon-xs" icon={<PlusIcon />} variant="ghost" />
      </div>
    </div>
  )
}

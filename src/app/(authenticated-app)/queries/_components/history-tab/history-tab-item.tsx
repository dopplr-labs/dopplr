import { TerminalIcon } from 'lucide-react'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { History } from '@/db/schema/history'
import { cn, generateRandomId } from '@/lib/utils'
import { useStore } from '@/stores'
import { createRunQueryEvent } from '@/lib/event'

type HistoryTabItemProps = {
  className?: string
  style?: React.CSSProperties
  item: History
}

export default function HistoryTabItem({ className, style, item }: HistoryTabItemProps) {
  const addQueryTab = useStore((state) => state.addQueryTab)

  const handleRunQuery = () => {
    if (typeof window !== 'undefined') {
      const tabId = generateRandomId(16)
      addQueryTab(tabId, item.resourceId!, item.query)

      setTimeout(() => {
        document.dispatchEvent(createRunQueryEvent(tabId))
      }, 100)
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild onDoubleClick={handleRunQuery}>
        <div className={cn('cursor-pointer truncate border-b px-4 py-2 hover:bg-muted', className)} style={style}>
          {item.query}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-[12rem]">
        <ContextMenuItem
          className="cursor-pointer"
          onClick={(event) => {
            event.stopPropagation()
            handleRunQuery()
          }}
        >
          <span className="flex-1">Run query</span>
          <TerminalIcon className="h-4 w-4" />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

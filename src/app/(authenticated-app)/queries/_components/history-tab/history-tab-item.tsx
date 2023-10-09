import { EraserIcon, TerminalIcon, Trash } from 'lucide-react'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { History } from '@/db/schema/history'
import { cn, generateRandomId } from '@/lib/utils'
import { useStore } from '@/stores'
import { createRunQueryEvent } from '@/lib/event'
import { trpc } from '@/lib/trpc/client'
import { useToast } from '@/components/ui/use-toast'

type HistoryTabItemProps = {
  className?: string
  style?: React.CSSProperties
  item: History
}

export default function HistoryTabItem({ className, style, item }: HistoryTabItemProps) {
  const addQueryTab = useStore((state) => state.addQueryTab)
  const { toast } = useToast()
  const utils = trpc.useContext()

  const removeQueryMutation = trpc.history.removeHistoryItem.useMutation({
    onError: (error) => {
      toast({
        title: 'Error while removing query',
        description: error.message ?? 'Something went wrong. Please try again later.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      utils.history.getHistoryForUser.invalidate()
      toast({ title: 'Query removed successfully!' })
    },
  })

  const clearHistoryForUserMutation = trpc.history.clearHistoryForUser.useMutation({
    onError: (error) => {
      toast({
        title: 'Error clearing history',
        description: error.message ?? 'Something went wrong. Please try again later.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      utils.history.getHistoryForUser.invalidate()
      toast({ title: 'History cleared!' })
    },
  })

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
        <div
          className={cn('cursor-pointer select-none truncate border-b px-4 py-2 text-sm hover:bg-muted', className)}
          style={style}
        >
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
        <ContextMenuItem
          disabled={removeQueryMutation.isLoading}
          className="cursor-pointer"
          onClick={(event) => {
            event.stopPropagation()
            removeQueryMutation.mutate({ id: item.id })
          }}
        >
          <span className="flex-1">Remove query</span>
          <Trash className="h-4 w-4" />
        </ContextMenuItem>
        <ContextMenuItem
          onClick={(event) => {
            event.stopPropagation()
            clearHistoryForUserMutation.mutate()
          }}
        >
          <span className="flex-1">Clear All</span>
          <EraserIcon className="h-4 w-4" />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { cn } from '@/lib/utils'
import { useStore } from '@/stores'

type QueryTabProps = {
  tab: string
  index: number
  active: boolean
  onClose?: () => void
  onSelect?: () => void
}

export default function QueryTab({ tab, index, active, onClose, onSelect }: QueryTabProps) {
  const tabData = useStore((store) => store.queryTabData[tab])

  const { setNodeRef, setActivatorNodeRef, attributes, listeners, isDragging, transform, transition } = useSortable({
    id: tab,
    data: {
      type: 'query-tab',
      tab,
      index,
    },
  })

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={cn(
            'relative flex flex-shrink-0 items-center space-x-2 truncate rounded-t-md border border-b-0 pr-1 text-xs',
            active
              ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:w-full after:bg-primary'
              : undefined,
          )}
          id={`query-tab-${tab}`}
          ref={setNodeRef}
          style={{
            opacity: isDragging ? 0.4 : 1,
            transition,
            transform: CSS.Transform.toString(transform),
          }}
          onClick={onSelect}
        >
          <button
            className="w-20 truncate py-2 pl-3 pr-1 text-left"
            {...listeners}
            {...attributes}
            ref={setActivatorNodeRef}
            suppressHydrationWarning
          >
            {(tabData?.query ?? '') || 'New Query'}
          </button>
          <Button
            size="icon-xs"
            icon={<XIcon />}
            variant="ghost"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onClose?.()
            }}
          />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onClose?.()
          }}
        >
          Close Tab
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

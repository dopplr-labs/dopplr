import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SaveIcon, TerminalIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu'
import { cn } from '@/lib/utils'
import { useStore } from '@/stores'
import { TabDataStatus } from '@/types/tab'
import { createRunQueryEvent } from '@/lib/event'
import SaveQueryDialog from './save-query-dialog'

type QueryTabProps = {
  tab: string
  index: number
}

export default function QueryTab({ tab, index }: QueryTabProps) {
  const tabData = useStore((store) => store.queryTabData[tab])
  const setSaveQueryVisible = useStore((state) => state.setSaveQueryVisible)

  const { setNodeRef, setActivatorNodeRef, attributes, listeners, isDragging, transform, transition } = useSortable({
    id: tab,
    data: {
      type: 'query-tab',
      tab,
      index,
    },
  })

  const active = useStore((store) => store.activeQueryTabId === tab)
  const setActiveQueryTabId = useStore((store) => store.setActiveQueryTabId)
  const closeQueryTab = useStore((store) => store.closeQueryTab)
  const duplicateQueryTab = useStore((store) => store.duplicateQueryTab)

  if (!tabData) {
    return null
  }

  return (
    <>
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
            onClick={() => {
              setActiveQueryTabId(tab)
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
              /** Close on middle mouse click */
              if (e.button === 1) {
                closeQueryTab(tab)
              }
            }}
          >
            <button
              className="flex w-20 items-center space-x-1 truncate py-2 pl-3 pr-1 text-left"
              {...listeners}
              {...attributes}
              ref={setActivatorNodeRef}
              suppressHydrationWarning
            >
              {tabData.dataStatus === TabDataStatus.UNSAVED ? (
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              ) : null}
              <span className="truncate">{(tabData.name ?? tabData?.query ?? '') || 'New Query'}</span>
            </button>
            <Button
              size="icon-xs"
              icon={<XIcon />}
              variant="ghost"
              onClick={(event) => {
                event.stopPropagation()
                closeQueryTab(tab)
              }}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            disabled={!active}
            onClick={(event) => {
              event.stopPropagation()
              if (typeof window !== 'undefined') {
                document.dispatchEvent(createRunQueryEvent(tab))
              }
            }}
          >
            <span className="flex-1">Run Query</span>
            <TerminalIcon className="h-4 w-4" />
          </ContextMenuItem>
          <ContextMenuItem
            onClick={(event) => {
              event.stopPropagation()
              duplicateQueryTab(tab)
            }}
          >
            Duplicate Query
          </ContextMenuItem>
          <ContextMenuItem
            onClick={(event) => {
              event.stopPropagation()
            }}
            onSelect={() => {
              setSaveQueryVisible(true)
            }}
            disabled={!tabData.query}
          >
            <span className="flex-1">{tabData.savedQueryId ? 'Update Query' : 'Save Query'}</span>
            <SaveIcon className="h-4 w-4" />
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={(event) => {
              event.stopPropagation()
              closeQueryTab(tab)
            }}
          >
            Close Tab
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <SaveQueryDialog tabId={tab} />
    </>
  )
}

import { TableIcon } from 'lucide-react'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { useStore } from '@/stores'
import { generateRandomId } from '@/lib/utils'
import { TableColumn } from '@/types/database'
import { createRunQueryEvent } from '@/lib/event'

type TableColumnContextMenuProps = {
  resourceId: number
  table: TableColumn
}

export default function TableColumnContextMenu({
  children,
  resourceId,
  table,
}: React.PropsWithChildren<TableColumnContextMenuProps>) {
  const addQueryTab = useStore((state) => state.addQueryTab)

  const handleShowTopTenRows = () => {
    if (typeof window !== 'undefined') {
      const tabId = generateRandomId(16)
      addQueryTab(tabId, resourceId, `SELECT * FROM ${table.tablename} LIMIT 10;`)

      setTimeout(() => {
        document.dispatchEvent(createRunQueryEvent(tabId))
      }, 100)
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="min-w-[12rem]">
        <ContextMenuItem
          onClick={(event) => {
            event.stopPropagation()
            handleShowTopTenRows()
          }}
        >
          <span className="flex-1">Show top 10 rows</span>
          <TableIcon className="h-4 w-4" />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

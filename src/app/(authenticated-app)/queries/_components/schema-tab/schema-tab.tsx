import { match } from 'ts-pattern'
import { z } from 'zod'
import { getTableColumnsQuery as getPgTableColumnsQuery } from '@/lib/pg/sql-queries'
import { ResourceGetOutput, trpc } from '@/lib/trpc/client'
import { useStore } from '@/stores'
import { Skeleton } from '@/components/ui/skeleton'
import { range } from '@/lib/utils'
import { simpleHash } from '@/lib/random/utils'
import { ErrorMessage } from '@/components/ui/error-message'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { TableColumn } from '@/types/database'
import TableColumnContextMenu from './table-column-context-menu'
import { EmptyMessage } from '@/components/ui/empty-message'
import { getTableColumnsQuery as getMySqlTableColumnsQuery } from '@/lib/mysql/sql-queries'

const tableQueries = {
  postgres: getPgTableColumnsQuery,
  mysql: getMySqlTableColumnsQuery,
} satisfies Record<ResourceGetOutput['type'], (table?: string) => string>

export default function SchemaTab() {
  const activeQueryTabData = useStore((store) =>
    store.activeQueryTabId ? store.getTabData(store.activeQueryTabId) : undefined,
  )

  const getResourceQuery = trpc.resource.getResource.useQuery(
    {
      id: activeQueryTabData?.resourceId!,
    },
    {
      enabled: !!activeQueryTabData?.resourceId,
    },
  )

  const tablesQueryPayload = match(getResourceQuery)
    .with({ status: 'success' }, ({ data }) => {
      // Url should be present in the connection config
      const { url } = z.object({ url: z.string() }).parse(data.connectionConfig)
      const getTableColumnsQuery = tableQueries[data.type]

      return {
        type: data.type,
        connectionString: url,
        query: getTableColumnsQuery(),
      }
    })
    .otherwise(() => undefined)

  const tablesQuery = trpc.query.runQuery.useQuery(tablesQueryPayload!, { enabled: !!tablesQueryPayload })

  return match(tablesQuery)
    .returnType<React.ReactNode>()
    .with({ status: 'loading' }, () => {
      return (
        <div className="space-y-4 p-4">
          {range(5).map((key) => {
            return (
              <div className="flex items-center space-x-2" key={key}>
                <Skeleton className="h-7 w-7" />
                <Skeleton className="h-7" style={{ width: `${simpleHash(key)}%` }} />
              </div>
            )
          })}
        </div>
      )
    })
    .with({ status: 'error' }, ({ error }) => {
      return (
        <ErrorMessage
          title="Error fetching resources"
          description={error.message ?? 'Something went wrong. Please try again later.'}
        />
      )
    })
    .with({ status: 'success' }, ({ data }) => {
      if (!getResourceQuery.data) {
        return (
          <div className="flex h-full items-center justify-center">
            <EmptyMessage title="No resources found" />
          </div>
        )
      }

      const tables = data as TableColumn[]

      if (tables.length === 0) {
        return (
          <div className="flex h-full items-center justify-center">
            <EmptyMessage title="No tables found" description="Please create a table before creating a query" />
          </div>
        )
      }

      return (
        <Accordion
          type="multiple"
          className="h-full w-full overflow-y-auto font-mono"
          defaultValue={tables.map((table) => table.tablename)}
        >
          {tables.map((table) => (
            <AccordionItem value={table.tablename} key={table.tablename}>
              <TableColumnContextMenu resourceId={getResourceQuery.data.id} table={table}>
                <AccordionTrigger className="px-4 font-bold hover:no-underline">{table.tablename}</AccordionTrigger>
              </TableColumnContextMenu>
              <AccordionContent>
                {table.columns.map((column) => (
                  <div
                    key={column.attnum}
                    className="flex cursor-pointer items-center justify-between px-6 py-2 text-xs text-muted-foreground hover:bg-muted"
                  >
                    <div className="w-2/3 truncate">{column.attname}</div>
                    <div className="truncate">{column.data_type}</div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )
    })
    .exhaustive()
}

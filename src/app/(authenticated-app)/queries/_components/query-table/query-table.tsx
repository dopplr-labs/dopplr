import { useMemo } from 'react'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { useStore } from '@/stores'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function QueryTable() {
  const queryResult = useStore((store) =>
    store.activeQueryTabId ? store.queryTabData[store.activeQueryTabId]?.queryResult : undefined,
  )

  const columns = useMemo(() => {
    if (!queryResult) {
      return []
    }

    const columnDefs: ColumnDef<unknown>[] = Object.keys(queryResult[0]).map((key) => ({
      accessorKey: key,
      header: key,
      cell: ({ row }) => <div className="max-w-[10rem] truncate">{row.getValue(key)}</div>,
    }))
    return columnDefs
  }, [queryResult])

  const table = useReactTable({
    data: (queryResult ?? []).map((result) => {
      return Object.entries(result).reduce(
        (acc, [key, value]) => {
          if (typeof value === 'object') {
            acc[key] = dayjs(value as Date).format('DD-MM-YYYY')
          }

          return acc
        },
        {} as Record<string, string | number>,
      )
    }),
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (!queryResult) {
    return (
      <div className="flex items-center justify-center space-x-1 p-8 text-sm">
        <span>Run the query</span> <span className="rounded border bg-muted p-1 font-mono text-xs">Ctrl/Cmd</span>{' '}
        <span>+</span>
        <span className="rounded border bg-muted p-1 font-mono text-xs">Enter</span>
        <span>to see results.</span>
      </div>
    )
  }

  return (
    <Table className="font-mono" fullHeight>
      <TableHeader className="sticky top-0 bg-muted">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

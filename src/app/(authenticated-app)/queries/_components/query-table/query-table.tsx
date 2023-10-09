import { useMemo } from 'react'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useStore } from '@/stores'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function QueryTable() {
  const currentQueryData = useStore((store) => store.currentQueryData)

  const columns = useMemo(() => {
    if (!currentQueryData) return []

    const columnDefs: ColumnDef<unknown>[] = Object.keys(currentQueryData[0]).map((key) => ({
      accessorKey: key,
      header: key,
      cell: ({ row }) => <div className="max-w-[10rem] truncate">{row.getValue(key)}</div>,
    }))
    return columnDefs
  }, [currentQueryData])

  const table = useReactTable({
    data: currentQueryData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (!currentQueryData?.length) {
    return null
  }

  return (
    <div className="h-96 overflow-auto">
      <Table>
        <TableHeader>
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
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

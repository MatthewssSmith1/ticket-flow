import { flexRender, useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, VisibilityState } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { ColumnDef, FilterFnOption, Row, RowData, SortingState } from '@tanstack/react-table'
import { useState } from 'react'
import { cn } from "@/lib/utils"

type Props<T, F> = {
  data: T[]
  columns: ColumnDef<T>[]
  onRowClick: (row: Row<T>) => void
  globalFilter?: F
  globalFilterFn?: FilterFnOption<T>
  columnVisibility?: VisibilityState
}

export function GenericTable<T extends RowData, F>(props: Props<T, F>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: props.globalFilter ? getFilteredRowModel() : undefined,
    onSortingChange: setSorting,
    state: {
      sorting,
      globalFilter: props.globalFilter,
      columnVisibility: props.columnVisibility,
    },
    globalFilterFn: props.globalFilterFn,
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup, index) => (
            <TableRow key={index}>
              {headerGroup.headers.map((header, index) => (
                <TableHead key={index} className="p-[3px]">
                  {header.isPlaceholder ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="cursor-pointer" onClick={() => props.onRowClick(row)}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <TableCellContent columnId={cell.column.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCellContent>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={props.columns.length} className="h-24 text-center">
                No data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
} 

const LEFT_ALIGNED = ['subject', 'name']

export function TableCellContent({ columnId, children }: { columnId: string, children: React.ReactNode }) {
  return (
    <div className={cn(
      "flex truncate overflow-ellipsis select-none",
      !LEFT_ALIGNED.includes(columnId) && "justify-center",
    )}>
      {children}
    </div>
  )
} 
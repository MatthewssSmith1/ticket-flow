import { flexRender, useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, VisibilityState } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ColumnDef, FilterFnOption, Row, RowData, SortingState } from '@tanstack/react-table'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@ui/button'
import { Column } from '@tanstack/react-table'
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

export function SortableHeader({ column, label }: { column: Column<any, unknown>, label: string }) {
  const sortDirection = column.getIsSorted()

  const toggleSorting = () => {
    if (!sortDirection) column.toggleSorting(false)
    else if (sortDirection === 'asc') column.toggleSorting(true)
    else column.clearSorting()
  }

  function SortIcon({ order }: { order: false | 'asc' | 'desc' }) {
    if (order === 'asc') return <ChevronDown className="ml-1 size-4" />
    if (order === 'desc') return <ChevronUp className="ml-1 size-4" />
    return <div className="ml-1 size-4 opacity-0" />
  }

  return (
    <Button onClick={toggleSorting} variant="ghost" className="w-full justify-center py-1.5 px-3">
      <span className="ml-5">{label}</span>
      <SortIcon order={sortDirection} />
    </Button>
  )
} 

const LEFT_ALIGNED_COLUMNS = ['subject', 'name']

export function TableCellContent({ columnId, children }: { columnId: string, children: React.ReactNode }) {
  return (
    <div className={cn(
      "flex truncate overflow-ellipsis select-none",
      !LEFT_ALIGNED_COLUMNS.includes(columnId) && "justify-center",
    )}>
      {children}
    </div>
  )
} 
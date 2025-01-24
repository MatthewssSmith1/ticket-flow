import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { TableCellContent } from './TableCell'
import { SortableHeader } from './SortableHeader'
import { useNavigate } from '@tanstack/react-router'
import { useOrgStore } from '@/stores/orgStore'
import { useState } from 'react'
import { Member } from '@/types/types'
import { Pill } from './Pill'

export function MemberTable() {
  const { members } = useOrgStore()
  const [sorting, setSorting] = useState<SortingState>([])
  const navigate = useNavigate()

  const table = useReactTable({
    data: members ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  if (!members) return <div>Loading...</div>

  const handleRowClick = (id: number) => navigate({ search: { id } as any })

  return (
    <div className="rounded-md border max-w-[500px] mx-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup, index) => (
            <TableRow key={index}>
              {headerGroup.headers.map((header, index) => (
                <TableHead key={index} className="p-[3px]">
                  {header.isPlaceholder
                    ? null
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
              <TableRow key={row.id} className="cursor-pointer" onClick={() => handleRowClick(row.original.id)}>
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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No members found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const columns: ColumnDef<Member>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <SortableHeader column={column} label="Name" />,
    cell: ({ row }) => row.getValue('name'),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <SortableHeader column={column} label="Role" />,
    cell: ({ row }) => <Pill text={row.getValue('role')} />,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <SortableHeader column={column} label="Joined" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return date.toLocaleDateString()
    },
  },
]
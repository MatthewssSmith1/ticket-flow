import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Filter, ticketFilter } from '@/lib/filter'
import supabase, { unwrap } from '@/lib/supabase'
import { TableCellContent } from './TableCell'
import { SortableHeader } from './SortableHeader'
import { useViewStore } from '@/stores/viewStore'
import { useNavigate } from '@tanstack/react-router'
import { useOrgStore } from '@/stores/orgStore'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Ticket } from '@/types/types'
import { Pill } from './Pill'

export function TicketTable({ filters }: { filters?: Filter[] }) {
  const { currentOrg, members } = useOrgStore()
  const [sorting, setSorting] = useState<SortingState>([])
  const { selectedView } = useViewStore()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tickets', currentOrg?.id],
    queryFn: async (): Promise<Ticket[]> => {
      if (!currentOrg) return []
      return (await supabase
        .from('tickets')
        .select('*')
        .eq('org_id', currentOrg.id)
        .then(unwrap))
    }
  })

  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: 'status',
      header: ({ column }) => <SortableHeader column={column} label="Status" />,
      cell: ({ row }) => <Pill text={row.getValue('status')} />,
    },
    {
      accessorKey: 'priority',
      header: ({ column }) => <SortableHeader column={column} label="Priority" />,
      cell: ({ row }) => <Pill text={row.getValue('priority')} />,
    },
    {
      accessorKey: 'subject',
      header: ({ column }) => <SortableHeader column={column} label="Subject" />,
      cell: ({ row }) => row.getValue('subject'),
    },
    {
      accessorKey: 'tags',
      header: ({ column }) => <SortableHeader column={column} label="Tags" />,
      cell: ({ row }) => {
        const tags = row.getValue<string[]>('tags')
        return tags?.length ? tags.join(', ') : '-'
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <SortableHeader column={column} label="Name" />,
      cell: ({ row }) => {
        const authorId = row.original.author_id
        const memberName = members?.find(m => m.id === authorId)?.name
        return memberName || row.getValue('name') || '-'
      },
    },
    {
      accessorKey: 'verified_at',
      header: ({ column }) => <SortableHeader column={column} label="Submitted" />,
      cell: ({ row }) => {
        const date = row.getValue<string>('verified_at')
        return date ? new Date(date).toLocaleDateString() : '-'
      },
    },
    {
      accessorKey: 'due_at',
      header: ({ column }) => <SortableHeader column={column} label="Due" />,
      cell: ({ row }) => {
        const date = row.getValue<string>('due_at')
        return date ? new Date(date).toLocaleDateString() : '-'
      },
    },
    {
      accessorKey: 'channel',
      header: ({ column }) => <SortableHeader column={column} label="Channel" />,
      cell: ({ row }) => <Pill text={row.getValue('channel')} />,
    },
  ]

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      globalFilter: filters ?? selectedView?.filters ?? [],
    },
    globalFilterFn: ticketFilter,
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading tickets</div>

  const handleRowClick = (id: string) => navigate({ search: { id } as any })

  return (
    <div className="rounded-md border">
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
                No tickets found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
} 


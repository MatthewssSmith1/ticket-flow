import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Filter, ticketFilter } from '@/lib/filter'
import supabase, { unwrap } from '@/lib/supabase'
import { useViewStore } from '@/stores/viewStore'
import { useNavigate } from '@tanstack/react-router'
import { useOrgStore } from '@/stores/orgStore'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Ticket } from '@/types/types'
import { Button } from './ui/button'
import { Pill } from './Pill'
import { cn } from '@/lib/utils'

export function TicketTable({ filters }: { filters?: Filter[] }) {
  const { currentOrg } = useOrgStore()
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
                    <div className={cn(
                      "flex max-w-[150px] truncate overflow-ellipsis select-none",
                      cell.column.id !== 'subject' && "justify-center"
                    )}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
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
    accessorKey: 'name',
    header: ({ column }) => <SortableHeader column={column} label="Name" />,
    cell: ({ row }) => row.getValue('name') || '-',
  },
  {
    accessorKey: 'subject',
    header: ({ column }) => <SortableHeader column={column} label="Subject" />,
    cell: ({ row }) => row.getValue('subject'),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <SortableHeader column={column} label="Email" />,
    cell: ({ row }) => row.getValue('email') || '-',
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <SortableHeader column={column} label="Created" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return date.toLocaleDateString()
    },
  },
  {
    accessorKey: 'channel',
    header: ({ column }) => <SortableHeader column={column} label="Channel" />,
    cell: ({ row }) => <Pill text={row.getValue('channel')} />,
  },
]

function SortableHeader({ column, label }: { column: any, label: string }) {
  const sortDirection = column.getIsSorted()

  const toggleSorting = () => {
    if (!sortDirection) column.toggleSorting(false)
    else if (sortDirection === 'asc') column.toggleSorting(true)
    else column.clearSorting()
  }

  return (
    <Button onClick={toggleSorting} variant="ghost" className="w-full justify-center">
      <span className="ml-5">{label}</span>
      <SortIcon order={sortDirection} />
    </Button>
  )
}

function SortIcon({ order }: { order: false | 'asc' | 'desc' }) {
  if (order === 'asc') return <ChevronDown className="ml-1 size-4" />
  if (order === 'desc') return <ChevronUp className="ml-1 size-4" />
  return <div className="ml-1 size-4 opacity-0" />
}


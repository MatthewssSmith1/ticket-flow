import { Filter, ticketFilter } from '@/lib/filter'
import supabase, { unwrap } from '@/lib/supabase'
import { ColumnDef, Row } from '@tanstack/react-table'
import { SortableHeader } from './SortableHeader'
import { useViewStore } from '@/stores/viewStore'
import { GenericTable } from './GenericTable'
import { useNavigate } from '@tanstack/react-router'
import { useOrgStore } from '@/stores/orgStore'
import { useQuery } from '@tanstack/react-query'
import { Ticket, MemberAssignment } from '@/types/types'
import { Pill } from './Pill'

type TicketWithMembers = Ticket & { tickets_members: MemberAssignment[] }

export function TicketTable({ filters }: { filters?: Filter[] }) {
  const { openOrg, getMemberName } = useOrgStore()
  const { selectedView } = useViewStore()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tickets', openOrg?.id],
    queryFn: async () => {
      if (!openOrg) return []
      return (await supabase
        .from('tickets')
        .select('*, tickets_members(member_id, assigned_by)')
        .eq('org_id', openOrg.id)
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
      accessorKey: 'author_id',
      header: ({ column }) => <SortableHeader column={column} label="Author" />,
      cell: ({ row }) => getMemberName(row.original.author_id) ?? '-',
    },
    {
      accessorKey: 'subject',
      header: ({ column }) => <SortableHeader column={column} label="Subject" />,
      cell: ({ row }) => row.getValue('subject'),
    },
    {
      accessorKey: 'assignee',
      header: ({ column }) => <SortableHeader column={column} label="Assignee" />,
      cell: ({ row }) => getMemberName((row.original as TicketWithMembers).tickets_members[0]?.member_id) ?? '-',
    },
    {
      accessorKey: 'assigned_by',
      header: ({ column }) => <SortableHeader column={column} label="Assigned By" />,
      cell: ({ row }) => getMemberName((row.original as TicketWithMembers).tickets_members[0]?.assigned_by) ?? '-',
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
      accessorKey: 'tags',
      header: ({ column }) => <SortableHeader column={column} label="Tags" />,
      cell: ({ row }) => {
        const tags = row.getValue<string[]>('tags')
        return tags?.length ? tags.join(', ') : '-'
      },
    },
    {
      accessorKey: 'channel',
      header: ({ column }) => <SortableHeader column={column} label="Channel" />,
      cell: ({ row }) => <Pill text={row.getValue('channel')} />,
    },
    {
      accessorKey: 'verified_at',
      header: ({ column }) => <SortableHeader column={column} label="Submitted" />,
      cell: ({ row }) => {
        const date = row.getValue<string>('verified_at')
        return date ? new Date(date).toLocaleDateString() : '-'
      },
    },
  ]

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading tickets</div>

  const handleRowClick = (row: Row<Ticket>) => 
    navigate({ to: '/ticket/$id', params: { id: row.original.id } })

  return (
    <GenericTable
      data={data ?? []}
      columns={columns}
      onRowClick={handleRowClick}
      globalFilterFn={ticketFilter}
      globalFilter={filters ?? selectedView?.filters ?? []}
    />
  )
} 


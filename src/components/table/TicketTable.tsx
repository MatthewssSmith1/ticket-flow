import { formatAssignee, formatAssigner, formatTags } from '@/lib/string'
import { Filter, ticketFilter, COLUMN_IDS } from '@/lib/filter'
import { ColumnDef, Row, VisibilityState } from '@tanstack/react-table'
import { Ticket, Field, TicketWithRefs } from '@/types/types'
import { GenericTable, SortableHeader } from '@/components/table/GenericTable'
import supabase, { unwrap } from '@/lib/supabase'
import { useViewStore } from '@/stores/viewStore'
import { useNavigate } from '@tanstack/react-router'
import { useOrgStore } from '@/stores/orgStore'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Pill } from '@/components/Pill'

type Props = {
  filters?: Filter[]
  hiddenColumns?: string[]
}

export function TicketTable({ filters, hiddenColumns = [] }: Props) {
  const { openOrg, getMemberName, getTag } = useOrgStore()
  const { selectedView } = useViewStore()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tickets', openOrg?.id],
    queryFn: async () => {
      if (!openOrg) return []
      return (await supabase
        .from('tickets')
        .select('*, tags_tickets(tag_id), tickets_members(member_id, assigned_by), tickets_groups(group_id, assigned_by)')
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
      cell: ({ row }) => formatAssignee(row, openOrg) ?? '-',
    },
    {
      accessorKey: 'assigned_by',
      header: ({ column }) => <SortableHeader column={column} label="Assigned By" />,
      cell: ({ row }) => getMemberName(formatAssigner(row)) ?? '-',
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
      cell: ({ row }) => formatTags(row, getTag) ?? '-',
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
    ...getCustomColumns(openOrg?.fields),
  ]

  const columnVisibility = useMemo(() => 
    COLUMN_IDS.reduce((acc, columnId) => {
      acc[columnId] = hiddenColumns?.includes(columnId)
      return acc
    }, {} as VisibilityState),
    [hiddenColumns]
  )

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
      columnVisibility={columnVisibility}
    />
  )
} 

function getCustomColumns(fields?: Field[]): ColumnDef<Ticket>[] {
  return fields?.map(field => ({
    accessorKey: `field_${field.id}`,
    header: ({ column }) => <SortableHeader column={column} label={field.name} />,
    cell: ({ row }) => {
      const fields = (row.original as TicketWithRefs).tickets_fields
      const fieldValue = fields?.find(tf => tf.field_id === field.id)?.value

      if (!fieldValue) return '-'

      switch (field.field_type) {
        case 'BOOLEAN': return fieldValue === 'true' ? 'Yes' : 'No'
        case 'DATE': return new Date(fieldValue).toLocaleDateString()
        case 'SELECT':
        case 'MULTI_SELECT': return (JSON.parse(fieldValue) as string[]).join(', ')
        default: return fieldValue
      }
    },
  })) ?? []
}
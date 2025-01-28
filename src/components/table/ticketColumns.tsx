import { formatAssignee, formatAssigner, formatTags } from '../../lib/string'
import { Field, Ticket, TicketWithRefs } from '@shared/types'
import { SortableHeader } from '@/components/table/GenericTable'
import { useOrgStore } from '@/stores/orgStore'
import { ColumnDef } from '@tanstack/react-table'
import { Pill } from '@/components/Pill'

export const COLUMN_IDS = [
  'status',
  'priority',
  'author_id',
  'subject',
  'assignee',
  'assigned_by',
  'due_at',
  'tags',
  'channel',
  'verified_at'
] as const

export const fieldAccessorKey = (field: Field) => `field_${field.id}`

export const createTicketColumns = (store: ReturnType<typeof useOrgStore>): ColumnDef<Ticket>[] => [
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
    cell: ({ row }) => store.getMemberName(row.original.author_id) ?? '-',
  },
  {
    accessorKey: 'subject',
    header: ({ column }) => <SortableHeader column={column} label="Subject" />,
    cell: ({ row }) => row.getValue('subject'),
  },
  {
    accessorKey: 'assignee',
    header: ({ column }) => <SortableHeader column={column} label="Assignee" />,
    cell: ({ row }) => formatAssignee(row, store.openOrg) ?? '-',
  },
  {
    accessorKey: 'assigned_by',
    header: ({ column }) => <SortableHeader column={column} label="Assigned By" />,
    cell: ({ row }) => store.getMemberName(formatAssigner(row)) ?? '-',
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
    cell: ({ row }) => formatTags(row, store.getTag) ?? '-',
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
  ...getCustomColumns(store.openOrg?.fields),
]

function getCustomColumns(fields?: Field[]): ColumnDef<Ticket>[] {
  return fields?.map(field => ({
    accessorKey: fieldAccessorKey(field),
    header: ({ column }) => <SortableHeader column={column} label={field.name} />,
    cell: ({ row }) => {
      const fields = (row.original as TicketWithRefs).tickets_fields
      const fieldValue = fields?.find(tf => tf.field_id === field.id)?.value

      if (!fieldValue) return '-'

      switch (field.field_type) {
        case 'BOOLEAN': return fieldValue === 'true' ? 'Yes' : 'No'
        case 'DATE': return new Date(fieldValue).toLocaleDateString()
        default: return fieldValue
      }
    },
  })) ?? []
}
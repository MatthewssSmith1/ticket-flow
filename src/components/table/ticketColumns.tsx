import { formatAssignee, formatAssigner, formatTags } from '../../lib/string'
import { SortableHeader } from '@/components/table/GenericTable'
import { useOrgStore } from '@/stores/orgStore'
import { ColumnDef } from '@tanstack/react-table'
import { Ticket } from '@/types/types'
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
  // ...(fields?.map(field => ({
  //   accessorKey: `fields.${field.id}`,
  //   header: ({ column }: {column: Column<unknown, unknown>}) => <SortableHeader column={column} label={field.name} />,
  //   cell: ({ row }) => row.getValue(`fields.${field.id}`) ?? '-',
  // })) ?? [])
]
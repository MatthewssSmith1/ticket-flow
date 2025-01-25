import { ColumnDef, Row } from '@tanstack/react-table'
import { SortableHeader } from './SortableHeader'
import { GenericTable } from './GenericTable'
import { useNavigate } from '@tanstack/react-router'
import { useOrgStore } from '@/stores/orgStore'
import { Member } from '@/types/types'
import { Pill } from './Pill'

export function MemberTable() {
  const { openOrg } = useOrgStore()
  const navigate = useNavigate()

  if (!openOrg) return <div>Loading...</div>

  function handleRowClick(row: Row<Member>) {
    navigate({ to: '/member/$id', params: { id: row.original.id.toString() } })
  }

  return <GenericTable data={openOrg.members ?? []} columns={columns} onRowClick={handleRowClick} />
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
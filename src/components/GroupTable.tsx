import { ColumnDef, Row } from '@tanstack/react-table'
import { SortableHeader } from './SortableHeader'
import { GenericTable } from './GenericTable'
// import { useNavigate } from '@tanstack/react-router'
import { useOrgStore } from '@/stores/orgStore'
import { Group } from '@/types/types'

export function GroupTable() {
  const { openOrg } = useOrgStore()
  // const navigate = useNavigate()

  if (!openOrg) return <div>Loading...</div>

  function handleRowClick(row: Row<Group>) {
    console.log(row)
    // navigate({ to: '/group/$id', params: { id: row.original.id.toString() } })
  }

  return <GenericTable data={openOrg.groups} columns={columns} onRowClick={handleRowClick} />
}

const columns: ColumnDef<Group>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <SortableHeader column={column} label="Name" />,
    cell: ({ row }) => row.getValue('name'),
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <SortableHeader column={column} label="Description" />,
    cell: ({ row }) => row.getValue('description'),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <SortableHeader column={column} label="Created At" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return date.toLocaleDateString()
    },
  },
]

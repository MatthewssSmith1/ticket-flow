import { GenericTable, SortableHeader } from '@/components/table/GenericTable'
import { GroupWithMembers } from '@shared/types'
import { ColumnDef, Row } from '@tanstack/react-table'
import { GroupDialog } from '@/components/GroupDialog'
import { useOrgStore } from '@/stores/orgStore'
import { useState } from 'react'

export function GroupTable() {
  const { openOrg } = useOrgStore()
  const [dialogState, setDialogState] = useState<GroupWithMembers | 'create' | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  if (!openOrg) return <div>Loading...</div>

  function handleRowClick(row: Row<GroupWithMembers>) {
    setDialogState(row.original)
    setIsOpen(true)
  }

  function handleNewRowClick() {
    setDialogState('create')
    setIsOpen(true)
  }

  return (
    <>
      <GenericTable 
        data={openOrg.groups} 
        columns={columns} 
        onRowClick={handleRowClick}
        onNewRowClick={handleNewRowClick}
      />
      <GroupDialog
        open={isOpen}
        state={dialogState}
        onOpenChange={setIsOpen}
      />
    </>
  )
}

const columns: ColumnDef<GroupWithMembers>[] = [
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

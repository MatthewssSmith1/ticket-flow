import { GenericTable, SortableHeader } from '@/components/table/GenericTable'
import { ColumnDef, Row } from '@tanstack/react-table'
import { MemberDialog } from '@/components/MemberDialog'
import { useOrgStore } from '@/stores/orgStore'
import { useState } from 'react'
import { Member } from '@shared/types'
import { Pill } from '@/components/Pill'

export function MemberTable() {
  const { openOrg } = useOrgStore()
  const [dialogState, setDialogState] = useState<Member | 'create' | null>(null)

  if (!openOrg) return <div>Loading...</div>

  function handleRowClick(row: Row<Member>) {
    setDialogState(row.original)
  }

  function handleNewRowClick() {
    setDialogState('create')
  }

  return (
    <>
      <GenericTable 
        data={openOrg.members ?? []} 
        columns={columns} 
        onRowClick={handleRowClick}
        onNewRowClick={handleNewRowClick}
      />
      <MemberDialog
        open={dialogState !== null}
        state={dialogState}
        onOpenChange={(open) => !open && setDialogState(null)}
      />
    </>
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
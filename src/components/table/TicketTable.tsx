import { createTicketColumns, COLUMN_IDS } from '@/components/table/ticketColumns'
import { Filter, ticketFilter } from '@/lib/filter'
import { Row, VisibilityState } from '@tanstack/react-table'
import supabase, { unwrap } from '@/lib/supabase'
import { GenericTable } from '@/components/table/GenericTable'
import { useViewStore } from '@/stores/viewStore'
import { useNavigate } from '@tanstack/react-router'
import { useOrgStore } from '@/stores/orgStore'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Ticket } from '@/types/types'

export function TicketTable(props: { filters?: Filter[], hiddenColumns?: string[] }) {
  const orgStore = useOrgStore()
  const { selectedView } = useViewStore()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tickets', orgStore.openOrg?.id],
    queryFn: async () => {
      if (!orgStore.openOrg) return []
      return (await supabase
        .from('tickets')
        .select('*, tags_tickets(tag_id), tickets_members(member_id, assigned_by), tickets_groups(group_id, assigned_by)')
        .eq('org_id', orgStore.openOrg.id)
        .then(unwrap))
    }
  })

  const columns = useMemo(
    () => createTicketColumns(orgStore),
    [orgStore]
  )

  const columnVisibility = useMemo(() => 
    COLUMN_IDS.reduce((acc, columnId) => {
      acc[columnId] = (props.hiddenColumns ?? [])?.includes(columnId)
      return acc
    }, {} as VisibilityState),
    [props.hiddenColumns]
  )

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading tickets</div>

  return (
    <GenericTable
      data={data ?? []}
      columns={columns}
      onRowClick={(row: Row<Ticket>) => navigate({ to: '/ticket/$id', params: { id: row.original.id } })}
      globalFilterFn={ticketFilter}
      globalFilter={props.filters ?? selectedView?.filters ?? []}
      columnVisibility={columnVisibility}
    />
  )
} 

// function getCustomColumns(fields?: Field[]): ColumnDef<Ticket>[] {
//   return fields?.map(field => ({
//     accessorKey: `field_${field.id}`,
//     header: ({ column }) => <SortableHeader column={column} label={field.name} />,
//     cell: ({ row }) => {
//       const fields = (row.original as TicketWithRefs).tickets_fields
//       const fieldValue = fields?.find(tf => tf.field_id === field.id)?.value

//       if (!fieldValue) return '-'

//       switch (field.field_type) {
//         case 'BOOLEAN': return fieldValue === 'true' ? 'Yes' : 'No'
//         case 'DATE': return new Date(fieldValue).toLocaleDateString()
//         case 'SELECT':
//         case 'MULTI_SELECT': return (JSON.parse(fieldValue) as string[]).join(', ')
//         default: return fieldValue
//       }
//     },
//   })) ?? []
// }
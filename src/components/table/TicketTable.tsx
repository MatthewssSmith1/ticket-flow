import { createTicketColumns, COLUMN_IDS, getCustomColumnId } from '@/components/table/ticketColumns'
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

export function TicketTable(props: { filters?: Filter[], visibleColumns?: string[] }) {
  const { selectedView } = useViewStore()
  const navigate = useNavigate()

  const orgStore = useOrgStore()
  const { openOrg } = orgStore

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

  const columns = useMemo(() => createTicketColumns(orgStore), [orgStore])

  const columnVisibility = useMemo(() => {
    const state: VisibilityState = {}
    
    COLUMN_IDS.forEach(columnId => {
      state[columnId] = props.visibleColumns?.includes(columnId) ?? true
    })

    openOrg?.fields?.forEach(field => {
      state[getCustomColumnId(field)] = props.visibleColumns?.includes(field.name) ?? true
    })

    return state
  }, [props.visibleColumns, openOrg?.fields])

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

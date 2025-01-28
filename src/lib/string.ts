import { Ticket, Group, Member, TicketWithRefs } from '@shared/types'
import { Row } from '@tanstack/react-table'
import { OrgState } from '@/stores/orgStore'

export function formatAssignee(row: Row<Ticket>, openOrg: OrgState | null) {
  const { tickets_groups, tickets_members } = row.original as TicketWithRefs
  if (!openOrg) return '-'

  const groups = tickets_groups
    .map(tg => openOrg.groups.find(g => g.id === tg.group_id)).filter(Boolean) as Group[]

  if (groups.length === 1) return groups[0].name
  if (groups.length > 1) return `${groups.length} groups`

  const individuals = tickets_members
    .map(tm => openOrg.members.find(m => m.id === tm.member_id)).filter(Boolean) as Member[]

  if (individuals.length === 1) return individuals[0].name
  if (individuals.length > 1) return `${individuals.length} people`

  return null
}

export function formatAssigner(row: Row<Ticket>) {
  const ticket = row.original as TicketWithRefs
  
  return [...ticket.tickets_groups, ...ticket.tickets_members]
    .map((obj) => obj.assigned_by as number | null)
    .filter(Boolean)[0]
}

export function formatTags(row: Row<Ticket>, getTag: (id: number) => { name: string } | null) {
  const { tags_tickets } = row.original as TicketWithRefs

  if (tags_tickets.length === 0) return null

  const str = tags_tickets.map(tt => getTag(tt.tag_id)?.name).filter(Boolean).join(', ') 
  
  const MAX_LEN = 20
  return str.length > MAX_LEN ? `${str.slice(0, MAX_LEN)}...` : str
}
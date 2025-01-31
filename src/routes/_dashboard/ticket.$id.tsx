import supabase, { unwrap } from '@/lib/supabase'
import { createFileRoute } from '@tanstack/react-router'
import { TicketMessages } from '@/components/TicketMessages'
import { useOrgStore } from '@/stores/orgStore'
import { EditTicket } from '@/components/EditTicket'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_dashboard/ticket/$id')({
  loader: async ({ params }) => ({
    ticket: await supabase
      .from('tickets')
      .select('*, tickets_members(member_id), tickets_groups(group_id), tags_tickets(tag_id), tickets_fields(*)')
      .eq('id', params.id)
      .single()
      .then(unwrap),
  }),
  component: TicketPage,
})

function TicketPage() {
  const { authMember } = useOrgStore()

  if (!authMember) return null

  const canEditTicket = authMember.role !== 'CUSTOMER'

  return (
    <main className={cn(
      "grid grid-cols-1",
      canEditTicket ? "@4xl:grid-cols-[2fr_3fr] @4xl:h-full" : "h-full"
    )}>
      {canEditTicket && <EditTicket />}
      <TicketMessages />
    </main>
  )
}

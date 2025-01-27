import supabase, { unwrap } from '@/lib/supabase'
import { createFileRoute } from '@tanstack/react-router'
import { TicketMessages } from '@/components/TicketMessages'
import { EditTicket } from '@/components/EditTicket'

export const Route = createFileRoute('/_dashboard/ticket/$id')({
  loader: async ({ params }) => ({
    ticket: await supabase
      .from('tickets')
      .select('*, tickets_members(member_id), tickets_groups(group_id), tags_tickets(tag_id), tickets_fields(*)')
      .eq('id', params.id)
      .single()
      .then(unwrap),
  }),
  component: () => (
    <main className="grid grid-cols-1 @4xl:grid-cols-[2fr_3fr] @4xl:h-full">
      <EditTicket />
      <TicketMessages />
    </main>
  ),
})

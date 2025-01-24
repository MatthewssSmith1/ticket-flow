import supabase, { unwrap } from '@/lib/supabase'
import { createFileRoute } from '@tanstack/react-router'
import { TicketMessages } from '@/components/TicketMessages'
import { EditTicket } from '@/components/EditTicket'
import { Views } from '@/components/Views'
import { z } from 'zod'

const ticketSearchSchema = z.object({
  id: z.string().uuid().optional(),
})

export const Route = createFileRoute('/_dashboard/tickets')({
  validateSearch: (search) => {
    const result = ticketSearchSchema.safeParse(search)

    if (!result.success) return { id: undefined }

    return result.data
  },
  beforeLoad: async ({ search: { id } }) => {
    if (!id) return { ticket: null }

    return { 
      ticket: await supabase.from('tickets').select('*').eq('id', id).single().then(unwrap)
    }
  },
  component: () => {
    const { ticket } = Route.useRouteContext()

    if (!ticket) return <Views />

    return (
      <main className="grid lg:grid-cols-[2fr_3fr] gap-6 overflow-y-auto">
        <EditTicket ticket={ticket} />
        <TicketMessages ticket={ticket} />
      </main>
    )
  },
})


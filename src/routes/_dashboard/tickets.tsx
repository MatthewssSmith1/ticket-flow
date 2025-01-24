import { createFileRoute } from '@tanstack/react-router'
import { TicketView } from '@/components/Ticket'
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
  component: () => {
    const { id } = Route.useSearch()
    if (id) return <TicketView id={id} />
    return <Views />
  },
})


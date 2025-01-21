import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { queryClient } from '@/main'
import { supabase } from '@/lib/supabase'
import { Ticket } from '@/lib/types'

const ticketsQueryOptions = queryOptions({
  queryKey: ['tickets'],
  queryFn: async () => {
    const { data, error } = await supabase.from('tickets').select('*')
    if (error) throw new Error(error.message)
    return data as Ticket[]
  },
})

export const Route = createFileRoute('/_dashboard/views')({
  component: Views,
  loader: () => queryClient.ensureQueryData(ticketsQueryOptions),
})

function Views() {
  const { data: tickets } = useSuspenseQuery(ticketsQueryOptions)

  return (
    <main className="grid grid-cols-[1fr_2fr]">
      <section>
        <h1 className="text-2xl font-bold">Views</h1>
      </section>
      <section>
        <h1 className="text-2xl font-bold">Messages</h1>
        <ul>
          {tickets && tickets.map((ticket, index) => (
            <li key={index}>{ticket.title}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}

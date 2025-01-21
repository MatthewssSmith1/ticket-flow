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
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Subject</th>
              <th className="text-left p-2">Description</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Name</th>
            </tr>
          </thead>
          <tbody>
            {tickets && tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b">
                <td className="p-2">{ticket.status}</td>
                <td className="p-2">{ticket.subject}</td>
                <td className="p-2">{ticket.description}</td>
                <td className="p-2">{ticket.email || '-'}</td>
                <td className="p-2">{ticket.name || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}

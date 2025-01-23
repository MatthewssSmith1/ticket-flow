import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import supabase, { unwrap } from '@/lib/supabase'
import { createFileRoute } from '@tanstack/react-router'
import { queryClient } from '@/main'
import { Ticket } from '@/types/types'

const ticketsQueryOptions = queryOptions({
  queryKey: ['tickets'],
  queryFn: async (): Promise<Ticket[]> => 
    (await supabase.from('tickets').select('*').then(unwrap)),
})

export const Route = createFileRoute('/_dashboard/views')({
  component: Views,
  loader: () => queryClient.ensureQueryData(ticketsQueryOptions),
})

function Views() {
  const { data: tickets } = useSuspenseQuery(ticketsQueryOptions)

  return (
    <main className="grid grid-cols-[1fr]">
      {/* <section>
        <h1 className="text-2xl font-bold">Views</h1>
      </section> */}
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

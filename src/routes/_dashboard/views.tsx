import supabase, { unwrap } from '@/lib/supabase'
import { createFileRoute } from '@tanstack/react-router'
import { useOrgStore } from '@/stores/orgStore'
import { useQuery } from '@tanstack/react-query'
import { Ticket } from '@/types/types'

export const Route = createFileRoute('/_dashboard/views')({
  component: Views,
})

function Views() {
  const { currentOrg } = useOrgStore()
  const { data: tickets = [], isLoading, isError } = useQuery({
    queryKey: ['tickets', currentOrg?.id],
    queryFn: async (): Promise<Ticket[]> => {
      if (!currentOrg) return []
      return (await supabase
        .from('tickets')
        .select('*')
        .eq('org_id', currentOrg.id)
        .then(unwrap))
    }
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading tickets</div>

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


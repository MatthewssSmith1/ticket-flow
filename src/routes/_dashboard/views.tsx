import supabase, { unwrap } from '@/lib/supabase'
import { createFileRoute } from '@tanstack/react-router'
import { useOrgStore } from '@/stores/orgStore'
import { useQuery } from '@tanstack/react-query'
import { Ticket } from '@/types/types'
import { TicketTable } from '@/components/TicketTable'

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
        <h1 className="text-2xl font-bold mb-2">Messages</h1>
        <TicketTable tickets={tickets} />
      </section>
    </main>
  )
}


import { createFileRoute } from '@tanstack/react-router'
import { useViewStore } from '@/stores/viewStore'
import { TicketTable } from '@/components/TicketTable'
import { Button } from '@/components/ui/button'
import { z } from 'zod'

const ticketSearchSchema = z.object({
  id: z.string().uuid().optional(),
})

export const Route = createFileRoute('/_dashboard/tickets')({
  component: Views,
  validateSearch: (search) => {
    const result = ticketSearchSchema.safeParse(search);
    if (!result.success) {
      throw new Error('Invalid search params');
    }
    return result.data;
  },
})

function Views() {
  const { id } = Route.useSearch()

  if (id) return <Ticket id={id} />

  return (
    <main className="grid grid-cols-[1fr_2fr]">
      <section className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Views</h1>
        <ViewList />
      </section>
      <section className="p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-2">Messages</h1>
        <TicketTable />
      </section>
    </main>
  )
}

function Ticket({ id }: { id: string }) {

  return (
    <main>
      <h1 className="text-2xl font-bold">Ticket {id}</h1>
    </main>
  )
}

function ViewList() {
  const { views, selectedView, setSelectedView } = useViewStore()

  return (
    <div className="space-y-2">
      {views.map((view) => (
        <Button
          key={view.id}
          variant={selectedView?.id === view.id ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setSelectedView(view.id)}
        >
          {view.name}
        </Button>
      ))}
    </div>
  )
}

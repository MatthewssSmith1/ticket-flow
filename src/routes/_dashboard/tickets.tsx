import { createFileRoute } from '@tanstack/react-router'
import { useViewStore } from '@/stores/viewStore'
import { TicketTable } from '@/components/TicketTable'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_dashboard/tickets')({
  component: () => (
    <main className="grid grid-cols-[1fr_2fr]">
      <section className="px-4 py-2 space-y-2">
        <ViewList />
      </section>
      <section className="px-4 py-2 space-y-2">
        <TicketTable />
      </section>
    </main>
  )
})

function ViewList() {
  const { views, selectedView, setSelectedView } = useViewStore()

  return (
    <div className="space-y-2 w-[150px]">
      <h1 className="text-2xl font-bold text-center mb-2">Views</h1>
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
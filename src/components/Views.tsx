import { useViewStore } from '@/stores/viewStore'
import { TicketTable } from '@/components/TicketTable'
import { Button } from '@/components/ui/button'

export function Views() {
  return (
    <main className="grid grid-cols-[1fr_2fr]">
      <section className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Views</h1>
        <ViewList />
      </section>
      <section className="p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-2">Tickets</h1>
        <TicketTable />
      </section>
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
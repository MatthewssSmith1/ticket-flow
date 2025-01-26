import { Card, CardHeader, CardTitle, CardContent } from '@ui/card'
import { createFileRoute } from '@tanstack/react-router'
import { EditTags } from '@/components/EditTags'

export const Route = createFileRoute('/_dashboard/settings')({
  component: Settings,
})

function Settings() {
  return (
    <main className="grid grid-cols-2 grid-rows-2 gap-6">
      <EditTags />

      <Card>
        <CardHeader>
          <CardTitle>Ticket Fields</CardTitle>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>
    </main>
  )
}
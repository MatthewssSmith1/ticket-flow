import { createFileRoute } from '@tanstack/react-router'
import { EditFields } from '@/components/EditFields'
import { EditTags } from '@/components/EditTags'

export const Route = createFileRoute('/_dashboard/settings')({
  component: Settings,
})

function Settings() {
  return (
    <main className="grid @3xl:grid-cols-2 grid-rows-2 gap-6">
      <EditTags />
      <EditFields />
    </main>
  )
}
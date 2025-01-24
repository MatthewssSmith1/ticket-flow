import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/settings')({
  component: Settings,
})

function Settings() {
  return (
    <main>
      <div>Settings</div>
    </main>
  )
}

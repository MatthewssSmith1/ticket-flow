import { createFileRoute } from '@tanstack/react-router'
import Login from '@/components/Login'

export const Route = createFileRoute('/dashboard')({
  component: DashboardIndex,
  beforeLoad: async ({ context }) => {
    if (!context.user) throw new Error('Not authenticated')
  },
  errorComponent: () => <Login />,
})

function DashboardIndex() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
  )
}

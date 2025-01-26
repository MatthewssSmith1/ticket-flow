import { createFileRoute, Outlet } from '@tanstack/react-router'
import { DashboardSidebar } from '@/components/DashboardSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import Login from '@/components/auth/Login'

export const Route = createFileRoute('/_dashboard')({
  component: DashboardIndex,
  beforeLoad: async ({ context }) => {
    if (!context.user) throw new Error('Not authenticated')
  },
  errorComponent: () => <Login />,
})

function DashboardIndex() {
  const { user } = Route.useRouteContext()

  if (!user) return null

  return (
    <SidebarProvider className="sidebar-container">
      <DashboardSidebar />
      <Outlet />
    </SidebarProvider>
  )
}

import { createFileRoute, Outlet } from '@tanstack/react-router'
import { DashboardSidebar } from '@/components/DashboardSidebar'
import supabase, { unwrap } from '@/lib/supabase'
import { SidebarProvider } from '@/components/ui/sidebar'
import Login from '@/components/auth/Login'

export const Route = createFileRoute('/_dashboard')({
  component: DashboardIndex,
  beforeLoad: async ({ context }) => {
    if (!context.user) throw new Error('Not authenticated')

    const orgIds = await supabase
      .from('members')
      .select('org_id')
      .eq('user_id', context.user.id)
      .then(unwrap)
      .then(orgs => orgs.map(o => o.org_id))

    return { orgIds }
  },
  errorComponent: () => <Login />,
})

function DashboardIndex() {
  const { user } = Route.useRouteContext()

  if (!user) return null

  return (
    <SidebarProvider className="[&>main]:flex-1 [&>main]:overflow-y-auto [&>main]:p-8">
      <DashboardSidebar />
      <Outlet />
    </SidebarProvider>
  )
}

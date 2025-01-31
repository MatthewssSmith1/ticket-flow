import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ChatSidebar } from '@/components/ChatSidebar'
import { useOrgStore } from '@/stores/orgStore'
import { NavSidebar } from '@/components/NavSidebar'
import Login from '@/components/auth/Login'

export const Route = createFileRoute('/_dashboard')({
  component: Layout,
  beforeLoad: async ({ context }) => {
    if (!context.user) throw new Error('Not authenticated')
  },
  errorComponent: () => <Login />,
})

function Layout() {
  const { isCustomer } = useOrgStore()
  const { user } = Route.useRouteContext()

  if (!user) return null

  return (
    <>
      <NavSidebar />
      <div className="@container h-[100dvh] w-full p-6 lg:p-8 [&>main]:gap-6 overflow-y-auto">
        <Outlet />
      </div>
      { !isCustomer && <ChatSidebar /> }
    </>
  )
}

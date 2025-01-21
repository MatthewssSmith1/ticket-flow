import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { getUser } from '@/lib/utils'
import { User } from '@supabase/supabase-js'

interface RootContext {
  user: User | null
}

export const Route = createRootRouteWithContext<RootContext>()({
  component: App,
  beforeLoad: async () => ({ user: await getUser() }),
})

function App() {
  return (
    <>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  )
} 
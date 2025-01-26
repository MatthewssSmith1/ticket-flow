import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from '@ui/toaster'
import { getUser } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { Ticket } from '@/types/types'

export type Context = {
  user: User | null
  ticket: Ticket | null
}

export const Route = createRootRouteWithContext<Context>()({
  beforeLoad: async () => ({ user: await getUser() }),
  component: () => (<>
    <Outlet />
    <Toaster />
    {/* <TanStackRouterDevtools /> */}
  </>),
})

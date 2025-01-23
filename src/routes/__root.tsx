import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from '@/components/ui/toaster'
import { getUser } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export type Context = {
  user: User | null
  orgIds: string[]
}

export const Route = createRootRouteWithContext<Context>()({
  beforeLoad: async () => ({ user: await getUser() }),
  component: () => (<>
    <Outlet />
    {/* <TanStackRouterDevtools /> */}
    <Toaster />
  </>),
})

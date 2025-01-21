import { createFileRoute, redirect } from '@tanstack/react-router'
import Login from '@/components/auth/Login'

export const Route = createFileRoute('/(auth)/login')({
  component: Login,
  beforeLoad: async ({ context }) => {
    if (context.user) throw redirect({ to: '/dashboard' })
  },
})

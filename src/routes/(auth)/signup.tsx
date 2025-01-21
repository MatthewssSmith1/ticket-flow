import { createFileRoute, redirect } from '@tanstack/react-router'
import Signup from '@/components/auth/Signup'

export const Route = createFileRoute('/(auth)/signup')({
  component: Signup,
  beforeLoad: async ({ context }) => {
    if (context.user) throw redirect({ to: '/home' })
  },
})

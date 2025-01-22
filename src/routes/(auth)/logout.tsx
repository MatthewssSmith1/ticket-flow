import { createFileRoute, redirect } from '@tanstack/react-router'
import supabase from '@/lib/supabase'

export const Route = createFileRoute('/(auth)/logout')({
  preload: false,
  component: () => null,
  loader: async () => {
    const { error } = await supabase.auth.signOut()

    if (error) return { error: true, message: error.message }

    throw redirect({ href: '/' })
  },
})

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import supabase, { unwrap } from '@/lib/supabase'
import { useEffect } from 'react'
import { toast } from '@/hooks/use-toast'
import { z } from 'zod'

const searchSchema = z.object({
  id: z.string().uuid('Invalid ticket ID'),
})

export const Route = createFileRoute('/_public/verify-ticket')({
  validateSearch: searchSchema,
  component: VerifyTicket,
  beforeLoad: async ({ context }) => console.log('beforeLoad', context.user),
})

function VerifyTicket() {
  const { id: ticketId } = Route.useSearch()
  const { user } = Route.useRouteContext()
  const navigate = useNavigate()

  useEffect(() => {
    async function verifyTicket() {
      if (!user) return

      const ticket = await supabase
        .from('tickets')
        .select()
        .eq('id', ticketId)
        .single()
        .then(unwrap)

      const author_id = await getOrCreateMember(user.id, ticket.org_id, ticket.name)
      const verified_at = new Date().toISOString()

      await supabase
        .from('tickets')
        .update({ author_id, verified_at, email: null, name: null })
        .eq('id', ticketId)
        .then(unwrap)

      navigate({ to: '/home' })
    }

    try {
      verifyTicket()
    } catch (e: any) {
      toast({
        title: 'Error',
        description: e.message || 'Something went wrong. Please try again.',
        variant: 'destructive'
      })
    }
  }, [ticketId, navigate, user])

  return <div>Verifying ticket...</div>
}

// TODO: share across backend and frontend
async function getOrCreateMember(user_id: string, org_id: string, name: string | null) {
  const member = await supabase.from('members')
    .select()
    .eq('user_id', user_id)
    .eq('org_id', org_id)
    .maybeSingle()
    .then(unwrap)

  if (member) return member.id
  
  name ??= 'Unnamed User'
  return await supabase.from('members')
      .insert({ user_id, org_id, role: 'CUSTOMER', name })
      .select()
      .single()
      .then(unwrap)
      .then(member => member.id)
}
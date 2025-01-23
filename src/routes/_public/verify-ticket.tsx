import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import supabase from '@/lib/supabase'
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

      const { data: ticketData, error: ticketError } = await supabase.from('tickets')
        .select()
        .eq('id', ticketId)
        .single()

      if (ticketError) throw ticketError

      const authorId = await getOrCreateMember(user.id, ticketData.org_id)

      const { error: updateError } = await supabase.from('tickets')
        .update({ author_id: authorId, email: null })
        .eq('id', ticketId)

      if (updateError) throw updateError

      navigate({ to: '/home' })
    }

    try {
      verifyTicket()
    } catch (e: any) {
      console.log('Error verifying ticket', e)
    }
  }, [ticketId, navigate, user])

  return <div>Verifying ticket...</div>
}

async function getOrCreateMember(userId: string, orgId: string): Promise<number> {
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select()
    .eq('user_id', userId)
    .eq('org_id', orgId)
    .single()

  if (memberError && memberError.code !== 'PGRST116') throw memberError

  if (member) return member.id

  const { data: newMember, error: createError } = await supabase
    .from('members')
    .insert({
      user_id: userId,
      org_id: orgId,
      role: 'CUSTOMER'
    })
    .select()
    .single()

  if (createError) throw createError

  return newMember.id
} 
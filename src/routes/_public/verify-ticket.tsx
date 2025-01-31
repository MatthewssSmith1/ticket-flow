import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import supabase from '@/lib/supabase'
import { z } from 'zod'

const searchSchema = z.object({
  id: z.string().uuid('Invalid ticket ID'),
})

export const Route = createFileRoute('/_public/verify-ticket')({
  validateSearch: searchSchema,
  component: VerifyTicket,
})

function VerifyTicket() {
  const { id: ticketId } = Route.useSearch()
  const { user } = Route.useRouteContext()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    async function verifyTicket() {
      if (!user) return

      const { error } = await supabase.functions.invoke('verify-ticket', {
        body: {
          ticketId,
          userId: user.id,
        },
      })

      if (error) throw new Error(error.message || 'Failed to verify ticket')

      toast({
        title: 'Success',
        description: 'Ticket verified successfully',
      })
      navigate({ to: '/tickets' })
    }

    verifyTicket().catch((error) => {
      console.error(error)
      toast({
        title: 'Verification Failed',
        description: error.message,
        variant: 'destructive',
      })
    })
  }, [ticketId, navigate, user, toast])

  return <div>Verifying ticket...</div>
}
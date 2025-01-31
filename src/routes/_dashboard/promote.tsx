import { createFileRoute } from '@tanstack/react-router'
import { useOrgStore } from '@/stores/orgStore'
import { useNavigate } from '@tanstack/react-router' 
import { useEffect } from 'react'
import supabase from '@/lib/supabase'

export const Route = createFileRoute('/_dashboard/promote')({
  component: RouteComponent,
})

function RouteComponent() {
  const { authMember } = useOrgStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authMember) return

    const promoteUser = async () => {
      try {
        const { error } = await supabase.functions.invoke('promote-member', {
          body: { memberId: authMember.id },
        })

        if (error) throw error

        navigate({ to: '/tickets' })
      } catch (error) {
        console.error('Promotion failed:', error)
      }
    }

    promoteUser()
  }, [authMember])

  return (
    <div>
      <h1>Promoting User...</h1>
    </div>
  )
}

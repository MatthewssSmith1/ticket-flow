import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'
import { MemberTable } from '@/components/MemberTable'
import { useOrgStore } from '@/stores/orgStore'
import { z } from 'zod'
import supabase, { unwrap } from '@/lib/supabase'
import { EnumInstance } from '@/types/types'
import { EnumSelect } from '@/components/EnumSelect'
import { Role } from '@/types/types'
import { Separator } from '@/components/ui/separator'
import { TicketTable } from '@/components/TicketTable'
import { authorEq } from '@/lib/filter'

const memberSearchSchema = z.object({
  id: z.number().int().optional(),
})

export const Route = createFileRoute('/_dashboard/people')({
  validateSearch: (search) => {
    const result = memberSearchSchema.safeParse(search)

    if (!result.success) return { id: undefined }

    return { id: result.data.id }
  },
  component: Customers,
})

function Customers() {
  const { id } = Route.useSearch()

  if (!id) return (
    <main>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Organization Members</CardTitle>
        </CardHeader>
        <CardContent>
          <MemberTable />
        </CardContent>
      </Card>
    </main>
  )

  return <MemberView id={id} />
}

function MemberView({ id }: { id: number }) {
  const { members } = useOrgStore()
  const member = members?.find((m) => m.id === id)

  if (!member) return <div>Member not found</div>

  const joinedDate = new Date(member.created_at).toLocaleDateString('en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  function setRole(role: EnumInstance) {
    if (!member) return
    supabase.from('members').update({ role: role as Role }).eq('id', member.id).then(unwrap)
  }

  return (
    <main className="grid sm:grid-cols-[1fr_1fr] gap-6 overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle>{member?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-w-[300px] space-y-6 [&_h2]:text-sm [&_h2]:font-medium [&_h2]:text-muted-foreground [&_h2]:mb-2 [&_h2]:select-none">
            <div>
              <h2>Joined on {joinedDate}</h2>
            </div>
            <Separator />
            <div>
              <h2>Role</h2>
              <EnumSelect enumKey="role" value={member.role} onValueChange={setRole} />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Authored Tickets</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <TicketTable filters={[authorEq(member.id)]} />
        </CardContent>
      </Card>
    </main>
  )
}

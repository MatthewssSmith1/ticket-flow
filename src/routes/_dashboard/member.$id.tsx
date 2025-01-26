import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import supabase, { unwrap } from '@/lib/supabase'
import { createFileRoute } from '@tanstack/react-router'
import { EnumInstance } from '@/types/types'
import { TicketTable } from '@/components/table/TicketTable'
import { EnumSelect } from '@/components/select/EnumSelect'
import { Separator } from '@/components/ui/separator'
import { authorEq } from '@/lib/filter'
import { Role } from '@/types/types'
import { toast } from '@/hooks/use-toast'

export const Route = createFileRoute('/_dashboard/member/$id')({
  loader: async ({ params }) => ({
    member: await supabase
      .from('members')
      .select()
      .eq('id', parseInt(params.id))
      .single()
      .then(unwrap),
  }),
  component: MemberView,
})

function MemberView() {
  const { member } = Route.useLoaderData()

  const setRole = async (role: EnumInstance) => {
    const { error } = await supabase
      .from('members')
      .update({ role: role as Role })
      .eq('id', member.id)

    if (error) toast({
      variant: "destructive",
      title: "Error updating role",
      description: error.message
    })
  }

  return (
    <main className="grid sm:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>{member.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-w-[300px] space-y-6 [&_h2]:text-sm [&_h2]:font-medium [&_h2]:text-muted-foreground [&_h2]:mb-2 [&_h2]:select-none">
            <div>
              <h2>Joined on {formatDate(member.created_at)}</h2>
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

const formatDate = (date: string) => 
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

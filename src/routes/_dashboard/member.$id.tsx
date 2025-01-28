import supabase, { unwrap } from '@/lib/supabase'
import { createFileRoute } from '@tanstack/react-router'
import { EnumInstance } from '@/types/types'
import { TicketTable } from '@/components/table/TicketTable'
import { EnumSelect } from '@/components/select/EnumSelect'
import { authorEq } from '@/lib/filter'
import { toast } from '@/hooks/use-toast'
import { Role } from '@/types/types'

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
    <main className="grid grid-rows-[auto_1fr] h-full">
      <section className="flex items-center gap-6">
        <div>
          <h1 className="text-xl font-semibold">{member.name}</h1>
          <h2 className="text-muted-foreground text-xs mt-0.5">Joined {formatDate(member.created_at)}</h2>
        </div>
        <EnumSelect enumKey="role" value={member.role} onValueChange={setRole} />
      </section>
      <section className="shadow rounded-md border overflow-auto [&>*]:border-0 [&_table]:h-full">
        <TicketTable filters={[authorEq(member.id)]} />
      </section>
    </main>
  )
}

const formatDate = (date: string) => 
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'
import { MemberTable } from '@/components/MemberTable'
import { GroupTable } from '@/components/GroupTable'

export const Route = createFileRoute('/_dashboard/members')({
  component: Members,
})

function Members() {
  return (
    <main className="grid grid-cols-2 gap-4">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <GroupTable />
        </CardContent>
      </Card>
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
}

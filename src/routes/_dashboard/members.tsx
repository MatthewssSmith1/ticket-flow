import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { createFileRoute } from '@tanstack/react-router'
import { MemberTable } from '@/components/table/MemberTable'
import { GroupTable } from '@/components/table/GroupTable'

export const Route = createFileRoute('/_dashboard/members')({
  component: Members,
})

function Members() {
  return (
    <main className="grid grid-cols-1 @7xl:grid-cols-[3fr_2fr] @7xl:h-full">
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

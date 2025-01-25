import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'
import { MemberTable } from '@/components/MemberTable'

export const Route = createFileRoute('/_dashboard/members')({
  component: Members,
})

function Members() {
  return (
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
}

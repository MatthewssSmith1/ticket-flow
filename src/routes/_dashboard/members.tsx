import { createFileRoute } from '@tanstack/react-router'
import { MemberTable } from '@/components/table/MemberTable'
import { GroupTable } from '@/components/table/GroupTable'

export const Route = createFileRoute('/_dashboard/members')({
  component: () => (
    <main className="grid grid-cols-1 @7xl:grid-cols-[3fr_2fr] @7xl:h-full">
      <section className="h-full">
        <h1 className="w-full text-center text-xl font-semibold mb-4 select-none">Groups</h1>
        <GroupTable />
      </section>
      <section className="h-full mt-4 @7xl:mt-0">
        <h1 className="w-full text-center text-xl font-semibold mb-4 select-none">Organization Members</h1>
        <MemberTable />
      </section>
    </main>
  ),
})
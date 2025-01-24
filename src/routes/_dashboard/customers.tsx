import { createFileRoute } from '@tanstack/react-router'
import { MemberTable } from '@/components/MemberTable'

export const Route = createFileRoute('/_dashboard/customers')({
  component: Customers,
})

function Customers() {
  return (
    <main>
      <section className="px-4 py-2 space-y-2">
        <MemberTable />   
      </section>
    </main>
  )
}
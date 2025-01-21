import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/customers')({
  component: Customers,
})

function Customers() {
  return (
    <main>
      <div>Customers</div>
    </main>
  )
}

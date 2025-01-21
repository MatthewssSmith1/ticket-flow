import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/home')({
  component: Home,
})

function Home() {
  return (
    <main>
      <div>
        <h1>Dashboard Home</h1>
      </div>
    </main>
  )
}

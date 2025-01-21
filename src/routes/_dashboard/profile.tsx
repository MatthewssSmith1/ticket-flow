import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/profile')({
  component: Profile,
})

function Profile() {
  return (
    <main>
      <div>Profile</div>
    </main>
  )
}

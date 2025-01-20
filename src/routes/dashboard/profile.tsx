import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/profile')({
  component: Profile,
})

function Profile() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Profile</h1>
      <p className="mt-4">This is your profile page.</p>
    </div>
  )
} 
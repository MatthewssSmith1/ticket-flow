import { createFileRoute, Link, Outlet, linkOptions } from '@tanstack/react-router'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <div className="min-h-screen">
      <nav className="border-b container mx-auto px-4 py-2 flex gap-4">
        <NavLinks />
        <div className="flex-1" />
        <AuthLinks />
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
} 

const navLinks = linkOptions([
  { to: '/', label: 'Home' },
  { to: '/ticket', label: 'Submit ticket' },
  { to: '/tickets', label: 'Dashboard' },
])

function NavLinks() {
  return (
    <>
      {navLinks.map((link, index) => (
        <Link key={index} to={link.to} activeProps={{ className: 'font-bold' }}>
          {link.label}
        </Link>
      ))}
    </>
  )
}

function AuthLinks() {
  const { user } = Route.useRouteContext()

  if (user) return <Link to="/logout">Logout</Link>

  return (
    <>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
    </>
  )
}
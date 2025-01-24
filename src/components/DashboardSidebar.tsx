import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroupLabel,
  SidebarGroupContent, SidebarGroup, SidebarMenuItem, SidebarMenuButton, SidebarMenu
} from '@/components/ui/sidebar'
import { Building, ChevronsUpDown, Home, Plus, Tags, UserIcon, Users, LogOutIcon, Ticket } from 'lucide-react'
import { Link, getRouteApi, linkOptions } from '@tanstack/react-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useOrganizations } from '@/stores/orgStore'
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Fragment } from "react/jsx-runtime"
import { Button } from '@/components/ui/button'

export function DashboardSidebar() {
  return (
    <Sidebar>
      <Header />

      <SidebarContent>
        <PagesGroup />
      </SidebarContent>

      <Footer />
    </Sidebar>
  )
}

const pageLinks = linkOptions([
  { to: '/home', label: 'Home', icon: Home },
  { to: '/tickets', label: 'Tickets', icon: Tags },
  { to: '/customers', label: 'Customers', icon: Users },
])

function PagesGroup() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Pages</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {pageLinks.map(({ to, label, icon: Icon }, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild>
                <Link to={to} activeProps={{ className: 'bg-accent' }} className="transition-colors">
                  <Icon className="mr-2 size-4" />
                  <span>{label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function Header() {
  const { user } = getRouteApi('/_dashboard').useRouteContext()
  const { orgs, currentOrg, setCurrentOrg } = useOrganizations(user?.id)

  if (!orgs?.length) {
    return (
      <SidebarHeader>
        <Button variant="ghost" className="w-full justify-start" disabled>
          <Building className="mr-2 h-4 w-4" />
          <span className="flex-1 text-left">No Organizations</span>
        </Button>
      </SidebarHeader>
    )
  }

  return (
    <SidebarHeader>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start">
            <Building className="mr-2 h-4 w-4" />
            <span className="flex-1 text-left">{currentOrg?.name}</span>
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {orgs.map((org) => (
            <DropdownMenuItem 
              key={org.id} 
              onSelect={() => setCurrentOrg(org)}
            >
              <Building className="mr-2 h-4 w-4" />
              {org.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <Plus className="mr-2 h-4 w-4" />
            New Organization
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarHeader>
  )
}

const footerLinks = linkOptions([
  { to: '/', label: 'Landing Page', separator: false, icon: Home },
  { to: '/ticket', label: 'Submit ticket', separator: false, icon: Ticket },
  { to: '/profile', label: 'Profile', separator: false, icon: UserIcon },
  { to: '/logout', label: 'Logout', separator: true, icon: LogOutIcon },
])

function Footer() {
  const routeApi = getRouteApi('/_dashboard');
  const { user } = routeApi.useRouteContext();

  if (!user) return null

  return (
    <SidebarFooter>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex-1 min-w-0 h-max py-1.5 px-3">
              <Avatar className="shrink-0 mr-2 h-6 w-6">
                <AvatarFallback>
                  {user.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm min-w-0 mr-auto overflow-hidden [&>span]:truncate [&>span]:w-full [&>span]:text-left">
                <span className="font-medium">{user.email?.split('@')[0]}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            {footerLinks.map(({ to, label, separator, icon: Icon }, index) => (
              <Fragment key={index}>
                {separator && <DropdownMenuSeparator />}
                <Link to={to}>
                  <DropdownMenuItem>
                    <Icon className="mr-1 size-4" />
                    <span>{label}</span>
                  </DropdownMenuItem>
                </Link>
              </Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle />
      </div>
    </SidebarFooter>
  )
} 
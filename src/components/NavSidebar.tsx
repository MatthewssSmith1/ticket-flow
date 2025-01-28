import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarTrigger, useSidebar, SidebarProvider, SidebarRail } from '@ui/sidebar'
import { SidebarGroupLabel, SidebarGroupContent, SidebarGroup, SidebarMenuItem, SidebarMenuButton, SidebarMenu } from '@ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@ui/dropdown-menu"
import { Building, ChevronsUpDown, Home, Plus, Tags, Users, LogOutIcon, Ticket, Settings } from 'lucide-react'
import { Link, getRouteApi, linkOptions } from '@tanstack/react-router'
import { Avatar, AvatarFallback } from '@ui/avatar'
import { useEffect, ElementType } from "react"
import { useOrgStore } from '@/stores/orgStore'
import { ThemeToggle } from "@ui/theme-toggle"
import { Fragment } from "react/jsx-runtime"
import { Button } from '@ui/button'

export function NavSidebar() {
  return (
    <SidebarProvider style={{"--sidebar-width": "14rem", "--sidebar-width-mobile": "14rem"} as React.CSSProperties}>
      <Sidebar collapsible="icon" side="left">
        <Header />
        <SidebarContent> 
          <PagesGroup /> 
        </SidebarContent>
        <Footer />
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  )
}

const pageLinks: Array<{ to: string, label: string, icon: ElementType }> = [
  { to: '/tickets', label: 'Tickets', icon: Tags },
  { to: '/members', label: 'People', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function PagesGroup() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="select-none">Pages</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {pageLinks.map(({ to, label, icon: Icon }, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild tooltip={label}>
                <Link to={to} activeProps={{ className: 'bg-accent' }} className="transition-colors select-none">
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
  const { orgs, openOrg, setOpenOrg, loadOrgs } = useOrgStore()
  const { state } = useSidebar()

  useEffect(() => {
    if (user && orgs.length === 0) loadOrgs(user.id)
  }, [user, orgs, loadOrgs])

  return (
    <SidebarHeader>
      <div className="flex items-center gap-2">
        {state !== "collapsed" && (
          orgs.length === 0 ? (
            <Button variant="ghost" className="flex-1 justify-start" disabled>
              <Building className="mr-2 h-4 w-4" />
              <span className="flex-1 text-left">No Organizations</span>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex-1 justify-start">
                  <Building className="mr-2 h-4 w-4" />
                  <span className="flex-1 text-left">{openOrg?.name}</span>
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {orgs.map((org) => (
                  <DropdownMenuItem key={org.id} onSelect={() => setOpenOrg(org, user?.id)}>
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
          )
        )}
        <SidebarTrigger className="size-8" />
      </div>
    </SidebarHeader>
  )
}

const footerLinks = linkOptions([
  { to: '/', label: 'Landing Page', separator: false, icon: Home },
  { to: '/ticket', label: 'Submit ticket', separator: false, icon: Ticket },
  { to: '/logout', label: 'Logout', separator: true, icon: LogOutIcon },
])

function Footer() {
  const routeApi = getRouteApi('/_dashboard');
  const { user } = routeApi.useRouteContext();
  const { state } = useSidebar();

  if (!user) return null

  return (
    <SidebarFooter>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex-1 min-w-0 h-max py-1.5 px-3">
              <Avatar className="shrink-0 h-6 w-6">
                <AvatarFallback>
                  {user.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {state !== "collapsed" && <div className="flex flex-col items-start text-sm min-w-0 ml-2 mr-auto overflow-hidden [&>span]:truncate [&>span]:w-full [&>span]:text-left">
                <span className="font-medium">{user.email?.split('@')[0]}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>}
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
        {state !== "collapsed" && <ThemeToggle />}
      </div>
    </SidebarFooter>
  )
} 
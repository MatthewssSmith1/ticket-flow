/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PublicImport } from './routes/_public'
import { Route as DashboardImport } from './routes/_dashboard'
import { Route as PublicIndexImport } from './routes/_public/index'
import { Route as PublicVerifyTicketImport } from './routes/_public/verify-ticket'
import { Route as PublicTicketImport } from './routes/_public/ticket'
import { Route as DashboardTicketsImport } from './routes/_dashboard/tickets'
import { Route as DashboardSettingsImport } from './routes/_dashboard/settings'
import { Route as DashboardPeopleImport } from './routes/_dashboard/people'
import { Route as authSignupImport } from './routes/(auth)/signup'
import { Route as authLogoutImport } from './routes/(auth)/logout'
import { Route as authLoginImport } from './routes/(auth)/login'

// Create/Update Routes

const PublicRoute = PublicImport.update({
  id: '/_public',
  getParentRoute: () => rootRoute,
} as any)

const DashboardRoute = DashboardImport.update({
  id: '/_dashboard',
  getParentRoute: () => rootRoute,
} as any)

const PublicIndexRoute = PublicIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => PublicRoute,
} as any)

const PublicVerifyTicketRoute = PublicVerifyTicketImport.update({
  id: '/verify-ticket',
  path: '/verify-ticket',
  getParentRoute: () => PublicRoute,
} as any)

const PublicTicketRoute = PublicTicketImport.update({
  id: '/ticket',
  path: '/ticket',
  getParentRoute: () => PublicRoute,
} as any)

const DashboardTicketsRoute = DashboardTicketsImport.update({
  id: '/tickets',
  path: '/tickets',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardSettingsRoute = DashboardSettingsImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardPeopleRoute = DashboardPeopleImport.update({
  id: '/people',
  path: '/people',
  getParentRoute: () => DashboardRoute,
} as any)

const authSignupRoute = authSignupImport.update({
  id: '/(auth)/signup',
  path: '/signup',
  getParentRoute: () => rootRoute,
} as any)

const authLogoutRoute = authLogoutImport.update({
  id: '/(auth)/logout',
  path: '/logout',
  getParentRoute: () => rootRoute,
} as any)

const authLoginRoute = authLoginImport.update({
  id: '/(auth)/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_dashboard': {
      id: '/_dashboard'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof DashboardImport
      parentRoute: typeof rootRoute
    }
    '/_public': {
      id: '/_public'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof PublicImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/login': {
      id: '/(auth)/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof authLoginImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/logout': {
      id: '/(auth)/logout'
      path: '/logout'
      fullPath: '/logout'
      preLoaderRoute: typeof authLogoutImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/signup': {
      id: '/(auth)/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof authSignupImport
      parentRoute: typeof rootRoute
    }
    '/_dashboard/people': {
      id: '/_dashboard/people'
      path: '/people'
      fullPath: '/people'
      preLoaderRoute: typeof DashboardPeopleImport
      parentRoute: typeof DashboardImport
    }
    '/_dashboard/settings': {
      id: '/_dashboard/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof DashboardSettingsImport
      parentRoute: typeof DashboardImport
    }
    '/_dashboard/tickets': {
      id: '/_dashboard/tickets'
      path: '/tickets'
      fullPath: '/tickets'
      preLoaderRoute: typeof DashboardTicketsImport
      parentRoute: typeof DashboardImport
    }
    '/_public/ticket': {
      id: '/_public/ticket'
      path: '/ticket'
      fullPath: '/ticket'
      preLoaderRoute: typeof PublicTicketImport
      parentRoute: typeof PublicImport
    }
    '/_public/verify-ticket': {
      id: '/_public/verify-ticket'
      path: '/verify-ticket'
      fullPath: '/verify-ticket'
      preLoaderRoute: typeof PublicVerifyTicketImport
      parentRoute: typeof PublicImport
    }
    '/_public/': {
      id: '/_public/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof PublicIndexImport
      parentRoute: typeof PublicImport
    }
  }
}

// Create and export the route tree

interface DashboardRouteChildren {
  DashboardPeopleRoute: typeof DashboardPeopleRoute
  DashboardSettingsRoute: typeof DashboardSettingsRoute
  DashboardTicketsRoute: typeof DashboardTicketsRoute
}

const DashboardRouteChildren: DashboardRouteChildren = {
  DashboardPeopleRoute: DashboardPeopleRoute,
  DashboardSettingsRoute: DashboardSettingsRoute,
  DashboardTicketsRoute: DashboardTicketsRoute,
}

const DashboardRouteWithChildren = DashboardRoute._addFileChildren(
  DashboardRouteChildren,
)

interface PublicRouteChildren {
  PublicTicketRoute: typeof PublicTicketRoute
  PublicVerifyTicketRoute: typeof PublicVerifyTicketRoute
  PublicIndexRoute: typeof PublicIndexRoute
}

const PublicRouteChildren: PublicRouteChildren = {
  PublicTicketRoute: PublicTicketRoute,
  PublicVerifyTicketRoute: PublicVerifyTicketRoute,
  PublicIndexRoute: PublicIndexRoute,
}

const PublicRouteWithChildren =
  PublicRoute._addFileChildren(PublicRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof PublicRouteWithChildren
  '/login': typeof authLoginRoute
  '/logout': typeof authLogoutRoute
  '/signup': typeof authSignupRoute
  '/people': typeof DashboardPeopleRoute
  '/settings': typeof DashboardSettingsRoute
  '/tickets': typeof DashboardTicketsRoute
  '/ticket': typeof PublicTicketRoute
  '/verify-ticket': typeof PublicVerifyTicketRoute
  '/': typeof PublicIndexRoute
}

export interface FileRoutesByTo {
  '': typeof DashboardRouteWithChildren
  '/login': typeof authLoginRoute
  '/logout': typeof authLogoutRoute
  '/signup': typeof authSignupRoute
  '/people': typeof DashboardPeopleRoute
  '/settings': typeof DashboardSettingsRoute
  '/tickets': typeof DashboardTicketsRoute
  '/ticket': typeof PublicTicketRoute
  '/verify-ticket': typeof PublicVerifyTicketRoute
  '/': typeof PublicIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_dashboard': typeof DashboardRouteWithChildren
  '/_public': typeof PublicRouteWithChildren
  '/(auth)/login': typeof authLoginRoute
  '/(auth)/logout': typeof authLogoutRoute
  '/(auth)/signup': typeof authSignupRoute
  '/_dashboard/people': typeof DashboardPeopleRoute
  '/_dashboard/settings': typeof DashboardSettingsRoute
  '/_dashboard/tickets': typeof DashboardTicketsRoute
  '/_public/ticket': typeof PublicTicketRoute
  '/_public/verify-ticket': typeof PublicVerifyTicketRoute
  '/_public/': typeof PublicIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/login'
    | '/logout'
    | '/signup'
    | '/people'
    | '/settings'
    | '/tickets'
    | '/ticket'
    | '/verify-ticket'
    | '/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | ''
    | '/login'
    | '/logout'
    | '/signup'
    | '/people'
    | '/settings'
    | '/tickets'
    | '/ticket'
    | '/verify-ticket'
    | '/'
  id:
    | '__root__'
    | '/_dashboard'
    | '/_public'
    | '/(auth)/login'
    | '/(auth)/logout'
    | '/(auth)/signup'
    | '/_dashboard/people'
    | '/_dashboard/settings'
    | '/_dashboard/tickets'
    | '/_public/ticket'
    | '/_public/verify-ticket'
    | '/_public/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  DashboardRoute: typeof DashboardRouteWithChildren
  PublicRoute: typeof PublicRouteWithChildren
  authLoginRoute: typeof authLoginRoute
  authLogoutRoute: typeof authLogoutRoute
  authSignupRoute: typeof authSignupRoute
}

const rootRouteChildren: RootRouteChildren = {
  DashboardRoute: DashboardRouteWithChildren,
  PublicRoute: PublicRouteWithChildren,
  authLoginRoute: authLoginRoute,
  authLogoutRoute: authLogoutRoute,
  authSignupRoute: authSignupRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_dashboard",
        "/_public",
        "/(auth)/login",
        "/(auth)/logout",
        "/(auth)/signup"
      ]
    },
    "/_dashboard": {
      "filePath": "_dashboard.tsx",
      "children": [
        "/_dashboard/people",
        "/_dashboard/settings",
        "/_dashboard/tickets"
      ]
    },
    "/_public": {
      "filePath": "_public.tsx",
      "children": [
        "/_public/ticket",
        "/_public/verify-ticket",
        "/_public/"
      ]
    },
    "/(auth)/login": {
      "filePath": "(auth)/login.tsx"
    },
    "/(auth)/logout": {
      "filePath": "(auth)/logout.tsx"
    },
    "/(auth)/signup": {
      "filePath": "(auth)/signup.tsx"
    },
    "/_dashboard/people": {
      "filePath": "_dashboard/people.tsx",
      "parent": "/_dashboard"
    },
    "/_dashboard/settings": {
      "filePath": "_dashboard/settings.tsx",
      "parent": "/_dashboard"
    },
    "/_dashboard/tickets": {
      "filePath": "_dashboard/tickets.tsx",
      "parent": "/_dashboard"
    },
    "/_public/ticket": {
      "filePath": "_public/ticket.tsx",
      "parent": "/_public"
    },
    "/_public/verify-ticket": {
      "filePath": "_public/verify-ticket.tsx",
      "parent": "/_public"
    },
    "/_public/": {
      "filePath": "_public/index.tsx",
      "parent": "/_public"
    }
  }
}
ROUTE_MANIFEST_END */

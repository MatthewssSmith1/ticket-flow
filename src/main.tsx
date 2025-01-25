import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { StrictMode } from 'react'
import { routeTree } from './routeTree.gen'
import ReactDOM from 'react-dom/client'

import './index.css'

const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
  context: {
    user: null,
    ticket: null
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const queryClient = new QueryClient()

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}
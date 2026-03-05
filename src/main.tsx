import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';
import { AuthProvider } from './shared/contexts/AuthContext';
import './index.css'

const router = createRouter({ 
  routeTree,
  context: {
    auth: undefined
  }
})
const queryClient = new QueryClient()

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
  </StrictMode>,
)

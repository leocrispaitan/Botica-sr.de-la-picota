import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { queryClient } from './lib/queryClient'
import { RealtimeProvider } from './lib/realtime'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        {/* Capa de tiempo real: sincroniza la caché con eventos del backend */}
        <RealtimeProvider />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
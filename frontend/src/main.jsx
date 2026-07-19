import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from "@clerk/react"
const clerkFrontendApi = import.meta.env.VITE_CLERK_FRONTEND_API

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider frontendApi={clerkFrontendApi}>
      <App />
    </ClerkProvider>
  </StrictMode>,
)

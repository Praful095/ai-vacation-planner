import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CreateTrip from './components/create-trip/index.jsx'
import Header from './components/custom/Header.jsx'
import { Toaster } from "@/components/ui/sonner"
import { GoogleOAuthProvider } from '@react-oauth/google'
import ViewTrip from './services/view-trip/[tripId]/viewTrip.jsx'
import MyTrips from './components/MyTrips.jsx'
const router = createBrowserRouter([{
  path: '/',
  element: <App />
},

{
  path: '/create-trip',
  element: <CreateTrip />
}
,
{
  path:'/view-trip/:tripId',
  element:<ViewTrip/>
},
{
  path:'/my-trip',
  element:<MyTrips/>
}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>

  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Toaster />
      <Header />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>,
)

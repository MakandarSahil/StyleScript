
import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import Navbar from '../components/Navbar'
import NotFound from '../components/NotFound'
// import Footer from '@/components/Footer'

export const Route = createRootRoute({
  component : RootComponent,
  notFoundComponent: NotFound
})

function RootComponent() {
  const { pathname } = useLocation()

  return (
    <>
      <div className="min-h-screen bg-black text-white">
      {pathname==='/' ? <Navbar /> : null}
      <Outlet/>
    </div>
    </>
  )
}
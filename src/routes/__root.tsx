import* as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import Navbar from '../components/Navbar'

export const Route = createRootRoute({
  component : RootComponent,
})

function RootComponent() {
  return (
    <>
      <Navbar />
      <hr className='border-gray-100'/>
      <Outlet />
    </>
  )
}
import { RouterProvider } from '@tanstack/react-router'
import React from 'react'
import router from './router'


/* 
  1) File based Routing
  2) Dynamic Routing 
  3) Nested Routing 
  4) Data Loading
  5) Search Params
  6) Path Params
  7) Code Spliting 
  8) Not found Errors

*/

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { ModelPathProvider } from './context/ModelPathContext'


export default function App() {
  return (
    <React.Fragment>
      <ModelPathProvider>
        <AppRoutes />
      </ModelPathProvider>
    </React.Fragment>
  )
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className='p-10'>
        <h1 className='text-4xl font-bold mb-2'>Welcome to TanStack React Router</h1>
        <p className='text-gray-800'>
          Following features- 
        </p>
        <ul className='text-gray-600 text-sm'>
          <li>File Based Routing</li>
          <li>Dyanamic Routing</li>
          <li>Nested Routing</li>
          <li>Data Loading</li>
          <li>Search Params</li>
          <li>Path Params</li>
          <li>Code Spliting</li>
          <li>Not Found Errors</li>
        </ul>
      </div>
    </>

  )
}

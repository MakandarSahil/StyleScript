import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className='p-10'>
        <h2 className='text-4xl font-bold mb-2'>Users Details</h2>
        <p className='text-gray-800'>
          This is user details
        </p>
      </div>
    </>
  )
}

import { createFileRoute, Link } from '@tanstack/react-router'
import { fetchUser, User } from '../../services/users'

export const Route = createFileRoute('/users/$userid')({
  component: RouteComponent,
  loader: async ({ params: { userid } }) => {
    // throw new Error();
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    return fetchUser(userid)
  },
  pendingComponent: () => <div className='p-10'>Loading...</div>,
  errorComponent: () => <div className='p-10'>There was an Error Fetching Data...</div>,
})

function RouteComponent() {
  const { data }: { data: User } = Route.useLoaderData()
  return (
    <>
      <div className='p-10'>
        <h2 className='text-4xl font-bold mb-2'>Users Details</h2>
        <div className='flex mb-4'>
          <div className='mr-3'>
            <img key={data.avatar} src={data.avatar} className='w-20 h-20 rounded-full' />
          </div>
          <div className='flex flex-col'>
            <span>{data.first_name} {data.last_name}</span>
            <span>{data.email}</span>
          </div>
        </div>
        <Link search= {{page:2}} to='/users' className='text-blue-500 hover:text-blue-700'>
          Back to Users
        </Link>
      </div>
    </>
  )
}

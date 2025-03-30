import { createFileRoute, Link } from '@tanstack/react-router'
import { fetchUsers, User } from '../../services/users'

export const Route = createFileRoute('/users/')({
  component: RouteComponent,
  loader: () => fetchUsers(),
})

function RouteComponent() {
  const { data } = Route.useLoaderData();
  return (
    <>
      <div className='p-10'>
        <h2 className='text-4xl font-bold mb-2'>Users listing</h2>
        <ul>
          {data.map((u: User) => (
            <li key={u.id} className='mb-2'>
              <Link
                to='/users/$userid'
                params={{ userid: u.id }}
                className='text-blue-500 hover:text-blue-700'
              >
                {u.first_name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

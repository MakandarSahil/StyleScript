import { Link } from '@tanstack/react-router'

const Navbar = () => {
  return (
    <div className="md-flex space-x-6 mx-4 py-3">
      <Link to='/' activeProps={{ className: 'font-bold' }}>Home</Link>
      <Link to='/users'
        search={{
          page: 2
        }}
        activeProps={{ className: 'font-bold' }}>Users</Link>
      <Link to='/about' activeProps={{ className: 'font-bold' }}>About</Link>
    </div>
  )
}

export default Navbar
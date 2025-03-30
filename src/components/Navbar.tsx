import { Link } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"

const Navbar = () => {
  return (

    <div className='w-full p-4 fixed flex items-center justify-between bg-pink-400 text-white'>
      <nav className="w-full flex items-center jutify-between">
        <div className="left">StyleScript</div>
        <div className="center">
          <Link to='/' activeProps={{ className: 'font-bold' }}>
            <Button>Home</Button>
          </Link>
          <Link to='/' activeProps={{ className: 'font-bold' }}>
            <Button>Shop</Button>
          </Link>
          <Link to='/' activeProps={{ className: 'font-bold' }}>
            <Button>Showcase</Button>
          </Link>
          <Link to='/' activeProps={{ className: 'font-bold' }}>
            <Button>About Us</Button>
          </Link>
        </div>
        <div className="right">
          <Link to='/' activeProps={{ className: 'font-bold' }}>
            <Button>Login</Button>
          </Link>
          <Link to='/' activeProps={{ className: 'font-bold' }}>
            <Button>Sign Up</Button>
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
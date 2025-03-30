import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from './ui/button'
import { Menu, X, ChevronDown } from 'lucide-react' // Import icons

const components = [
  { title: "Alert Dialog", href: "/docs/primitives/alert-dialog", description: "A modal dialog that interrupts the user with important content and expects a response." },
  { title: "Hover Card", href: "/docs/primitives/hover-card", description: "For sighted users to preview content available behind a link." },
  { title: "Progress", href: "/docs/primitives/progress", description: "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar." },
  { title: "Scroll-area", href: "/docs/primitives/scroll-area", description: "Visually or semantically separates content." },
  { title: "Tabs", href: "/docs/primitives/tabs", description: "A set of layered sections of content—known as tab panels—that are displayed one at a time." },
  { title: "Tooltip", href: "/docs/primitives/tooltip", description: "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it." },
]

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </a>
    </NavigationMenuLink>
  </li>
))

ListItem.displayName = "ListItem"

// const MobileListItem = ({ title, href, description } : any) => (
//   <Link to={href} className="block p-3 border-b border-gray-100">
//     <div className="font-medium">{title}</div>
//     <p className="text-sm text-gray-500">{description}</p>
//   </Link>
// )

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    setExpandedSection(null) // Reset expanded sections when toggling menu
  }

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  return (
    <div className="w-full px-4 md:px-10 py-4 md:py-6 fixed flex items-center justify-between text-black bg-black z-50">
      <nav className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Left - Brand Name */}
        <div className="text-lg font-bold text-white">StyleScript</div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden text-white p-2 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu - shows when toggle is active */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 bg-white z-50 p-4 md:hidden overflow-y-auto">
            <div className="flex flex-col space-y-2">
              {/* Getting Started Section */}
              <div className="border rounded-md overflow-hidden">
                <button 
                  onClick={() => toggleSection('getting-started')}
                  className="w-full p-4 text-left font-medium flex justify-between items-center bg-gray-50"
                >
                  Getting Started
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform ${expandedSection === 'getting-started' ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {expandedSection === 'getting-started' && (
                  <div className="p-2 bg-white">
                    <div className="bg-gray-50 p-4 mb-3 rounded-md">
                      <div className="font-medium">shadcn/ui</div>
                      <p className="text-sm text-gray-500">
                        Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.
                      </p>
                    </div>
                    <Link to='/' className="block p-3 hover:bg-gray-50 rounded-md">
                      <div className="font-medium">Introduction</div>
                      <p className="text-sm text-gray-500">Reusable components built using Radix UI and Tailwind CSS.</p>
                    </Link>
                    <Link to='/' className="block p-3 hover:bg-gray-50 rounded-md">
                      <div className="font-medium">Installation</div>
                      <p className="text-sm text-gray-500">How to install dependencies and structure your app.</p>
                    </Link>
                    <Link to='/' className="block p-3 hover:bg-gray-50 rounded-md">
                      <div className="font-medium">Typography</div>
                      <p className="text-sm text-gray-500">Styles for headings, paragraphs, lists, etc.</p>
                    </Link>
                  </div>
                )}
              </div>

              {/* Components Section */}
              <div className="border rounded-md overflow-hidden">
                <button 
                  onClick={() => toggleSection('components')}
                  className="w-full p-4 text-left font-medium flex justify-between items-center bg-gray-50"
                >
                  Components
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform ${expandedSection === 'components' ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {expandedSection === 'components' && (
                  <div className="p-2 bg-white">
                    {components.map(component => (
                      <Link 
                        key={component.title} 
                        to={component.href} 
                        className="block p-3 hover:bg-gray-50 rounded-md"
                      >
                        <div className="font-medium">{component.title}</div>
                        <p className="text-sm text-gray-500">{component.description}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Documentation Link */}
              <Link to="/" className="p-4 text-left font-medium border rounded-md hover:bg-gray-50">
                Documentation
              </Link>

              {/* Auth Buttons */}
              <div className="pt-4 flex flex-col gap-2">
                <Link to="/">
                  <Button className="w-full">Login</Button>
                </Link>
                <Link to="/">
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Navigation - hidden on mobile */}
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList className='flex gap-8'>
              {/* Getting Started Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className='rounded-full'>Getting Started</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link to="/" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                          <div className="mb-2 mt-4 text-lg font-medium">shadcn/ui</div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/docs" title="Introduction">
                      Reusable components built using Radix UI and Tailwind CSS.
                    </ListItem>
                    <ListItem href="/docs/installation" title="Installation">
                      How to install dependencies and structure your app.
                    </ListItem>
                    <ListItem href="/docs/primitives/typography" title="Typography">
                      Styles for headings, paragraphs, lists, etc.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Components Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className='rounded-full'>Components</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {components.map((component) => (
                      <ListItem key={component.title} title={component.title} href={component.href}>
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Direct Link - Documentation */}
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                  Documentation
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right - Auth Buttons - hidden on mobile */}
        <div className="hidden md:flex gap-2">
          <Link to="/">
            <Button>Login</Button>
          </Link>
          <Link to="/">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
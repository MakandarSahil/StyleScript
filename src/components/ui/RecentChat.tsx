import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

const RecentChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="relative">  
        {/* Mobile Toggle Button */}
        <button
          className="md:hidden absolute text-white p-8"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-black text-white p-8 flex flex-col transition-transform transform md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
            } md:relative md:flex`}
        >
          {/* Logo */}
          <div className="flex items-center justify-between mb-24">
            <h1 className="text-xl font-bold">StyleScript</h1>
            <button className="md:hidden" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="space-y-5 text-[13px] font-medium">
            <a href="#" className="block hover:text-gray-400">Research</a>
            <a href="#" className="block hover:text-gray-400">Safety</a>
            <a href="#" className="block hover:text-gray-400">ChatGPT</a>
            <a href="#" className="block hover:text-gray-400">Sora</a>
            <a href="#" className="block hover:text-gray-400">API Platform</a>
            <a href="#" className="block hover:text-gray-400">For Business</a>
            <a href="#" className="block hover:text-gray-400">Stories</a>
            <a href="#" className="block hover:text-gray-400">Company</a>
            <a href="#" className="block hover:text-gray-400">News</a>
          </nav>

          {/* Home Button at Bottom */}
          <div className="mt-20">
            <Link to="/">
              <Button variant="outline" className="text-black text-sm w-full">
                Go to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentChat;

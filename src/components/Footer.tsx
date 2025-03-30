import React from "react";
import { cn } from "@/lib/utils";

// Import shadcn components
import { 
  Separator 
} from "@/components/ui/separator";

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn("w-full bg-white text-black py-8 px-4 md:px-8 border-t border-gray-800", className)}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <span className="text-black font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-xl">StyleScript</span>
            </div>
            <p className="text-gray-400 text-sm">
              A product by <a href="#" className="text-blue-500 hover:text-blue-400">StyleScript</a>
            </p>
            <p className="text-gray-400 text-sm">
              Building in public at <a href="#" className="text-blue-500 hover:text-blue-400">@stylescript</a>
            </p>
          </div>

          {/* First Links Column */}
          <div className="col-span-1">
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-900 hover:text-black transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-900 hover:text-black transition-colors">
                  Components
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-900 hover:text-black transition-colors">
                  Templates
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-900 hover:text-black transition-colors">
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-900 hover:text-black transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Second Links Column */}
          <div className="col-span-1">
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-900 hover:text-black transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-900 hover:text-black transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-900 hover:text-black transition-colors">
                  Box Shadows
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-900 hover:text-black transition-colors">
                  Showcase
                </a>
              </li>
            </ul>
          </div>

          {/* Third Links Column */}
          <div className="col-span-1">
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-900 hover:text-black transition-colors">
                  StyleScript Pro
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-900 hover:text-black transition-colors">
                  StyleScript
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section - Mobile Friendly */}
        <Separator className="my-6 bg-gray-800" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-zinc-800 text-sm">
          <div className="mb-4 md:mb-0">
            © {new Date().getFullYear()} StyleScript. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-zinc-800 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-zinc-800 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
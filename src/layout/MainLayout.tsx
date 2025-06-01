import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react';
import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <React.Fragment>
      <div className="min-h-screen bg-[#F5F4F9]">
        <div className='pb-20'>
          <Navbar />
        </div>
        {children} {/* Render children here */}
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default MainLayout;

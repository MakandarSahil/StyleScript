import RecentChat from '@/pages/chat/RecentChat';
import type { ReactNode } from 'react';

interface ChatLayoutProps {
  children: ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  return (
    <div className='flex h-screen bg-white'>
      {/* Sidebar - fixed width and full height */}
      <div className="hidden md:block w-64 bg-white border-r border-gray-200">
        <RecentChat />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {children}
      </div>
    </div>
  );
}

export default ChatLayout;
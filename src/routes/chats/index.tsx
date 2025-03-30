import { createFileRoute } from '@tanstack/react-router';
import Chat from '@/pages/Chat';
import RecentChat from '@/components/ui/RecentChat';

export const Route = createFileRoute('/chats/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className='flex gap-0 lg:gap-18 bg-black'>
        <div className="left z-50">
          <RecentChat />
        </div>
        <div className="right">
          <Chat />
        </div>
      </div>
    </>
  );
}

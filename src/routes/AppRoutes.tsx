import ChatLayout from '@/layout/ChatLayout';
import MainLayout from '@/layout/MainLayout';
import Auth from '@/pages/Auth/Auth';
import Chat from '@/pages/chat/Chat';
import CatalogItem from '@/pages/Item/CatelogItem';
import Catlog from '@/pages/Main/Catlog';
import HomePage from '@/pages/Main/HomePage';
import { Suspense } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
  // Navigate,
} from 'react-router-dom';

const MainLayoutWrapper = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

const ChatLayoutWrapper = () => (
  <ChatLayout>
    <Outlet />
  </ChatLayout>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public main routes */}
      <Route path='/' element={<MainLayoutWrapper />}>
        <Route index element={<HomePage />} />
        <Route path='/catalog' element={<Catlog />} />
      </Route>
      <Route path='/auth' element={<Auth />} />
      <Route path="/catalog/:itemId" element={<CatalogItem />} />

      {/* chats routes */}
      <Route path='/chats' element={<ChatLayoutWrapper />}>
        <Route index element={<Chat />} />
      </Route>

    </>
  )
)

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default AppRoutes
import ChatLayout from '@/layout/ChatLayout';
import MainLayout from '@/layout/MainLayout';
import Auth from '@/pages/Auth/Auth';
import CartPage from '@/pages/Cart/CartPage';
import Chat from '@/pages/chat/ChatPage';
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
      </Route>
      <Route path='/auth' element={<Auth />} />

      {/* chats routes */}
      <Route path='/chats' element={<ChatLayoutWrapper />}>
        <Route index element={<Chat />} />
      </Route>

      <Route path='/catalog' element={<Catlog />} ></Route>
      <Route path="/catalog/:itemId" element={<CatalogItem />} />

      {/* cart routes */}
      <Route path="/cart" element={<CartPage />} />
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
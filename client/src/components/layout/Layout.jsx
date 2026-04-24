// client/src/components/layout/Layout.jsx

import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const { pathname } = useLocation();
  // Pages that need full-width treatment (no footer padding)
  const isAuthPage = ['/login', '/register'].includes(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-1 ${isAuthPage ? '' : ''}`}>
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const timer = window.setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return undefined;
  }, [pathname, hash]);

  return null;
}

export default function Layout() {
  return (
    <div className="app-shell">
      <ScrollManager />
      <Navbar />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

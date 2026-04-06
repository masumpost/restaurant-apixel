import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import MobileNav from './MobileNav';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileNav />
    </div>
  );
}

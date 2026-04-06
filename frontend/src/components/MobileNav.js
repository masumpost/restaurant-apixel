import { Link, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, BookOpen, Info, Phone } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/menu', icon: UtensilsCrossed, label: 'Menu' },
  { path: '/blog', icon: BookOpen, label: 'Blog' },
  { path: '/about', icon: Info, label: 'About' },
  { path: '/contact', icon: Phone, label: 'Contact' },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-primary/10">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              data-testid={`mobile-bottom-nav-${item.label.toLowerCase()}`}
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                isActive ? 'text-primary' : 'text-cream/50'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOGO_URL = "https://static.prod-images.emergentagent.com/jobs/3330e33a-96b1-42f2-92f1-58cb71a063d6/images/e13015c09058157c7450da00998284b591ee87bef11acd270db7e3b77b23fb66.png";

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Menu', path: '/menu' },
  { name: 'Blog', path: '/blog' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="header-logo">
            <img src={LOGO_URL} alt="Panshi Restaurant" className="h-12 w-auto" />
            <div className="hidden sm:block">
              <h1 className="font-serif text-xl text-cream">Panshi</h1>
              <p className="text-xs text-cream/60">পানসি রেস্টুরেন্টস</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-${link.name.toLowerCase()}`}
                className={`text-sm font-medium tracking-wider uppercase transition-colors ${
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-cream/70 hover:text-cream'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://wa.me/8801322411534?text=Hello,%20I'd%20like%20to%20place%20an%20order!"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="header-order-btn"
              className="px-6 py-2.5 bg-primary text-background font-bold text-sm uppercase tracking-wider rounded-full hover:bg-primary-hover transition-colors btn-glow"
            >
              Order Now
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-cream"
            data-testid="mobile-menu-btn"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-primary/10"
          >
            <nav className="px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  data-testid={`mobile-nav-${link.name.toLowerCase()}`}
                  className={`block text-lg font-medium ${
                    location.pathname === link.path
                      ? 'text-primary'
                      : 'text-cream/70'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="https://wa.me/8801322411534?text=Hello,%20I'd%20like%20to%20place%20an%20order!"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-6 py-3 bg-primary text-background font-bold uppercase tracking-wider rounded-full"
              >
                Order Now
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

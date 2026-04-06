import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Home, UtensilsCrossed } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Panshi Restaurants</title>
      </Helmet>

      <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <h1 className="font-serif text-8xl text-primary mb-4">404</h1>
          <h2 className="font-serif text-3xl text-cream mb-4">Page Not Found</h2>
          <p className="text-cream/60 mb-8">
            Oops! The page you're looking for seems to have wandered off. 
            Let's get you back to something delicious.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              data-testid="404-home"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-background font-bold uppercase tracking-wider rounded-full hover:bg-primary-hover transition-colors"
            >
              <Home size={18} />
              Go Home
            </Link>
            <Link
              to="/menu"
              data-testid="404-menu"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary font-bold uppercase tracking-wider rounded-full hover:bg-primary hover:text-background transition-colors"
            >
              <UtensilsCrossed size={18} />
              View Menu
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}

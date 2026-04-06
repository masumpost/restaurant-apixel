import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, Facebook, Instagram } from 'lucide-react';

const LOGO_URL = "https://static.prod-images.emergentagent.com/jobs/3330e33a-96b1-42f2-92f1-58cb71a063d6/images/e13015c09058157c7450da00998284b591ee87bef11acd270db7e3b77b23fb66.png";

export default function Footer() {
  return (
    <footer className="bg-surface/30 border-t border-primary/10 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <img src={LOGO_URL} alt="Panshi" className="h-16 w-auto mb-4" />
            <h3 className="font-serif text-2xl text-cream mb-2">Panshi</h3>
            <p className="text-cream/60 text-sm">
              পানসি রেস্টুরেন্টস অ্যান্ড হোটেল
            </p>
            <p className="text-cream/50 text-sm mt-4">
              Authentic Bengali cuisine served with love since 2015.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg text-cream mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <Link to="/menu" className="block text-cream/60 hover:text-primary transition-colors">Menu</Link>
              <Link to="/blog" className="block text-cream/60 hover:text-primary transition-colors">Blog</Link>
              <Link to="/about" className="block text-cream/60 hover:text-primary transition-colors">About Us</Link>
              <Link to="/contact" className="block text-cream/60 hover:text-primary transition-colors">Contact</Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg text-cream mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a
                href="tel:+8801322411534"
                className="flex items-center gap-3 text-cream/60 hover:text-primary transition-colors"
              >
                <Phone size={18} />
                <span>+880 1322-411534</span>
              </a>
              <div className="flex items-start gap-3 text-cream/60">
                <MapPin size={18} className="flex-shrink-0 mt-1" />
                <span>8 No Road, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3 text-cream/60">
                <Clock size={18} />
                <span>10:00 AM - 11:00 PM</span>
              </div>
            </div>
          </div>

          {/* Social & Order */}
          <div>
            <h4 className="font-serif text-lg text-cream mb-4">Follow Us</h4>
            <div className="flex gap-4 mb-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-cream/60 hover:text-primary hover:bg-surface-hover transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-cream/60 hover:text-primary hover:bg-surface-hover transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
            <a
              href="https://wa.me/8801322411534?text=Hello,%20I'd%20like%20to%20place%20an%20order!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-whatsapp text-white font-bold text-sm uppercase tracking-wider rounded-full hover:bg-whatsapp/90 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order on WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/40 text-sm">
            © {new Date().getFullYear()} Panshi Restaurants And Hotel. All rights reserved.
          </p>
          <Link to="/admin" className="text-cream/40 text-sm hover:text-primary transition-colors">
            Admin Panel
          </Link>
        </div>
      </div>
    </footer>
  );
}

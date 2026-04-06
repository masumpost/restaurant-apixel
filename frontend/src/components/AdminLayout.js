import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  FileText, 
  Star, 
  MessageSquare, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const LOGO_URL = "https://static.prod-images.emergentagent.com/jobs/3330e33a-96b1-42f2-92f1-58cb71a063d6/images/e13015c09058157c7450da00998284b591ee87bef11acd270db7e3b77b23fb66.png";

const sidebarLinks = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/products', icon: UtensilsCrossed, label: 'Products' },
  { path: '/admin/blogs', icon: FileText, label: 'Blogs' },
  { path: '/admin/reviews', icon: Star, label: 'Reviews' },
  { path: '/admin/messages', icon: MessageSquare, label: 'Messages' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A120E] border-r border-surface transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-surface">
            <Link to="/" className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Panshi" className="h-10 w-auto" />
              <div>
                <h2 className="font-serif text-lg text-cream">Panshi Admin</h2>
                <p className="text-xs text-cream/50">Dashboard</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path, link.exact);
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  data-testid={`admin-nav-${link.label.toLowerCase()}`}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active 
                      ? 'bg-primary text-background' 
                      : 'text-cream/60 hover:bg-surface hover:text-cream'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-surface">
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-background font-bold text-sm">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <p className="text-sm text-cream">{user?.name}</p>
                <p className="text-xs text-cream/50">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              data-testid="admin-logout-btn"
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-cream/60 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b border-surface px-4 py-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-cream"
            data-testid="admin-mobile-menu"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="font-serif text-lg text-cream">Admin Panel</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '◈' },
  { to: '/admin/cars', label: 'Inventory', icon: '◉' },
  { to: '/admin/inquiries', label: 'Inquiries', icon: '◎' },
];

export default function AdminLayout({ children, title }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Sidebar */}
      <aside className="w-64 glass-dark border-r border-white/5 flex flex-col fixed top-0 left-0 h-full z-40">
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-display text-xl gold-text">RIDES</span>
            <span className="font-mono text-[9px] tracking-[0.4em] text-white/30 uppercase">by Julius</span>
          </Link>
          <p className="font-mono text-[10px] tracking-widest uppercase text-gold-500/60 mt-3">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 font-body text-sm transition-all group ${
                pathname === to
                  ? 'bg-gold-600/10 border-l-2 border-gold-500 text-gold-400'
                  : 'text-white/40 hover:text-white hover:bg-white/3'
              }`}
            >
              <span className="font-mono text-base">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="px-4 py-3 mb-2">
            <p className="font-body text-xs text-white/60">{user?.name}</p>
            <p className="font-mono text-[10px] text-white/30">{user?.role}</p>
          </div>
          <button onClick={handleLogout}
            className="w-full text-left px-4 py-2 font-body text-xs text-white/30 hover:text-red-400 transition-colors">
            Sign Out →
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {title && (
            <div className="mb-8">
              <h1 className="font-display text-4xl font-light">{title}</h1>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}

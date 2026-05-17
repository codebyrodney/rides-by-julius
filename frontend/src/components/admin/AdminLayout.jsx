import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/cars', label: 'Inventory' },
  { to: '/admin/inquiries', label: 'Inquiries' },
];

export default function AdminLayout({ children, title }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', backgroundColor: '#ffffff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100%', zIndex: 40 }}>
        
        {/* Logo */}
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ color: '#6b7280', fontSize: '10px', fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block' }}>Rides By</span>
            <span style={{ color: '#000000', fontSize: '20px', fontWeight: '900', display: 'block' }}>JULIUS</span>
          </Link>
          <p style={{ color: '#9ca3af', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '8px' }}>Admin Panel</p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px' }}>
          {navItems.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                marginBottom: '4px',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
                borderRadius: '6px',
                backgroundColor: pathname === to ? '#000000' : 'transparent',
                color: pathname === to ? '#ffffff' : '#374151',
                borderLeft: pathname === to ? '3px solid #000000' : '3px solid transparent',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ color: '#374151', fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>{user?.name}</p>
          <p style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '12px' }}>{user?.role}</p>
          <button
            onClick={handleLogout}
            style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Sign Out →
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '32px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {title && (
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ color: '#000000', fontSize: '36px', fontWeight: '800' }}>{title}</h1>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
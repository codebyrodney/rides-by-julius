import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Lazy load all pages
const HomePage = lazy(() => import('./pages/HomePage'));
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const CarDetailPage = lazy(() => import('./pages/CarDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminCars = lazy(() => import('./pages/admin/AdminCars'));
const AdminCarForm = lazy(() => import('./pages/admin/AdminCarForm'));
const AdminInquiries = lazy(() => import('./pages/admin/AdminInquiries'));

const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

const PageLoader = () => (
  <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '32px', height: '32px', border: '2px solid #e5e7eb', borderTop: '2px solid #000000', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
      <p style={{ color: '#6b7280', fontSize: '13px' }}>Loading...</p>
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#ffffff', color: '#000000', border: '1px solid #e5e7eb' },
          success: { iconTheme: { primary: '#000000', secondary: '#ffffff' } },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/cars/:id" element={<CarDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/cars" element={<ProtectedRoute><AdminCars /></ProtectedRoute>} />
          <Route path="/admin/cars/new" element={<ProtectedRoute><AdminCarForm /></ProtectedRoute>} />
          <Route path="/admin/cars/edit/:id" element={<ProtectedRoute><AdminCarForm /></ProtectedRoute>} />
          <Route path="/admin/inquiries" element={<ProtectedRoute><AdminInquiries /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

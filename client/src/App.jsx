import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

// Public Pages
import HomePage from './pages/HomePage'
import InventoryPage from './pages/InventoryPage'
import CarDetailPage from './pages/CarDetailPage'
import ContactPage from './pages/ContactPage'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCars from './pages/admin/AdminCars'
import AdminCarForm from './pages/admin/AdminCarForm'
import AdminInquiries from './pages/admin/AdminInquiries'

// Layout
import Navbar from './components/navbar/Navbar'
import Footer from './components/Footer'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-obsidian-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  return user ? children : <Navigate to="/admin/login" replace />
}

const PublicLayout = ({ children }) => (
  <div className="min-h-screen bg-obsidian-950 flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
)

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
    <Route path="/inventory" element={<PublicLayout><InventoryPage /></PublicLayout>} />
    <Route path="/cars/:id" element={<PublicLayout><CarDetailPage /></PublicLayout>} />
    <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

    {/* Admin */}
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
    <Route path="/admin/cars" element={<ProtectedRoute><AdminCars /></ProtectedRoute>} />
    <Route path="/admin/cars/new" element={<ProtectedRoute><AdminCarForm /></ProtectedRoute>} />
    <Route path="/admin/cars/:id/edit" element={<ProtectedRoute><AdminCarForm /></ProtectedRoute>} />
    <Route path="/admin/inquiries" element={<ProtectedRoute><AdminInquiries /></ProtectedRoute>} />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid rgba(212,175,55,0.3)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px'
            },
            success: { iconTheme: { primary: '#D4AF37', secondary: '#0a0a0a' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#0a0a0a' } },
            duration: 4000
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}

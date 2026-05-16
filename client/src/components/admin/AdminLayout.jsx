import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Car, MessageSquare, LogOut,
  Menu, X, ExternalLink, ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/cars', icon: Car, label: 'Inventory' },
  { to: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
]

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const isActive = (nav) => {
    if (nav.exact) return location.pathname === nav.to
    return location.pathname.startsWith(nav.to)
  }

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-obsidian-950 border-r border-obsidian-800/50 w-64">
      {/* Logo */}
      <div className="p-6 border-b border-obsidian-800/50">
        <span className="font-display text-lg text-gold-400 block leading-none">RIDES BY</span>
        <span className="font-display text-2xl text-white block">JULIUS</span>
        <p className="text-obsidian-600 text-[10px] font-body tracking-widest uppercase mt-1">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(nav => {
          const active = isActive(nav)
          return (
            <Link
              key={nav.to}
              to={nav.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 font-body text-sm transition-all duration-200 group ${
                active
                  ? 'bg-gold-500/10 text-gold-400 border-l-2 border-gold-500'
                  : 'text-obsidian-500 hover:text-white hover:bg-obsidian-900'
              }`}
            >
              <nav.icon size={16} />
              <span className="tracking-wide">{nav.label}</span>
              {active && <ChevronRight size={12} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-obsidian-800/50">
        <div className="px-4 py-3 mb-2">
          <p className="text-white font-body text-sm font-medium">{user?.name}</p>
          <p className="text-obsidian-600 text-xs">{user?.email}</p>
        </div>
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 text-obsidian-600 hover:text-obsidian-400 text-xs font-body transition-colors"
        >
          <ExternalLink size={12} />
          View Website
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-500/70 hover:text-red-400 text-xs font-body transition-colors w-full text-left"
        >
          <LogOut size={12} />
          Sign Out
        </button>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-obsidian-950 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-obsidian-950/80 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden w-64"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-obsidian-800/50 bg-obsidian-950">
          <button onClick={() => setSidebarOpen(true)} className="text-obsidian-400 hover:text-white transition-colors">
            <Menu size={22} />
          </button>
          <span className="font-display text-lg text-white">Admin</span>
          <div />
        </div>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

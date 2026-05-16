import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'

const WHATSAPP = '+254700000000'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/inventory', label: 'Inventory' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}
        className="fixed top-0 left-0 right-0 z-50 py-4"
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex flex-col leading-none">
            <span style={{ color: '#000000', fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Rides By</span>
            <span style={{ color: '#000000', fontSize: '20px', fontWeight: '900', letterSpacing: '0.1em' }}>JULIUS</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: location.pathname === link.to ? '#000000' : '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: location.pathname === link.to ? 'underline' : 'none',
                  textUnderlineOffset: '4px',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#374151', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Phone size={13} />
              +254 700 000 000
            </a>
            <Link
              to="/inventory"
              style={{ backgroundColor: '#000000', color: '#ffffff', fontSize: '12px', fontWeight: '700', padding: '10px 20px' }}
            >
              View Cars
            </Link>
          </div>

          {/* Mobile menu button */}
          <button style={{ color: '#000000' }} className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ backgroundColor: '#ffffff', position: 'fixed', inset: 0, zIndex: 40, paddingTop: '80px', paddingLeft: '32px', paddingRight: '32px' }}
            className="md:hidden"
          >
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {links.map((link, i) => (
                <motion.div key={link.to} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <Link to={link.to} style={{ color: '#000000', fontSize: '24px', fontWeight: '800' }}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                <a href={`tel:${WHATSAPP}`} style={{ color: '#374151', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={14} />
                  +254 700 000 000
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

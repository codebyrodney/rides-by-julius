import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <span style={{ color: '#6b7280', fontSize: '11px', fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block' }}>Rides By</span>
              <span style={{ color: '#000000', fontSize: '36px', fontWeight: '900', display: 'block', lineHeight: 1.1 }}>JULIUS</span>
            </div>
            <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px', maxWidth: '360px' }}>
              Nairobi's premier destination for the world's most prestigious automobiles.
              Curated excellence, delivered with unparalleled service.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" style={{ width: '36px', height: '36px', border: '1px solid #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151' }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ color: '#000000', fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { to: '/', label: 'Home' },
                { to: '/inventory', label: 'Our Collection' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/admin', label: 'Admin Portal' },
              ].map(link => (
                <Link key={link.to} to={link.to} style={{ color: '#374151', fontSize: '14px' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#000000', fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={14} style={{ color: '#000000', marginTop: '2px', flexShrink: 0 }} />
                <span style={{ color: '#374151', fontSize: '14px' }}>
                  Westlands Commercial Centre,<br />Nairobi, Kenya
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={14} style={{ color: '#000000', flexShrink: 0 }} />
                <a href="tel:+254700000000" style={{ color: '#374151', fontSize: '14px' }}>
                  +254 700 000 000
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={14} style={{ color: '#000000', flexShrink: 0 }} />
                <a href="mailto:info@ridesbyjulius.com" style={{ color: '#374151', fontSize: '14px' }}>
                  info@ridesbyjulius.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: '8px' }} className="md:flex-row md:justify-between">
          <p style={{ color: '#6b7280', fontSize: '12px' }}>
            © {new Date().getFullYear()} Rides by Julius. All rights reserved.
          </p>
          <p style={{ color: '#9ca3af', fontSize: '12px' }}>
            Crafted with excellence in Nairobi, Kenya
          </p>
        </div>
      </div>
    </footer>
  )
}

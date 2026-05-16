import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', type: 'general' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/inquiries', form)
      setSuccess(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <p className="section-label">Get In Touch</p>
          <h1 className="font-display text-6xl text-white">
            Let's <span className="text-gold-shine italic">Connect</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="font-display text-3xl text-white mb-8">Showroom & Contact</h2>
            <div className="space-y-6 mb-10">
              {[
                { Icon: MapPin, title: 'Our Showroom', info: 'Westlands Commercial Centre\nNairobi, Kenya' },
                { Icon: Phone, title: 'Call or WhatsApp', info: '+254 705 523 897\nMon-Sat, 8am-7pm' },
                { Icon: Mail, title: 'Email Us', info: 'info@ridesbyjulius.com\nWe respond within 2 hours' },
                { Icon: Clock, title: 'Opening Hours', info: 'Monday – Saturday: 8:00 AM – 7:00 PM\nSunday: 10:00 AM – 4:00 PM' },
              ].map(({ Icon, title, info }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 border border-gold-500/30 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-gold-500" />
                  </div>
                  <div>
                    <p className="text-white font-body font-medium text-sm mb-1">{title}</p>
                    <p className="text-obsidian-400 font-body text-sm leading-relaxed whitespace-pre-line">{info}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="aspect-video bg-obsidian-900 border border-obsidian-800 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={32} className="text-gold-500/40 mx-auto mb-2" />
                <p className="text-obsidian-600 font-body text-sm">Westlands, Nairobi</p>
                <a
                  href="https://maps.google.com/?q=Westlands+Nairobi+Kenya"
                  target="_blank" rel="noopener noreferrer"
                  className="text-gold-500/60 hover:text-gold-400 transition-colors text-xs font-body mt-1 inline-block"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="glass-card p-8">
              {success ? (
                <div className="py-12 text-center">
                  <CheckCircle size={48} className="text-gold-400 mx-auto mb-4" />
                  <h3 className="font-display text-2xl text-white mb-2">Message Sent!</h3>
                  <p className="text-obsidian-400 font-body mb-6">We'll get back to you within 2 hours during business hours.</p>
                  <button onClick={() => { setSuccess(false); setForm({ name: '', email: '', phone: '', message: '', type: 'general' }) }}
                    className="btn-gold px-8 py-3"><span>Send Another</span>
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl text-white mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="section-label text-[10px] block mb-2">Inquiry Type</label>
                      <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="select-luxury">
                        <option value="general">General Inquiry</option>
                        <option value="test_drive">Test Drive Request</option>
                        <option value="price_offer">Price Offer</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="section-label text-[10px] block mb-2">Full Name *</label>
                        <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="input-luxury" />
                      </div>
                      <div>
                        <label className="section-label text-[10px] block mb-2">Phone *</label>
                        <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+254 705 523 897" className="input-luxury" />
                      </div>
                    </div>
                    <div>
                      <label className="section-label text-[10px] block mb-2">Email *</label>
                      <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@email.com" className="input-luxury" />
                    </div>
                    <div>
                      <label className="section-label text-[10px] block mb-2">Message</label>
                      <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can assist you..." rows={5} className="input-luxury resize-none" />
                    </div>
                    <button type="submit" disabled={loading} className="btn-gold w-full py-4 disabled:opacity-50">
                      <span>{loading ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

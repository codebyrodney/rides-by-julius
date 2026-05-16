import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, CheckCircle } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function TestDriveForm({ car, onClose }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    preferredDate: '', preferredTime: '',
    message: '', type: 'test_drive'
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/inquiries', {
        ...form,
        car: car?._id,
        type: 'test_drive'
      })
      setSuccess(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian-950/90 backdrop-blur-xl p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-obsidian-800">
          <div>
            <h2 className="font-display text-xl text-white">Book Test Drive</h2>
            {car && <p className="text-obsidian-500 text-sm font-body mt-1">{car.year} {car.make} {car.model}</p>}
          </div>
          <button onClick={onClose} className="text-obsidian-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="p-12 text-center">
            <CheckCircle size={48} className="text-gold-400 mx-auto mb-4" />
            <h3 className="font-display text-2xl text-white mb-2">Request Sent!</h3>
            <p className="text-obsidian-400 font-body mb-6">We'll confirm your test drive appointment within 24 hours.</p>
            <button onClick={onClose} className="btn-gold px-8 py-3"><span>Close</span></button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="section-label text-[10px] block mb-2">Full Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="input-luxury"
                />
              </div>
              <div>
                <label className="section-label text-[10px] block mb-2">Email *</label>
                <input
                  required type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="john@email.com"
                  className="input-luxury"
                />
              </div>
              <div>
                <label className="section-label text-[10px] block mb-2">Phone *</label>
                <input
                  required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+254 700 000 000"
                  className="input-luxury"
                />
              </div>
              <div>
                <label className="section-label text-[10px] block mb-2">Preferred Date</label>
                <input
                  type="date"
                  value={form.preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setForm({ ...form, preferredDate: e.target.value })}
                  className="input-luxury"
                />
              </div>
              <div>
                <label className="section-label text-[10px] block mb-2">Preferred Time</label>
                <select
                  value={form.preferredTime}
                  onChange={e => setForm({ ...form, preferredTime: e.target.value })}
                  className="select-luxury"
                >
                  <option value="">Select time</option>
                  {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="section-label text-[10px] block mb-2">Message</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Any specific questions or requirements..."
                  rows={3}
                  className="input-luxury resize-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Submitting...' : 'Book Test Drive'}</span>
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

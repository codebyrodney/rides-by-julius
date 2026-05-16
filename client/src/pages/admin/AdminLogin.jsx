import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/admin', { replace: true })
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await login(form.email, form.password)
    if (result.success) navigate('/admin', { replace: true })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-obsidian-950 flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-obsidian-950/80" />
      </div>

      {/* Decorative lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="font-display text-xl text-gold-400 block">RIDES BY</span>
          <span className="font-display text-3xl text-white block">JULIUS</span>
          <div className="luxury-divider mt-4">
            <span className="text-obsidian-600 text-[10px] tracking-widest uppercase">Admin Portal</span>
          </div>
        </div>

        <div className="glass-card p-8">
          <h1 className="font-display text-2xl text-white mb-2">Welcome Back</h1>
          <p className="text-obsidian-500 font-body text-sm mb-8">Sign in to manage your inventory</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="section-label text-[10px] block mb-2">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-obsidian-600" />
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@ridesbyjulius.com"
                  className="input-luxury pl-10"
                />
              </div>
            </div>
            <div>
              <label className="section-label text-[10px] block mb-2">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-obsidian-600" />
                <input
                  type={showPw ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-luxury pl-10 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-obsidian-600 hover:text-obsidian-400 transition-colors"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 mt-2 disabled:opacity-50"
            >
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

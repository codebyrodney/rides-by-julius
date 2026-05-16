import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { login, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  if (isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/admin');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(212,160,23,0.08) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(212,160,23,0.05) 0%, transparent 50%)' }}
      />
      <div className="absolute inset-0 opacity-3"
        style={{ backgroundImage: 'linear-gradient(rgba(212,160,23,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md mx-6"
      >
        <div className="text-center mb-10">
          <div className="flex flex-col leading-none items-center mb-3">
            <span className="font-display text-4xl gold-text">RIDES</span>
            <span className="font-mono text-[10px] tracking-[0.4em] text-white/30 uppercase">by Julius</span>
          </div>
          <p className="font-mono text-[11px] tracking-widest uppercase text-gold-500/60">Admin Portal</p>
        </div>

        <div className="glass p-8">
          <h2 className="font-display text-3xl font-light mb-8 text-center">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-mono text-[10px] tracking-widest uppercase text-white/30 block mb-2">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="input-dark"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] tracking-widest uppercase text-white/30 block mb-2">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="input-dark"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 mt-6 disabled:opacity-50">
              {loading && <span className="w-4 h-4 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />}
              Access Dashboard
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-white/20 font-body text-xs">
          Restricted area — authorized personnel only
        </p>
      </motion.div>
    </div>
  );
}

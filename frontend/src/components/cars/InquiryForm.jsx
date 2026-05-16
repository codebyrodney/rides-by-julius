import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function InquiryForm({ carId, carName, type = 'inquiry' }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', preferredDate: '' });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/inquiries', { ...form, carId, carName, type });
      toast.success(type === 'test_drive' ? 'Test drive booked! We\'ll confirm shortly.' : 'Inquiry sent! We\'ll be in touch.');
      setForm({ name: '', email: '', phone: '', message: '', preferredDate: '' });
    } catch {
      toast.error('Failed to send. Please try WhatsApp instead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-8"
    >
      <h3 className="font-display text-2xl font-light mb-2">
        {type === 'test_drive' ? 'Book a Test Drive' : 'Send Inquiry'}
      </h3>
      {carName && <p className="text-white/40 font-body text-sm mb-6">{carName}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input required type="text" placeholder="Full Name *" value={form.name} onChange={(e) => set('name', e.target.value)} className="input-dark" />
        <input required type="email" placeholder="Email Address *" value={form.email} onChange={(e) => set('email', e.target.value)} className="input-dark" />
        <input required type="tel" placeholder="Phone Number *" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="input-dark" />
        {type === 'test_drive' && (
          <input type="date" value={form.preferredDate} onChange={(e) => set('preferredDate', e.target.value)} className="input-dark" min={new Date().toISOString().split('T')[0]} />
        )}
        <textarea
          placeholder="Message (optional)"
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          rows={4}
          className="input-dark resize-none"
        />
        <button type="submit" disabled={loading} className="btn-gold flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? (
            <span className="w-4 h-4 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
          ) : null}
          {type === 'test_drive' ? 'Book Test Drive' : 'Send Inquiry'}
        </button>
      </form>
    </motion.div>
  );
}

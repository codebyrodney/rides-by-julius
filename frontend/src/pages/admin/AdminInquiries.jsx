import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', type: '' });

  useEffect(() => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filter).filter(([, v]) => v));
    api.get('/inquiries', { params })
      .then(({ data }) => setInquiries(data.inquiries))
      .catch(() => toast.error('Failed to load inquiries'))
      .finally(() => setLoading(false));
  }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/inquiries/${id}/status`, { status });
      setInquiries((prev) => prev.map((i) => i._id === id ? { ...i, status } : i));
      toast.success('Status updated');
    } catch { toast.error('Failed to update'); }
  };

  return (
    <AdminLayout title="Inquiries">
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select value={filter.status} onChange={(e) => setFilter((p) => ({ ...p, status: e.target.value }))} className="input-dark w-40">
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
        <select value={filter.type} onChange={(e) => setFilter((p) => ({ ...p, type: e.target.value }))} className="input-dark w-40">
          <option value="">All Types</option>
          <option value="inquiry">Inquiry</option>
          <option value="test_drive">Test Drive</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq, i) => (
            <motion.div
              key={inq._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass p-5"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-1 ${
                      inq.type === 'test_drive' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/40'
                    }`}>
                      {inq.type === 'test_drive' ? 'Test Drive' : 'Inquiry'}
                    </span>
                    <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-1 ${
                      inq.status === 'new' ? 'bg-gold-600/20 text-gold-400' :
                      inq.status === 'contacted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/30'
                    }`}>
                      {inq.status}
                    </span>
                    <span className="font-mono text-[10px] text-white/20">
                      {new Date(inq.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-body text-base text-white/90 mb-0.5">{inq.name}</h3>
                  {inq.carName && <p className="font-mono text-xs text-gold-500 mb-2">{inq.carName}</p>}
                  <div className="flex flex-wrap gap-4 text-sm text-white/40 font-body">
                    <a href={`mailto:${inq.email}`} className="hover:text-gold-400 transition-colors">{inq.email}</a>
                    <a href={`tel:${inq.phone}`} className="hover:text-gold-400 transition-colors">{inq.phone}</a>
                    {inq.preferredDate && (
                      <span className="text-blue-400">
                        Preferred: {new Date(inq.preferredDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {inq.message && (
                    <p className="mt-3 text-white/40 font-body text-sm leading-relaxed italic">"{inq.message}"</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap md:flex-col md:items-end">
                  {['new', 'contacted', 'closed'].filter((s) => s !== inq.status).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(inq._id, s)}
                      className="font-mono text-[9px] tracking-widest uppercase px-3 py-2 border border-white/10 text-white/40 hover:text-gold-400 hover:border-gold-500/30 transition-colors whitespace-nowrap"
                    >
                      Mark as {s}
                    </button>
                  ))}
                  <a
                    href={`https://wa.me/${inq.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${inq.name}, thank you for your inquiry at Rides by Julius!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[9px] tracking-widest uppercase px-3 py-2 bg-green-600/10 border border-green-500/20 text-green-400 hover:bg-green-600/20 transition-colors whitespace-nowrap"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          ))}

          {inquiries.length === 0 && (
            <div className="text-center py-20 text-white/20 font-body">
              No inquiries found.
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}

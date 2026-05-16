import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';

const fmt = (n) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);
const fmtNum = (n) => new Intl.NumberFormat().format(n);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/dashboard')
      .then(({ data }) => setData(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AdminLayout title="Dashboard">
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    </AdminLayout>
  );

  const statCards = [
    { label: 'Total Vehicles', value: fmtNum(data?.stats.totalCars), sub: `${data?.stats.availableCars} available`, color: 'gold' },
    { label: 'Featured Cars', value: fmtNum(data?.stats.featuredCars), sub: 'on homepage', color: 'gold' },
    { label: 'New Inquiries', value: fmtNum(data?.stats.newInquiries), sub: `${data?.stats.totalInquiries} total`, color: 'emerald' },
    { label: 'Test Drives', value: fmtNum(data?.stats.testDrives), sub: 'booked', color: 'blue' },
    { label: 'Inventory Value', value: fmt(data?.stats.inventoryValue), sub: 'available stock', color: 'gold' },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {statCards.map(({ label, value, sub, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass p-5"
          >
            <p className="font-mono text-[10px] tracking-widest uppercase text-white/30 mb-2">{label}</p>
            <p className={`font-display text-2xl font-light mb-1 ${color === 'gold' ? 'gold-text' : color === 'emerald' ? 'text-emerald-400' : 'text-blue-400'}`}>
              {value}
            </p>
            <p className="font-body text-xs text-white/30">{sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Viewed Cars */}
        <div className="glass p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl font-light">Top Viewed Cars</h3>
            <Link to="/admin/cars" className="font-mono text-[10px] tracking-widest uppercase text-gold-500 hover:text-gold-400">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {data?.topViewedCars?.map((car, i) => (
              <div key={car._id} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                <span className="font-mono text-xs text-white/20 w-4">{i + 1}</span>
                <img src={car.images?.[0]?.url} alt="" className="w-12 h-8 object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-white/80 truncate">{car.year} {car.brand} {car.model}</p>
                  <p className="font-mono text-[10px] text-gold-500">{fmt(car.price)}</p>
                </div>
                <span className="font-mono text-xs text-white/30">{fmtNum(car.views)} views</span>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Distribution */}
        <div className="glass p-6">
          <h3 className="font-display text-xl font-light mb-5">Inventory by Brand</h3>
          <div className="space-y-3">
            {data?.brandDistribution?.map(({ _id: brand, count }) => {
              const max = data.brandDistribution[0]?.count || 1;
              const pct = Math.round((count / max) * 100);
              return (
                <div key={brand}>
                  <div className="flex justify-between mb-1">
                    <span className="font-body text-sm text-white/60">{brand}</span>
                    <span className="font-mono text-xs text-white/30">{count}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-gold-600 to-gold-400"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="glass p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl font-light">Recent Inquiries</h3>
          <Link to="/admin/inquiries" className="font-mono text-[10px] tracking-widest uppercase text-gold-500 hover:text-gold-400">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Name', 'Car', 'Type', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left font-mono text-[10px] tracking-widest uppercase text-white/30 pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data?.recentInquiries?.map((inq) => (
                <tr key={inq._id}>
                  <td className="py-3 pr-4 font-body text-sm text-white/70">{inq.name}</td>
                  <td className="py-3 pr-4 font-body text-xs text-white/40">{inq.carName || '—'}</td>
                  <td className="py-3 pr-4">
                    <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-1 ${
                      inq.type === 'test_drive' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/40'
                    }`}>
                      {inq.type === 'test_drive' ? 'Test Drive' : 'Inquiry'}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-1 ${
                      inq.status === 'new' ? 'bg-gold-600/20 text-gold-400' :
                      inq.status === 'contacted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/30'
                    }`}>
                      {inq.status}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-xs text-white/30">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

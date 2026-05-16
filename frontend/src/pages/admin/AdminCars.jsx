import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';

const fmt = (p) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(p);

export default function AdminCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = search ? { search } : {};
      const { data } = await api.get('/cars', { params: { ...params, limit: 50 } });
      setCars(data.cars);
    } catch { toast.error('Failed to load cars'); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await api.delete(`/cars/${id}`);
      toast.success('Car deleted');
      setCars((prev) => prev.filter((c) => c._id !== id));
    } catch { toast.error('Failed to delete car'); }
    finally { setDeleting(null); }
  };

  const toggleFeatured = async (car) => {
    try {
      await api.put(`/cars/${car._id}`, { isFeatured: !car.isFeatured });
      setCars((prev) => prev.map((c) => c._id === car._id ? { ...c, isFeatured: !c.isFeatured } : c));
      toast.success(car.isFeatured ? 'Removed from featured' : 'Added to featured');
    } catch { toast.error('Failed to update'); }
  };

  return (
    <AdminLayout title="Inventory Management">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search cars..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-dark flex-1"
        />
        <Link to="/admin/cars/new" className="btn-gold whitespace-nowrap flex items-center gap-2">
          <span>+</span> Add Car
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Vehicle', 'Price', 'Condition', 'Status', 'Views', 'Actions'].map((h) => (
                    <th key={h} className="text-left font-mono text-[10px] tracking-widest uppercase text-white/30 px-4 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {cars.map((car, i) => (
                  <motion.tr
                    key={car._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-white/2 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={car.images?.[0]?.url || 'https://via.placeholder.com/60x40?text=No+Img'}
                          alt=""
                          className="w-16 h-10 object-cover flex-shrink-0"
                        />
                        <div>
                          <p className="font-body text-sm text-white/80">{car.year} {car.brand}</p>
                          <p className="font-mono text-xs text-white/40">{car.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-body text-sm text-gold-400">{fmt(car.price)}</td>
                    <td className="px-4 py-4">
                      <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-1 ${
                        car.condition === 'new' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40'
                      }`}>
                        {car.condition}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        {car.isFeatured && (
                          <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 bg-gold-600/20 text-gold-400 w-fit">
                            Featured
                          </span>
                        )}
                        <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 w-fit ${
                          car.isAvailable ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-white/30'
                        }`}>
                          {car.isAvailable ? 'Available' : 'Sold'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-white/30">{car.views}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                       <button
  onClick={() => toggleFeatured(car)}
  style={{ color: '#000', fontSize: '16px', padding: '2px 6px' }}
  title={car.isFeatured ? 'Remove from featured' : 'Add to featured'}
>
  ★
</button>
                       <Link
                        to={`/admin/cars/edit/${car._id}`}
                            style={{ border: '1px solid #000', color: '#000', padding: '4px 10px', fontSize: '11px', textDecoration: 'none' }}
                          >
                         Edit
                           </Link>
                          
                  
                        <button
                          onClick={() => handleDelete(car._id, `${car.year} ${car.brand} ${car.model}`)}
                          disabled={deleting === car._id}
                          className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border border-red-400 text-red-400 hover:text-red-300 hover:border-red-300 transition-colors disabled:opacity-30"
                        >
                          
                          {deleting === car._id ? '...' : 'Del'}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {cars.length === 0 && (
              <div className="text-center py-16 text-white/20 font-body">
                No cars found. <Link to="/admin/cars/new" className="text-gold-500 hover:text-gold-400">Add one?</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

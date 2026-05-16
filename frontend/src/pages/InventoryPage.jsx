import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CarCard from '../components/cars/CarCard';
import CarFilters from '../components/cars/CarFilters';
import WhatsAppButton from '../components/common/WhatsAppButton';
import api from '../utils/api';

export default function InventoryPage() {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '', brand: '', bodyType: '', condition: '',
    sort: 'newest', minPrice: '', maxPrice: '', page: 1,
  });

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
      const { data } = await api.get('/cars', { params });
      setCars(data.cars);
      setTotal(data.total);
      setPages(data.pages);
    } catch { setCars([]); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchCars(); }, [fetchCars]);
  useEffect(() => {
    api.get('/cars/brands').then(({ data }) => setBrands(data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      {/* Header */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(212,160,23,0.2) 0%, transparent 60%)' }}
        />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[11px] tracking-[0.4em] uppercase text-gold-500 mb-4"
          >
            Our Collection
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-6xl md:text-7xl font-light mb-4"
          >
            Vehicle <span className="italic gold-text">Inventory</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 font-body"
          >
            {total > 0 ? `${total} vehicles available` : 'Explore our curated selection'}
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <CarFilters filters={filters} onChange={setFilters} brands={brands} />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="glass animate-pulse">
                <div className="aspect-[16/10] shimmer-gold" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-24 bg-white/5 rounded" />
                  <div className="h-5 w-40 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : cars.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car, i) => <CarCard key={car._id} car={car} index={i} />)}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFilters((p) => ({ ...p, page: i + 1 }))}
                    className={`w-10 h-10 font-mono text-sm transition-all ${
                      filters.page === i + 1
                        ? 'bg-gold-600 text-dark-900'
                        : 'glass text-white/50 hover:text-gold-400'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24">
            <p className="font-display text-3xl font-light text-white/20 mb-4">No vehicles found</p>
            <p className="text-white/30 font-body text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

import { useEffect, useState, useCallback } from 'react';
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navbar />

      {/* Header */}
      <section style={{ paddingTop: '120px', paddingBottom: '40px', textAlign: 'center', backgroundColor: '#f3f4f6' }}>
        <div className="max-w-7xl mx-auto px-6">
          <p style={{ color: '#6b7280', fontSize: '11px', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Our Collection
          </p>
          <h1 style={{ color: '#000000', fontSize: '48px', fontWeight: '800', marginBottom: '12px' }}>
            Vehicle Inventory
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {total > 0 ? `${total} vehicles available` : 'Explore our curated selection'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24" style={{ paddingTop: '32px' }}>
        <CarFilters filters={filters} onChange={setFilters} brands={brands} />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ aspectRatio: '16/10', backgroundColor: '#f3f4f6' }} />
                <div style={{ padding: '16px' }}>
                  <div style={{ height: '12px', width: '80px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '8px' }} />
                  <div style={{ height: '16px', width: '120px', backgroundColor: '#e5e7eb', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : cars.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {cars.map((car, i) => <CarCard key={car._id} car={car} index={i} />)}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '48px' }}>
                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFilters((p) => ({ ...p, page: i + 1 }))}
                    style={{
                      width: '40px',
                      height: '40px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: filters.page === i + 1 ? '#000000' : '#ffffff',
                      color: filters.page === i + 1 ? '#ffffff' : '#374151',
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: '#9ca3af', fontSize: '24px', marginBottom: '12px' }}>No vehicles found</p>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Try adjusting your filters</p>
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
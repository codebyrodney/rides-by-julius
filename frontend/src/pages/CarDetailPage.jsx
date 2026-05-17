import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import InquiryForm from '../components/cars/InquiryForm';
import WhatsAppButton from '../components/common/WhatsAppButton';
import api from '../utils/api';

const formatPrice = (p) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(p);

export default function CarDetailPage() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState('inquiry');

  useEffect(() => {
    api.get(`/cars/${id}`)
      .then(({ data }) => setCar(data))
      .catch(() => {})
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '32px', height: '32px', border: '2px solid #e5e7eb', borderTop: '2px solid #000000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!car) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <p style={{ color: '#6b7280', fontSize: '24px' }}>Vehicle not found</p>
      <Link to="/inventory" style={{ border: '1px solid #000', padding: '10px 24px', color: '#000', fontSize: '14px', fontWeight: '600' }}>Back to Inventory</Link>
    </div>
  );

  const carFullName = `${car.year} ${car.brand} ${car.model}`;

  const specs = [
    { label: 'Year', value: car.year },
    { label: 'Brand', value: car.brand },
    { label: 'Model', value: car.model },
    { label: 'Body', value: car.bodyType },
    { label: 'Color', value: car.color },
    { label: 'Condition', value: car.condition },
    { label: 'Transmission', value: car.transmission },
    { label: 'Fuel Type', value: car.fuelType },
    { label: 'Mileage', value: car.mileage ? `${car.mileage.toLocaleString()} km` : 'N/A' },
    { label: 'Engine', value: car.engineSize || 'N/A' },
    { label: 'Horsepower', value: car.horsepower ? `${car.horsepower} hp` : 'N/A' },
    { label: 'Top Speed', value: car.topSpeed ? `${car.topSpeed} km/h` : 'N/A' },
    { label: '0–100 km/h', value: car.acceleration || 'N/A' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6" style={{ paddingTop: '120px', paddingBottom: '80px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontSize: '12px', color: '#9ca3af' }}>
          <Link to="/" style={{ color: '#9ca3af' }}>Home</Link>
          <span>/</span>
          <Link to="/inventory" style={{ color: '#9ca3af' }}>Inventory</Link>
          <span>/</span>
          <span style={{ color: '#374151' }}>{carFullName}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <motion.div
              style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', backgroundColor: '#f3f4f6', borderRadius: '8px' }}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <img
                src={car.images[activeImg]?.url || 'https://via.placeholder.com/800x500?text=No+Image'}
                alt={carFullName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {car.images.length > 1 && (
                <>
                  <button onClick={() => setActiveImg((p) => (p - 1 + car.images.length) % car.images.length)}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ‹
                  </button>
                  <button onClick={() => setActiveImg((p) => (p + 1) % car.images.length)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ›
                  </button>
                </>
              )}
            </motion.div>

            {car.images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {car.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    style={{ flexShrink: 0, width: '80px', height: '56px', overflow: 'hidden', borderRadius: '4px', border: i === activeImg ? '2px solid #000000' : '2px solid transparent', opacity: i === activeImg ? 1 : 0.5, cursor: 'pointer' }}>
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>{car.brand}</p>
            <h1 style={{ color: '#000000', fontSize: '36px', fontWeight: '800', lineHeight: 1.1, marginBottom: '12px' }}>
              {car.year} {car.model}
            </h1>
            <p style={{ color: '#000000', fontSize: '28px', fontWeight: '900', marginBottom: '20px' }}>{formatPrice(car.price)}</p>

            <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>{car.description}</p>

            {/* Quick specs */}
            <div className="grid grid-cols-2 gap-3" style={{ marginBottom: '24px' }}>
              {[
                { l: 'Transmission', v: car.transmission },
                { l: 'Fuel', v: car.fuelType },
                { l: 'Body', v: car.bodyType },
                { l: 'Condition', v: car.condition },
              ].map(({ l, v }) => (
                <div key={l} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', padding: '12px', borderRadius: '6px' }}>
                  <p style={{ color: '#6b7280', fontSize: '10px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>{l}</p>
                  <p style={{ color: '#111827', fontSize: '14px', textTransform: 'capitalize' }}>{v}</p>
                </div>
              ))}
            </div>

            {/* Features */}
            {car.features?.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>Features</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {car.features.map((f) => (
                    <span key={f} style={{ padding: '4px 12px', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', color: '#374151', fontSize: '12px', borderRadius: '4px' }}>{f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/254705523897?text=${encodeURIComponent(`I'm interested in the ${carFullName}`)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '14px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', fontSize: '14px', fontWeight: '600', borderRadius: '6px', textDecoration: 'none' }}
            >
              <svg style={{ width: '16px', height: '16px' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Inquire on WhatsApp
            </a>
          </motion.div>
        </div>

        {/* Full specs & Inquiry */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12" style={{ marginTop: '48px' }}>
          <div>
            <p style={{ color: '#000000', fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>Full Specifications</p>
            <div style={{ borderTop: '1px solid #e5e7eb' }}>
              {specs.map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>{label}</span>
                  <span style={{ color: '#111827', fontSize: '14px', textTransform: 'capitalize', fontWeight: '500' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
              {['inquiry', 'test_drive'].map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ flex: 1, padding: '12px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid #e5e7eb', backgroundColor: tab === t ? '#000000' : '#ffffff', color: tab === t ? '#ffffff' : '#6b7280', borderRadius: '4px', transition: 'all 0.2s' }}>
                  {t === 'inquiry' ? 'Inquiry' : 'Test Drive'}
                </button>
              ))}
            </div>
            <InquiryForm carId={car._id} carName={carFullName} type={tab} />
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton carName={carFullName} />
    </div>
  );
}
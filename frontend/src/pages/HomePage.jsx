import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CarCard from '../components/cars/CarCard';
import WhatsAppButton from '../components/common/WhatsAppButton';
import api from '../utils/api';

const STATS = [
  { value: '500+', label: 'Premium Vehicles' },
  { value: '12+', label: 'Years of Excellence' },
  { value: '2,000+', label: 'Happy Clients' },
  { value: '50+', label: 'Luxury Brands' },
];

const BRANDS = [
  'Mercedes-Benz', 'BMW', 'Toyota', 'Volkswagen', 'Nissan',
  'Audi', 'Subaru', 'Mazda', 'Mitsubishi', 'Land Rover',
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    api.get('/cars', { params: { limit: 6, sort: 'newest' } })
      .then(({ data }) => setFeatured(Array.isArray(data.cars) ? data.cars : []))
      .catch(() => {})
      .finally(() => setLoadingFeatured(false));
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f3f4f6' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>

        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-8"
            >
              <div style={{ height: '1px', width: '48px', backgroundColor: '#000000' }} />
             <span style={{ fontSize: '11px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#000000' }}>
  Nairobi's Finest
</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-6xl md:text-8xl font-light leading-[0.9] mb-6"
            >
              Drive the{' '}
              <span className="italic gold-text">Extraordinary</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-body text-gray-700 text-lg leading-relaxed mb-10 max-w-xl"
            >
              Kenya's most trusted destination for premium vehicles. Whether you're navigating Nairobi's streets or cruising the open highway, we handpick every car to match your standard. Quality you can see, value you can feel.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/inventory" className="btn-gold text-center">
                Explore Collection
              </Link>
              <Link to="/contact" className="btn-outline-gold text-center">
                Book Consultation
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24 pt-12 border-t border-white/5"
          >
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="font-display text-4xl font-light mb-1" style={{ color: '#000000' }}>{value}</p>
                <p className="font-body text-sm" style={{ color: '#6b7280' }}>{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Cars ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="font-mono text-[11px] tracking-[0.4em] uppercase text-gold-500 mb-3">Hand-Picked</p>
            <h2 className="section-title">Featured <span className="italic">Collection</span></h2>
          </div>
          <Link to="/inventory" className="btn-outline-gold self-start md:self-auto">
            View All
          </Link>
        </div>

        {loadingFeatured ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass aspect-[16/14] animate-pulse">
                <div className="w-full aspect-[16/10] shimmer-gold" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-24 bg-white/5 rounded" />
                  <div className="h-5 w-40 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {featured.map((car, i) => <CarCard key={car._id} car={car} index={i} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-white/30 font-body">
            Your inventory is empty. Add your first car from the admin dashboard.
          </div>
        )}
      </section>

      {/* ── Brands ── */}
      <section style={{ backgroundColor: '#000000', padding: '48px 0', overflow: 'hidden' }}>
        <div className="flex gap-12">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} style={{ color: '#9ca3af', fontSize: '22px', fontWeight: '300', whiteSpace: 'nowrap', cursor: 'default' }}>
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="font-mono text-[11px] tracking-[0.4em] uppercase text-gold-500 mb-3">The Julius Difference</p>
          <h2 className="section-title">Where Kenyans <span className="italic">Find Their Drive</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '◈', title: 'Authenticated Luxury', desc: 'Every vehicle in our collection is rigorously inspected and verified for authenticity, condition, and provenance.' },
            { icon: '◉', title: 'White-Glove Service', desc: 'From first inquiry to delivery, our concierge team ensures an experience as refined as the vehicles we represent.' },
            { icon: '◎', title: 'Private Test Drives', desc: 'Experience your dream car on your terms. We arrange exclusive, personalized test drives at your convenience.' },
          ].map(({ icon, title, desc }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass p-8 group hover:border-gold-500/30 transition-colors duration-300"
            >
              <div className="text-3xl text-gold-500 mb-5 font-mono">{icon}</div>
              <h3 className="font-display text-xl font-light mb-3">{title}</h3>
              <p className="text-white/40 font-body text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-700/10 via-gold-600/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="font-display text-5xl md:text-6xl font-light leading-tight mb-4">
              Your Next Chapter<br />
              <span className="italic gold-text">Starts Here</span>
            </h2>
            <p className="text-black font-body max-w-md">
              Speak with our luxury automotive specialists today and discover your perfect vehicle.
            </p>
          </div>
          <div className="flex flex-col gap-4 min-w-fit">
            <Link to="/inventory" className="btn-gold text-center">Browse Inventory</Link>
            <Link to="/contact" className="btn-outline-gold text-center">Contact Us</Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

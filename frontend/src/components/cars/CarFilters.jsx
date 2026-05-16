import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CarFilters({ filters, onChange, brands }) {
  const [open, setOpen] = useState(false);

  const update = (key, value) => onChange({ ...filters, [key]: value, page: 1 });

  return (
    <div className="glass p-6 mb-8">
      {/* Search */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search brand, model..."
          value={filters.search || ''}
          onChange={(e) => update('search', e.target.value)}
          className="input-dark flex-1"
        />
        <button
          onClick={() => setOpen(!open)}
          className="btn-outline-gold flex items-center gap-2 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h18M7 12h10M11 20h2" />
          </svg>
          Filters
        </button>
      </div>

      {/* Advanced filters */}
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5"
        >
          <select value={filters.brand || ''} onChange={(e) => update('brand', e.target.value)} className="input-dark">
            <option value="">All Brands</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>

          <select value={filters.bodyType || ''} onChange={(e) => update('bodyType', e.target.value)} className="input-dark">
            <option value="">All Types</option>
            {['sedan', 'suv', 'coupe', 'convertible', 'wagon', 'truck', 'van', 'hatchback'].map((t) => (
              <option key={t} value={t} className="capitalize">{t}</option>
            ))}
          </select>

          <select value={filters.condition || ''} onChange={(e) => update('condition', e.target.value)} className="input-dark">
            <option value="">Any Condition</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="certified">Certified</option>
          </select>

          <select value={filters.sort || ''} onChange={(e) => update('sort', e.target.value)} className="input-dark">
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>

          <div className="col-span-2 flex gap-3">
            <input
              type="number"
              placeholder="Min Price (KES)"
              value={filters.minPrice || ''}
              onChange={(e) => update('minPrice', e.target.value)}
              className="input-dark flex-1"
            />
            <input
              type="number"
              placeholder="Max Price (KES)"
              value={filters.maxPrice || ''}
              onChange={(e) => update('maxPrice', e.target.value)}
              className="input-dark flex-1"
            />
          </div>

          <div className="col-span-2 md:col-span-2 flex justify-end">
            <button
              onClick={() => onChange({ search: '', brand: '', bodyType: '', condition: '', sort: 'newest', minPrice: '', maxPrice: '', page: 1 })}
              className="text-white/40 hover:text-gold-400 font-mono text-xs tracking-widest uppercase transition-colors"
            >
              Clear All
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { BODY_TYPES, CONDITIONS, FUEL_TYPES, CATEGORIES } from '../../utils/helpers'

export default function CarFilters({ filters, onChange, makes = [] }) {
  const [open, setOpen] = useState(false)

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 })
  }

  const activeCount = Object.entries(filters).filter(([k, v]) =>
    k !== 'page' && k !== 'limit' && k !== 'sort' && v && v !== ''
  ).length

  const clearAll = () => {
    onChange({ sort: filters.sort, page: 1, limit: filters.limit })
  }

  return (
    <div className="mb-10">
      {/* Search bar */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-obsidian-500" />
          <input
            type="text"
            placeholder="Search by make, model, or keyword..."
            value={filters.search || ''}
            onChange={e => handleChange('search', e.target.value)}
            className="input-luxury pl-12 pr-4 py-4"
          />
        </div>
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-2 px-5 py-4 border transition-all duration-300 font-body text-sm tracking-widest uppercase ${
            open || activeCount > 0
              ? 'border-gold-500 text-gold-400 bg-gold-500/10'
              : 'border-obsidian-700 text-obsidian-400 hover:border-obsidian-500'
          }`}
        >
          <SlidersHorizontal size={16} />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="bg-gold-500 text-obsidian-950 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
              {activeCount}
            </span>
          )}
        </button>
        <select
          value={filters.sort || '-createdAt'}
          onChange={e => handleChange('sort', e.target.value)}
          className="select-luxury px-4 py-4 min-w-[180px]"
        >
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="-year">Year: Newest</option>
          <option value="-views">Most Viewed</option>
        </select>
      </div>

      {/* Expanded filters */}
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-6 mb-4"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="section-label text-[10px] block mb-2">Make</label>
              <select
                value={filters.make || ''}
                onChange={e => handleChange('make', e.target.value)}
                className="select-luxury py-3 text-sm"
              >
                <option value="">All Makes</option>
                {makes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div>
              <label className="section-label text-[10px] block mb-2">Body Type</label>
              <select
                value={filters.bodyType || ''}
                onChange={e => handleChange('bodyType', e.target.value)}
                className="select-luxury py-3 text-sm"
              >
                <option value="">All Types</option>
                {BODY_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div>
              <label className="section-label text-[10px] block mb-2">Condition</label>
              <select
                value={filters.condition || ''}
                onChange={e => handleChange('condition', e.target.value)}
                className="select-luxury py-3 text-sm"
              >
                <option value="">All Conditions</option>
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="section-label text-[10px] block mb-2">Fuel Type</label>
              <select
                value={filters.fuelType || ''}
                onChange={e => handleChange('fuelType', e.target.value)}
                className="select-luxury py-3 text-sm"
              >
                <option value="">All Fuel Types</option>
                {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div>
              <label className="section-label text-[10px] block mb-2">Category</label>
              <select
                value={filters.category || ''}
                onChange={e => handleChange('category', e.target.value)}
                className="select-luxury py-3 text-sm"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="section-label text-[10px] block mb-2">Min Price (KES)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice || ''}
                onChange={e => handleChange('minPrice', e.target.value)}
                className="input-luxury py-3 text-sm"
              />
            </div>

            <div>
              <label className="section-label text-[10px] block mb-2">Max Price (KES)</label>
              <input
                type="number"
                placeholder="Any"
                value={filters.maxPrice || ''}
                onChange={e => handleChange('maxPrice', e.target.value)}
                className="input-luxury py-3 text-sm"
              />
            </div>

            <div>
              <label className="section-label text-[10px] block mb-2">Min Year</label>
              <input
                type="number"
                placeholder="1900"
                value={filters.minYear || ''}
                onChange={e => handleChange('minYear', e.target.value)}
                className="input-luxury py-3 text-sm"
              />
            </div>
          </div>

          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="mt-4 flex items-center gap-2 text-obsidian-500 hover:text-red-400 transition-colors text-sm font-body"
            >
              <X size={14} />
              Clear all filters
            </button>
          )}
        </motion.div>
      )}
    </div>
  )
}

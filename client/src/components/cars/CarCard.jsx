import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, Gauge, Fuel, Calendar, Star } from 'lucide-react'
import { formatPrice, formatMileage, getPrimaryImage, PLACEHOLDER_IMG } from '../../utils/helpers'

export default function CarCard({ car, index = 0 }) {
  const primaryImg = getPrimaryImage(car.images) || PLACEHOLDER_IMG

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link to={`/cars/${car._id}`} className="block car-card group">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[16/10]">
          <img
            src={primaryImg}
            alt={`${car.year} ${car.make} ${car.model}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={e => { e.target.src = PLACEHOLDER_IMG }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent opacity-60" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {car.isFeatured && (
              <span className="badge-luxury flex items-center gap-1 text-[10px]">
                <Star size={10} fill="currentColor" />
                Featured
              </span>
            )}
            <span className={`text-[10px] px-2 py-1 font-body uppercase tracking-wider ${
              car.condition === 'New' ? 'bg-emerald-500/90 text-white' :
              car.condition === 'Certified Pre-Owned' ? 'bg-blue-500/90 text-white' :
              'bg-obsidian-700/90 text-obsidian-200'
            }`}>
              {car.condition}
            </span>
          </div>

          {/* Views overlay */}
          {car.views > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-obsidian-950/80 px-2 py-1">
              <Eye size={10} className="text-obsidian-400" />
              <span className="text-obsidian-400 text-[10px] font-body">{car.views}</span>
            </div>
          )}

          {/* Category tag */}
          <div className="absolute bottom-3 right-3">
            <span className="text-[10px] font-body tracking-widest uppercase text-gold-400/80 bg-obsidian-950/60 px-2 py-1">
              {car.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Make & Model */}
          <div className="mb-3">
            <p className="text-gold-500/70 text-[10px] font-body tracking-widest uppercase mb-1">{car.make}</p>
            <h3 className="font-display text-xl text-white group-hover:text-gold-100 transition-colors leading-tight">
              {car.year} {car.model}
            </h3>
          </div>

          {/* Specs row */}
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-obsidian-800">
            <div className="flex items-center gap-1.5 text-obsidian-400">
              <Gauge size={12} />
              <span className="text-xs font-body">{formatMileage(car.mileage)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-obsidian-400">
              <Fuel size={12} />
              <span className="text-xs font-body">{car.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5 text-obsidian-400">
              <Calendar size={12} />
              <span className="text-xs font-body">{car.transmission}</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-obsidian-600 text-[10px] font-body tracking-wider uppercase mb-0.5">Price</p>
              <p className="price-tag text-lg">{formatPrice(car.price)}</p>
            </div>
            <span className="text-gold-500 text-xs font-body tracking-widest uppercase border border-gold-500/30 px-3 py-1.5 group-hover:bg-gold-500 group-hover:text-obsidian-950 transition-all duration-300">
              View Details
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

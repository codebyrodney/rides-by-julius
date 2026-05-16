import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Calendar, Gauge, Fuel, Settings2, Zap, Palette,
  MapPin, Eye, Star, Share2, ChevronLeft, ChevronRight, MessageCircle
} from 'lucide-react'
import { formatPrice, formatMileage, getPrimaryImage, PLACEHOLDER_IMG, WHATSAPP_NUMBER, WHATSAPP_MSG } from '../utils/helpers'
import TestDriveForm from '../components/cars/TestDriveForm'
import WhatsAppButton from '../components/ui/WhatsAppButton'
import api from '../utils/api'

export default function CarDetailPage() {
  const { id } = useParams()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgIdx, setImgIdx] = useState(0)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    api.get(`/cars/${id}`)
      .then(({ data }) => setCar(data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!car) return (
    <div className="min-h-screen pt-24 flex items-center justify-center flex-col gap-4">
      <h2 className="font-display text-3xl text-white">Vehicle Not Found</h2>
      <Link to="/inventory" className="btn-gold px-8 py-3"><span>Back to Inventory</span></Link>
    </div>
  )

  const images = car.images?.length > 0 ? car.images : [{ url: PLACEHOLDER_IMG }]
  const currentImg = images[imgIdx]?.url || PLACEHOLDER_IMG

  const specs = [
    { icon: Calendar, label: 'Year', value: car.year },
    { icon: Gauge, label: 'Mileage', value: formatMileage(car.mileage) },
    { icon: Fuel, label: 'Fuel Type', value: car.fuelType },
    { icon: Settings2, label: 'Transmission', value: car.transmission },
    { icon: Zap, label: 'Engine', value: car.engine || 'N/A' },
    { icon: Palette, label: 'Exterior', value: car.exteriorColor },
    { icon: Palette, label: 'Interior', value: car.interiorColor },
    { icon: MapPin, label: 'Location', value: car.location },
  ]

  const performance = [
    { label: 'Horsepower', value: car.horsepower ? `${car.horsepower} hp` : 'N/A' },
    { label: 'Torque', value: car.torque || 'N/A' },
    { label: '0-100 km/h', value: car.acceleration || 'N/A' },
    { label: 'Top Speed', value: car.topSpeed || 'N/A' },
    { label: 'Drivetrain', value: car.drivetrain || 'N/A' },
    { label: 'Body Type', value: car.bodyType },
  ]

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back */}
        <Link to="/inventory" className="inline-flex items-center gap-2 text-obsidian-500 hover:text-gold-400 transition-colors font-body text-sm mb-8">
          <ArrowLeft size={16} />
          Back to Inventory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-[4/3] overflow-hidden bg-obsidian-900 mb-3">
              <AnimatePresence mode="wait">
                <motion.img
                  key={imgIdx}
                  src={currentImg}
                  alt={car.fullName}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  onError={e => { e.target.src = PLACEHOLDER_IMG }}
                />
              </AnimatePresence>
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx((imgIdx - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-obsidian-950/80 flex items-center justify-center text-white hover:text-gold-400 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setImgIdx((imgIdx + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-obsidian-950/80 flex items-center justify-center text-white hover:text-gold-400 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setImgIdx(i)}
                        className={`transition-all ${i === imgIdx ? 'w-6 h-1.5 bg-gold-500' : 'w-1.5 h-1.5 bg-white/40 rounded-full'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.slice(0, 5).map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`aspect-video overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-gold-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" onError={e => { e.target.src = PLACEHOLDER_IMG }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Car Info */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              {car.isFeatured && <span className="badge-luxury text-[10px] flex items-center gap-1"><Star size={10} fill="currentColor" /> Featured</span>}
              <span className="text-obsidian-500 text-xs font-body">{car.category}</span>
              <span className="flex items-center gap-1 text-obsidian-600 text-xs font-body ml-auto">
                <Eye size={12} /> {car.views} views
              </span>
            </div>

            <p className="text-gold-500/80 font-body text-sm tracking-widest uppercase mb-1">{car.make}</p>
            <h1 className="font-display text-4xl md:text-5xl text-white mb-2">{car.year} {car.model}</h1>

            <div className="flex items-center gap-3 mb-6">
              <span className={car.isAvailable ? 'badge-available' : 'badge-sold'}>
                {car.isAvailable ? 'Available' : 'Sold'}
              </span>
              <span className="text-obsidian-600 text-xs">•</span>
              <span className="text-obsidian-500 text-xs font-body">{car.condition}</span>
            </div>

            {/* Price */}
            <div className="glass-card p-6 mb-6">
              <p className="text-obsidian-500 text-xs font-body tracking-widest uppercase mb-1">Asking Price</p>
              <p className="price-tag text-4xl">{formatPrice(car.price)}</p>
              {car.vin && <p className="text-obsidian-700 text-xs font-body mt-2">VIN: {car.vin}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={() => setShowForm(true)}
                disabled={!car.isAvailable}
                className="btn-gold flex-1 py-4 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{car.isAvailable ? 'Book Test Drive' : 'Unavailable'}</span>
              </button>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${WHATSAPP_MSG(car)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-green-500/40 text-green-400 hover:bg-green-500 hover:text-white px-6 transition-all duration-300 text-sm font-body"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-px bg-obsidian-800 mb-6">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-obsidian-950 p-4">
                  <p className="text-obsidian-600 text-[10px] font-body tracking-widest uppercase mb-1">{label}</p>
                  <p className="text-white font-body text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details Below */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Description */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl text-white mb-4">About This Vehicle</h2>
            <div className="luxury-divider mb-6"><span className="text-gold-600 text-[10px] tracking-widest uppercase">Description</span></div>
            <p className="text-obsidian-300 font-body leading-relaxed whitespace-pre-line">{car.description}</p>

            {car.features?.length > 0 && (
              <div className="mt-8">
                <h3 className="font-display text-xl text-white mb-4">Features & Equipment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {car.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-obsidian-300 font-body text-sm">
                      <div className="w-1 h-1 bg-gold-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Performance */}
          <div>
            <h2 className="font-display text-2xl text-white mb-4">Performance</h2>
            <div className="luxury-divider mb-6"><span className="text-gold-600 text-[10px] tracking-widest uppercase">Specs</span></div>
            <div className="space-y-3">
              {performance.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-obsidian-900">
                  <span className="text-obsidian-500 font-body text-sm">{label}</span>
                  <span className="text-white font-body text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showForm && <TestDriveForm car={car} onClose={() => setShowForm(false)} />}
      </AnimatePresence>
      <WhatsAppButton car={car} />
    </div>
  )
}

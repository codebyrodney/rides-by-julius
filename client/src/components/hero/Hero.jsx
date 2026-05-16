import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1920&q=90',
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=90',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=90',
]

export default function Hero() {
  const [imgIdx, setImgIdx] = React.useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setImgIdx(i => (i + 1) % HERO_IMAGES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const stats = [
    { value: '200+', label: 'Luxury Vehicles' },
    { value: '15+', label: 'Years Experience' },
    { value: '500+', label: 'Happy Clients' },
    { value: '50+', label: 'Premium Brands' },
  ]

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Images */}
      {HERO_IMAGES.map((src, i) => (
        <motion.div
          key={src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: i === imgIdx ? 1 : 0 }}
          transition={{ duration: 1.5 }}
        >
          <img src={src} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/55" />
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Pre-heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-px w-12 bg-white/40" />
          <span className="text-white/70 text-xs tracking-widest uppercase font-body">Premium Automobiles • Nairobi, Kenya</span>
          <div className="h-px w-12 bg-white/40" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-display text-6xl md:text-8xl lg:text-9xl mb-6 leading-none"
        >
          <span className="text-white block">Exceptional</span>
          <span className="text-white block italic font-light">Automobiles</span>
          <span className="text-white block">Await You</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-white/70 text-lg md:text-xl font-body font-light max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Curated collection of the world's most prestigious automobiles.
          Experience uncompromising luxury and performance.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link to="/inventory" className="bg-white text-black font-semibold px-12 py-4 text-sm w-full sm:w-auto hover:bg-gray-100 transition-colors">
            Explore Collection
          </Link>
          <Link
            to="/contact"
            className="border border-white/50 text-white hover:bg-white/10 px-12 py-4 text-xs tracking-widest uppercase font-body transition-all duration-300 w-full sm:w-auto text-center"
          >
            Book Consultation
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-3xl text-white font-bold mb-1">{stat.value}</div>
              <div className="text-white/60 text-xs font-body tracking-widest uppercase">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Image indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setImgIdx(i)}
            className={`transition-all duration-300 ${i === imgIdx ? 'w-8 h-1 bg-white' : 'w-1 h-1 bg-white/30 rounded-full'}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={24} className="text-white/60" />
      </motion.div>
    </section>
  )
}

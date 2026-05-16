import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Award, Clock, Headphones, Search } from 'lucide-react'
import Hero from '../components/hero/Hero'
import CarCard from '../components/cars/CarCard'
import WhatsAppButton from '../components/ui/WhatsAppButton'
import api from '../utils/api'

const FEATURES = [
  { Icon: Shield, title: 'Authenticity Guaranteed', desc: 'Every vehicle undergoes rigorous inspection by our expert team.' },
  { Icon: Award, title: 'Premium Selection', desc: 'Curated collection of the most sought-after automobiles in Kenya.' },
  { Icon: Clock, title: 'Concierge Service', desc: 'White-glove service from browsing to delivery, tailored to you.' },
  { Icon: Headphones, title: '24/7 Support', desc: 'Our dedicated team is always available to assist you.' },
]

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/cars/featured')
      .then(({ data }) => setFeatured(data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-white min-h-screen">
      <Hero />

      {/* Why Choose Us */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-gray-500 text-sm font-semibold uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">
              The Julius Motors <span className="text-black underline decoration-2">Difference</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-300 group"
              >
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4">
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-gray-400 text-sm font-semibold uppercase tracking-widest">Handpicked</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-1">Featured Vehicles</h2>
            </div>
            <Link
              to="/inventory"
              className="hidden md:flex items-center gap-2 text-black hover:text-gray-600 transition-colors text-sm font-semibold group"
            >
              View All Cars
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
                  <div className="aspect-[16/10] bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-5 w-40 bg-gray-200 rounded" />
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((car, i) => (
                <CarCard key={car._id} car={car} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400">Collection coming soon. Check back shortly.</p>
            </div>
          )}

          <div className="text-center mt-10 md:hidden">
            <Link to="/inventory" className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors inline-block">
              View All Cars
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6 relative overflow-hidden bg-black">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gray-400 text-sm font-semibold uppercase tracking-widest">Visit Us</span>
            <h2 className="text-5xl md:text-6xl font-bold text-white mt-2 mb-4">
              Come See Us In Person
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Schedule a private viewing at our Westlands showroom.<br />
              Our specialists will guide you through every detail.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="bg-white text-black font-bold px-10 py-3 rounded-lg hover:bg-gray-100 transition-colors w-full sm:w-auto">
                Book a Viewing
              </Link>
              <a
                href={`https://wa.me/254705523897?text=${encodeURIComponent('Hello, I would like to schedule a private viewing.')}`}
                target="_blank" rel="noopener noreferrer"
                className="border border-white/30 text-white font-semibold px-10 py-3 rounded-lg hover:bg-white/10 transition-colors w-full sm:w-auto"
              >
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  )
}

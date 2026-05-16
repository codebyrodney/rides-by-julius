import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import CarCard from '../components/cars/CarCard'
import CarFilters from '../components/cars/CarFilters'
import WhatsAppButton from '../components/ui/WhatsAppButton'
import api from '../utils/api'
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'

export default function InventoryPage() {
  const [cars, setCars] = useState([])
  const [makes, setMakes] = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ sort: '-createdAt', page: 1, limit: 12 })

  useEffect(() => {
    api.get('/cars/makes').then(({ data }) => setMakes(data.data)).catch(() => {})
  }, [])

  const fetchCars = useCallback(async () => {
    setLoading(true)
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v != null)
      )
      const { data } = await api.get('/cars', { params })
      setCars(data.data)
      setPagination(data.pagination)
    } catch {
      setCars([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchCars() }, [fetchCars])

  const handlePageChange = (p) => {
    setFilters(f => ({ ...f, page: p }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 border-b border-gray-100 pb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900">Our Inventory</h1>
          {!loading && (
            <p className="text-gray-400 text-sm mt-1">
              {pagination.total} vehicle{pagination.total !== 1 ? 's' : ''} available
            </p>
          )}
        </motion.div>

        {/* Layout: Filters sidebar + Grid */}
        <div className="flex gap-8">

          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal size={15} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Filters</span>
              </div>
              <CarFilters filters={filters} onChange={setFilters} makes={makes} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">

            {/* Mobile filters */}
            <div className="lg:hidden mb-4">
              <CarFilters filters={filters} onChange={setFilters} makes={makes} />
            </div>

            {/* Car Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-100 animate-pulse">
                    <div className="aspect-[16/10] bg-gray-100" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 w-16 bg-gray-100 rounded" />
                      <div className="h-4 w-36 bg-gray-100 rounded" />
                      <div className="h-5 w-24 bg-gray-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : cars.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {cars.map((car, i) => (
                    <CarCard key={car._id} car={car} index={i % 9} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-1 mt-12">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="p-2 border border-gray-200 text-gray-400 hover:border-black hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-9 h-9 text-sm font-medium transition-all border ${
                          pagination.page === i + 1
                            ? 'bg-black text-white border-black'
                            : 'border-gray-200 text-gray-500 hover:border-black hover:text-black'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="p-2 border border-gray-200 text-gray-400 hover:border-black hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24">
                <p className="text-4xl mb-4">🔍</p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No vehicles found</h3>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your filters</p>
                <button
                  onClick={() => setFilters({ sort: '-createdAt', page: 1, limit: 12 })}
                  className="bg-black text-white px-6 py-2.5 text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <WhatsAppButton />
    </div>
  )
}

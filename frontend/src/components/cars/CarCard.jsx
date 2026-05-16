import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fuel, Settings, Car, ChevronLeft, ChevronRight } from 'lucide-react';

const formatPrice = (p) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(p);

export default function CarCard({ car, index = 0 }) {
  const images = car.images?.length > 0
    ? car.images.map(i => i.url)
    : ['https://via.placeholder.com/600x400?text=No+Image'];

  const [current, setCurrent] = useState(0);

  const prev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((p) => (p - 1 + images.length) % images.length);
  };

  const next = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((p) => (p + 1) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Link
        to={`/cars/${car._id}`}
        className="block bg-white overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300 group"
      >
        {/* Image Slider */}
        <div className="relative overflow-hidden aspect-[16/10] bg-gray-100">
          <img
            src={images[current]}
            alt={`${car.year} ${car.brand} ${car.model}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Arrows — only show if more than 1 image */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
              >
                <ChevronRight size={16} />
              </button>

              {/* Dots */}
              <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px', zIndex: 10 }}>
                {images.map((_, i) => (
                  <div
                    key={i}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent(i); }}
                    style={{ width: i === current ? '16px' : '6px', height: '6px', borderRadius: '3px', backgroundColor: i === current ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.3s' }}
                  />
                ))}
              </div>
            </>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {car.isFeatured && (
              <span className="px-2.5 py-1 bg-black text-white text-[10px] font-bold tracking-wider uppercase">
                Featured
              </span>
            )}
            <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase ${
              car.condition === 'new'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-600 border border-gray-300'
            }`}>
              {car.condition}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">{car.brand}</p>
          <h3 className="text-gray-900 font-bold text-base leading-snug mb-1">
            {car.year} {car.model}
          </h3>
          <p className="text-black font-extrabold text-lg mb-3">
            {formatPrice(car.price)}
          </p>

          {/* Specs */}
          <div className="flex items-center gap-4 pt-3 border-t border-gray-100 text-gray-400 text-[11px]">
            <span className="flex items-center gap-1 capitalize">
              <Car size={12} /> {car.bodyType}
            </span>
            <span className="flex items-center gap-1 capitalize">
              <Settings size={12} /> {car.transmission}
            </span>
            <span className="flex items-center gap-1 capitalize">
              <Fuel size={12} /> {car.fuelType}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
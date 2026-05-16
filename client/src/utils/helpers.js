export const formatPrice = (price, currency = 'KES') => {
  if (!price && price !== 0) return 'Price on request'
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

export const formatMileage = (mileage) => {
  if (!mileage && mileage !== 0) return 'N/A'
  return new Intl.NumberFormat('en-US').format(mileage) + ' km'
}

export const formatNumber = (num) => {
  if (!num && num !== 0) return '0'
  return new Intl.NumberFormat('en-US').format(num)
}

export const getPrimaryImage = (images) => {
  if (!images || images.length === 0) return null
  return images.find(img => img.isPrimary)?.url || images[0]?.url || null
}

export const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'

export const CAR_MAKES = [
  'Rolls-Royce', 'Bentley', 'Ferrari', 'Lamborghini', 'Porsche',
  'Mercedes-Benz', 'BMW', 'Audi', 'Maserati', 'Aston Martin',
  'McLaren', 'Bugatti', 'Pagani', 'Koenigsegg', 'Lexus',
  'Range Rover', 'Jaguar', 'Cadillac', 'Lincoln', 'Genesis'
]

export const BODY_TYPES = ['Sedan', 'SUV', 'Coupe', 'Convertible', 'Sports Car', 'Luxury Sedan', 'Grand Tourer', 'Crossover']
export const CONDITIONS = ['New', 'Certified Pre-Owned', 'Used']
export const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid']
export const TRANSMISSIONS = ['Automatic', 'Manual', 'Semi-Automatic', 'CVT']
export const CATEGORIES = ['Ultra Luxury', 'Luxury', 'Performance', 'Classic', 'Electric']
export const DRIVETRAINS = ['RWD', 'FWD', 'AWD', '4WD']

export const WHATSAPP_NUMBER = '+254700000000' // Replace with actual number
export const WHATSAPP_MSG = (car) => encodeURIComponent(
  `Hello, I'm interested in the ${car ? `${car.year} ${car.make} ${car.model}` : 'vehicles'} at Rides by Julius. Could you please provide more details?`
)

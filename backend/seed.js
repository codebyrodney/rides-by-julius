import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from './models/Car.js';
import User from './models/User.js';

dotenv.config();

// These are stable, publicly-accessible car images that don't require auth or referrer headers
const CAR_IMAGES = {
  gwagon: [
    { url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1400&q=80', publicId: 'gwagon_1' },
    { url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1400&q=80', publicId: 'gwagon_2' },
  ],
  porsche: [
    { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80', publicId: 'porsche_1' },
    { url: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&w=1400&q=80', publicId: 'porsche_2' },
  ],
  bentley: [
    { url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1400&q=80', publicId: 'bentley_1' },
  ],
  rangerover: [
    { url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=80', publicId: 'rr_1' },
    { url: 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1400&q=80', publicId: 'rr_2' },
  ],
  bmw: [
    { url: 'https://images.unsplash.com/photo-1617469767534-10c92e01a9c7?auto=format&fit=crop&w=1400&q=80', publicId: 'bmw_1' },
    { url: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1400&q=80', publicId: 'bmw_2' },
  ],
  lamborghini: [
    { url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1400&q=80', publicId: 'lambo_1' },
    { url: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1400&q=80', publicId: 'lambo_2' },
  ],
  ferrari: [
    { url: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1400&q=80', publicId: 'ferrari_1' },
    { url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1400&q=80', publicId: 'ferrari_2' },
  ],
  rollsroyce: [
    { url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1400&q=80', publicId: 'rr_ph_1' },
  ],
};

const sampleCars = [
  {
    name: 'G-Wagon AMG Night Edition',
    brand: 'Mercedes-Benz',
    model: 'G63 AMG',
    year: 2024,
    price: 28500000,
    mileage: 0,
    condition: 'new',
    transmission: 'automatic',
    fuelType: 'petrol',
    bodyType: 'suv',
    color: 'Obsidian Black Metallic',
    engineSize: '4.0L V8 BiTurbo',
    horsepower: 577,
    topSpeed: 240,
    acceleration: '4.5 seconds',
    description: 'The Mercedes-AMG G63 redefines what a luxury SUV can be. Combining off-road legend with race-track performance, this iconic machine wraps extreme power in an unmistakable silhouette. The handcrafted 4.0L V8 Biturbo engine delivers 577 hp with a soundtrack unlike anything on the road.',
    features: ['Burmester® 3D Surround Sound', 'Panoramic sunroof', 'AMG RIDE CONTROL+', 'Night Package', 'Widescreen Cockpit', 'Heated & ventilated seats', 'Massage front seats', 'Head-up display', '360° camera'],
    images: CAR_IMAGES.gwagon,
    isFeatured: true,
    isAvailable: true,
  },
  {
    name: 'Porsche 911 Turbo S',
    brand: 'Porsche',
    model: '911 Turbo S',
    year: 2024,
    price: 32000000,
    mileage: 0,
    condition: 'new',
    transmission: 'automatic',
    fuelType: 'petrol',
    bodyType: 'coupe',
    color: 'GT Silver Metallic',
    engineSize: '3.8L Twin-Turbo Flat-6',
    horsepower: 650,
    topSpeed: 330,
    acceleration: '2.7 seconds',
    description: 'The Porsche 911 Turbo S is the apex of nearly six decades of refinement. With 650 hp and launch control, it rockets from 0–100 km/h in just 2.7 seconds. Every curve of its body is shaped by purpose, every component chosen for performance perfection.',
    features: ['Sport Chrono Package', 'Ceramic Composite Brakes', 'Sport Exhaust System', 'Bose® Surround Sound', 'Lane Change Assist', 'Night Vision Assist', 'Leather interior', 'Adaptive cruise control'],
    images: CAR_IMAGES.porsche,
    isFeatured: true,
    isAvailable: true,
  },
  {
    name: 'Bentley Continental GT V8',
    brand: 'Bentley',
    model: 'Continental GT V8',
    year: 2023,
    price: 45000000,
    mileage: 8200,
    condition: 'certified',
    transmission: 'automatic',
    fuelType: 'petrol',
    bodyType: 'coupe',
    color: 'Verdant',
    engineSize: '4.0L V8',
    horsepower: 542,
    topSpeed: 318,
    acceleration: '4.0 seconds',
    description: 'An expression of pure luxury craftsmanship, the Bentley Continental GT V8 seamlessly blends effortless performance with hand-crafted interior opulence. Each car takes 100 hours to build by hand at the Crewe factory.',
    features: ['Naim for Bentley Audio', 'Rotating display', 'Diamond knurling', 'All-wheel steering', 'Bentley Dynamic Ride', 'Massage seats', 'Heated armrests', 'Mood lighting'],
    images: CAR_IMAGES.bentley,
    isFeatured: true,
    isAvailable: true,
  },
  {
    name: 'Range Rover Autobiography LWB',
    brand: 'Land Rover',
    model: 'Range Rover Autobiography',
    year: 2024,
    price: 22000000,
    mileage: 0,
    condition: 'new',
    transmission: 'automatic',
    fuelType: 'hybrid',
    bodyType: 'suv',
    color: 'Santorini Black',
    engineSize: '3.0L Inline-6 PHEV',
    horsepower: 510,
    topSpeed: 225,
    acceleration: '5.4 seconds',
    description: 'The most desirable SUV in the world just got better. The Long Wheelbase Autobiography offers an unrivalled cabin experience with extended rear legroom, executive class seating, and the finest sustainable materials.',
    features: ['Executive rear seats', 'Rear entertainment', 'Meridian Signature Sound', 'Four-zone climate', 'Heads-up display', 'Air suspension', 'Wade sensing', 'Pivi Pro infotainment', 'Cabin air purification'],
    images: CAR_IMAGES.rangerover,
    isFeatured: true,
    isAvailable: true,
  },
  {
    name: 'BMW M5 Competition',
    brand: 'BMW',
    model: 'M5 Competition',
    year: 2023,
    price: 18500000,
    mileage: 12000,
    condition: 'certified',
    transmission: 'automatic',
    fuelType: 'petrol',
    bodyType: 'sedan',
    color: 'Frozen Dark Blue Metallic',
    engineSize: '4.4L V8 M TwinPower Turbo',
    horsepower: 627,
    topSpeed: 305,
    acceleration: '3.3 seconds',
    description: 'The BMW M5 Competition is the definitive expression of performance luxury. Its 627 hp S63 V8 engine fires with a roar that is pure motorsport, while the xDrive system ensures every ounce of power is deployed with surgical precision.',
    features: ['M xDrive AWD', 'Carbon ceramic brakes', 'M Driver\'s Package', 'Bowers & Wilkins Diamond', 'Merino leather', 'M Sport exhaust', 'Laser headlights', 'Gesture control'],
    images: CAR_IMAGES.bmw,
    isFeatured: false,
    isAvailable: true,
  },
  {
    name: 'Lamborghini Urus Performante',
    brand: 'Lamborghini',
    model: 'Urus Performante',
    year: 2024,
    price: 52000000,
    mileage: 0,
    condition: 'new',
    transmission: 'automatic',
    fuelType: 'petrol',
    bodyType: 'suv',
    color: 'Giallo Belenus',
    engineSize: '4.0L V8 Twin-Turbo',
    horsepower: 666,
    topSpeed: 306,
    acceleration: '3.3 seconds',
    description: 'The Lamborghini Urus Performante elevates the Super SUV concept to its absolute limit. 666 hp, a more aggressive aero package, and ANIMA driving mode selector make this the most focused Urus ever conceived.',
    features: ['Carbon fibre roof', 'Titanium exhaust', 'Forged wheels', 'Carbon ceramic brakes', 'Alcantara interior', 'Lamborghini Telemetry', 'Bang & Olufsen 3D', '23" wheels'],
    images: CAR_IMAGES.lamborghini,
    isFeatured: true,
    isAvailable: true,
  },
  {
    name: 'Ferrari 296 GTB',
    brand: 'Ferrari',
    model: '296 GTB',
    year: 2024,
    price: 68000000,
    mileage: 0,
    condition: 'new',
    transmission: 'automatic',
    fuelType: 'hybrid',
    bodyType: 'coupe',
    color: 'Rosso Corsa',
    engineSize: '3.0L V6 Hybrid',
    horsepower: 830,
    topSpeed: 330,
    acceleration: '2.9 seconds',
    description: 'The Ferrari 296 GTB heralds a new era of the prancing horse. Its revolutionary twin-turbocharged V6 paired with an electric motor delivers 830 cv of combined power — a marvel of Italian engineering wrapped in Flavio Manzoni\'s breathtaking design.',
    features: ['eManettino', 'Ferrari Dynamic Enhancer+', 'Carbon fibre bodywork', 'Fiorano Track Package', 'Daytona-style seats', 'Forged 20" wheels', 'Lift system'],
    images: CAR_IMAGES.ferrari,
    isFeatured: true,
    isAvailable: true,
  },
  {
    name: 'Rolls-Royce Ghost Extended',
    brand: 'Rolls-Royce',
    model: 'Ghost Extended',
    year: 2023,
    price: 95000000,
    mileage: 3200,
    condition: 'certified',
    transmission: 'automatic',
    fuelType: 'petrol',
    bodyType: 'sedan',
    color: 'Arctic White',
    engineSize: '6.75L V12 Twin-Turbo',
    horsepower: 563,
    topSpeed: 250,
    acceleration: '4.8 seconds',
    description: 'Post Opulent. The Rolls-Royce Ghost Extended whispers rather than roars — its effortless power delivered in absolute silence. The extended wheelbase transforms the rear into a private sanctuary of hand-stitched leather, starlight headliner and hushed serenity.',
    features: ['Starlight headliner', 'Bespoke audio system', 'Rear theatre configuration', 'Champagne cooler', 'Lambswool floor mats', 'Gallery dashboard', 'Illuminated fascia', 'Rear privacy curtains'],
    images: CAR_IMAGES.rollsroyce,
    isFeatured: true,
    isAvailable: true,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Car.deleteMany({});
    console.log('🗑️  Cleared existing cars');

    const cars = await Car.insertMany(sampleCars);
    console.log(`✅ Inserted ${cars.length} sample cars`);

    // Print a summary
    cars.forEach((c) => {
      console.log(`   • ${c.year} ${c.brand} ${c.model} — ${c.isFeatured ? '⭐ Featured' : 'Not featured'} — ${c.images.length} image(s)`);
    });

    const exists = await User.findOne({ email: 'admin@ridesbyjulius.com' });
    if (!exists) {
      await User.create({
        name: 'Julius Admin',
        email: 'admin@ridesbyjulius.com',
        password: 'Admin@Julius2024',
        role: 'superadmin',
      });
      console.log('\n✅ Admin created:');
      console.log('   Email:    admin@ridesbyjulius.com');
      console.log('   Password: Admin@Julius2024');
    } else {
      console.log('\nℹ️  Admin user already exists');
    }

    console.log('\n🚀 Seed complete! Start the server with: npm run dev\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
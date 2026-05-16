const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true, min: 1900, max: new Date().getFullYear() + 2 },
  price: { type: Number, required: true, min: 0 },
  mileage: { type: Number, required: true, min: 0 },
  condition: { type: String, enum: ['New', 'Certified Pre-Owned', 'Used'], required: true },
  transmission: { type: String, enum: ['Automatic', 'Manual', 'Semi-Automatic', 'CVT'], required: true },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'], required: true },
  bodyType: {
    type: String,
    enum: ['Sedan', 'SUV', 'Coupe', 'Convertible', 'Sports Car', 'Luxury Sedan', 'Grand Tourer', 'Crossover'],
    required: true
  },
  exteriorColor: { type: String, required: true },
  interiorColor: { type: String, required: true },
  engine: { type: String, trim: true },
  horsepower: { type: Number },
  torque: { type: String },
  acceleration: { type: String },
  topSpeed: { type: String },
  drivetrain: { type: String, enum: ['RWD', 'FWD', 'AWD', '4WD'] },
  description: { type: String, required: true, maxlength: 2000 },
  features: [{ type: String }],
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    isPrimary: { type: Boolean, default: false }
  }],
  vin: { type: String, unique: true, sparse: true },
  stockNumber: { type: String, unique: true, sparse: true },
  isFeatured: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  inquiries: { type: Number, default: 0 },
  category: {
    type: String,
    enum: ['Ultra Luxury', 'Luxury', 'Performance', 'Classic', 'Electric'],
    default: 'Luxury'
  },
  location: { type: String, default: 'Nairobi, Kenya' }
}, { timestamps: true });

// Indexes for search performance
carSchema.index({ make: 'text', model: 'text', description: 'text' });
carSchema.index({ price: 1, year: -1, isFeatured: -1 });
carSchema.index({ isAvailable: 1, isFeatured: -1 });

// Virtual for full name
carSchema.virtual('fullName').get(function () {
  return `${this.year} ${this.make} ${this.model}`;
});

carSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Car', carSchema);

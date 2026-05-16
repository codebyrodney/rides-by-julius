import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  model: { type: String, required: true },
  year: { type: Number, required: false },
  price: { type: Number, required: true },
  mileage: { type: Number, default: 0 },
  condition: { type: String, enum: ['new', 'used', 'certified'], default: 'new' },
  transmission: { type: String, enum: ['automatic', 'manual', 'semi-automatic'], default: 'automatic' },
  fuelType: { type: String, enum: ['petrol', 'diesel', 'electric', 'hybrid'], default: 'petrol' },
  bodyType: { type: String, enum: ['sedan', 'suv', 'coupe', 'convertible', 'wagon', 'truck', 'van', 'hatchback'], default: 'sedan' },
  color: { type: String, required: true },
  engineSize: { type: String },
  horsepower: { type: Number },
  topSpeed: { type: Number },
  acceleration: { type: String },
  description: { type: String, required: true },
  features: [{ type: String }],
  images: [{
    url: { type: String, required: true },
    publicId: { type: String },
  }],
  isFeatured: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  inquiries: { type: Number, default: 0 },
}, { timestamps: true });

carSchema.index({ brand: 1, model: 1 });
carSchema.index({ price: 1 });
carSchema.index({ isFeatured: 1 });

export default mongoose.model('Car', carSchema);

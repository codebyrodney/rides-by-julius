import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  carName: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String },
  type: { type: String, enum: ['inquiry', 'test_drive'], default: 'inquiry' },
  preferredDate: { type: Date },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
}, { timestamps: true });

export default mongoose.model('Inquiry', inquirySchema);

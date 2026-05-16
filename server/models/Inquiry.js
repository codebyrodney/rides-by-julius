const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  type: { type: String, enum: ['test_drive', 'general', 'price_offer'], required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  message: { type: String, maxlength: 1000 },
  preferredDate: { type: Date },
  preferredTime: { type: String },
  status: { type: String, enum: ['new', 'contacted', 'scheduled', 'completed', 'cancelled'], default: 'new' },
  notes: { type: String }
}, { timestamps: true });

inquirySchema.index({ createdAt: -1, status: 1 });

module.exports = mongoose.model('Inquiry', inquirySchema);

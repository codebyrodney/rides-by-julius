import Inquiry from '../models/Inquiry.js';
import Car from '../models/Car.js';

export const createInquiry = async (req, res) => {
  try {
    const { carId, name, email, phone, message, type, preferredDate } = req.body;
    let carName = '';
    if (carId) {
      const car = await Car.findById(carId);
      if (car) {
        carName = `${car.year} ${car.brand} ${car.model}`;
        car.inquiries += 1;
        await car.save();
      }
    }
    const inquiry = await Inquiry.create({ car: carId, carName, name, email, phone, message, type, preferredDate });
    res.status(201).json({ message: 'Inquiry submitted successfully', inquiry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getInquiries = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    const skip = (Number(page) - 1) * Number(limit);
    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('car', 'name brand model year'),
      Inquiry.countDocuments(filter),
    ]);
    res.json({ inquiries, total, pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

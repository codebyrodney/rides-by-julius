const express = require('express');
const Inquiry = require('../models/Inquiry');
const Car = require('../models/Car');
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// POST /api/inquiries - Public: Submit inquiry
router.post('/', [
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('phone').notEmpty(),
  body('type').isIn(['test_drive', 'general', 'price_offer'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields correctly.' });
  }
  try {
    const inquiry = await Inquiry.create(req.body);
    // Increment car inquiries count
    if (req.body.car) {
      await Car.findByIdAndUpdate(req.body.car, { $inc: { inquiries: 1 } });
    }
    res.status(201).json({ success: true, message: 'Inquiry submitted! We\'ll contact you shortly.', data: inquiry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET /api/inquiries - Admin: Get all inquiries
router.get('/', protect, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const skip = (Number(page) - 1) * Number(limit);
    const [inquiries, total] = await Promise.all([
      Inquiry.find(query).populate('car', 'make model year price').sort('-createdAt').skip(skip).limit(Number(limit)),
      Inquiry.countDocuments(query)
    ]);
    res.json({ success: true, data: inquiries, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/inquiries/:id/status - Admin: Update status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, notes: req.body.notes },
      { new: true }
    ).populate('car', 'make model year');
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

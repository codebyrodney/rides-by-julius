const express = require('express');
const Car = require('../models/Car');
const Inquiry = require('../models/Inquiry');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/analytics/dashboard
router.get('/dashboard', protect, async (req, res) => {
  try {
    const [
      totalCars, availableCars, featuredCars, totalInquiries,
      newInquiries, recentCars, topViewedCars, inquiriesByType,
      carsByCategory, carsByCondition, recentInquiries
    ] = await Promise.all([
      Car.countDocuments(),
      Car.countDocuments({ isAvailable: true }),
      Car.countDocuments({ isFeatured: true }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'new' }),
      Car.find().sort('-createdAt').limit(5).select('make model year price images createdAt'),
      Car.find({ isAvailable: true }).sort('-views').limit(5).select('make model year price views inquiries images'),
      Inquiry.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
      Car.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      Car.aggregate([{ $group: { _id: '$condition', count: { $sum: 1 } } }]),
      Inquiry.find().sort('-createdAt').limit(8).populate('car', 'make model year').select('name email type status createdAt car')
    ]);

    // Total inventory value
    const inventoryValueResult = await Car.aggregate([
      { $match: { isAvailable: true } },
      { $group: { _id: null, total: { $sum: '$price' }, avg: { $avg: '$price' } } }
    ]);
    const inventoryValue = inventoryValueResult[0] || { total: 0, avg: 0 };

    // Monthly inquiries (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyInquiries = await Inquiry.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalCars, availableCars, featuredCars,
          soldCars: totalCars - availableCars,
          totalInquiries, newInquiries,
          inventoryValue: Math.round(inventoryValue.total),
          avgPrice: Math.round(inventoryValue.avg)
        },
        recentCars,
        topViewedCars,
        recentInquiries,
        charts: { inquiriesByType, carsByCategory, carsByCondition, monthlyInquiries }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

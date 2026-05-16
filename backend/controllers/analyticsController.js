import Car from '../models/Car.js';
import Inquiry from '../models/Inquiry.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalCars,
      availableCars,
      featuredCars,
      totalInquiries,
      newInquiries,
      testDrives,
      topViewedCars,
      recentInquiries,
      brandDistribution,
    ] = await Promise.all([
      Car.countDocuments(),
      Car.countDocuments({ isAvailable: true }),
      Car.countDocuments({ isFeatured: true }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'new' }),
      Inquiry.countDocuments({ type: 'test_drive' }),
      Car.find().sort({ views: -1 }).limit(5).select('name brand model year views price images'),
      Inquiry.find().sort({ createdAt: -1 }).limit(5).select('name carName type status createdAt'),
      Car.aggregate([{ $group: { _id: '$brand', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 8 }]),
    ]);

    const totalValue = await Car.aggregate([
      { $match: { isAvailable: true } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);

    res.json({
      stats: {
        totalCars,
        availableCars,
        featuredCars,
        totalInquiries,
        newInquiries,
        testDrives,
        inventoryValue: totalValue[0]?.total || 0,
      },
      topViewedCars,
      recentInquiries,
      brandDistribution,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

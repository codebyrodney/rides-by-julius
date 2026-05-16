const express = require('express');
const Car = require('../models/Car');
const { protect } = require('../middleware/auth');
const { upload, deleteImage } = require('../config/cloudinary');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// GET /api/cars - Public: Get all available cars with filtering
router.get('/', async (req, res) => {
  try {
    const {
      search, make, bodyType, condition, fuelType, transmission, category,
      minPrice, maxPrice, minYear, maxYear, isFeatured, isAvailable,
      sort = '-createdAt', page = 1, limit = 12
    } = req.query;

    const query = {};

    // Admin can see all; public only sees available
    if (!req.headers.authorization) {
      query.isAvailable = true;
    } else if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    if (search) {
      query.$or = [
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (make) query.make = { $regex: make, $options: 'i' };
    if (bodyType) query.bodyType = bodyType;
    if (condition) query.condition = condition;
    if (fuelType) query.fuelType = fuelType;
    if (transmission) query.transmission = transmission;
    if (category) query.category = category;
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
    if (minPrice || maxPrice) query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
    if (minYear || maxYear) query.year = {};
    if (minYear) query.year.$gte = Number(minYear);
    if (maxYear) query.year.$lte = Number(maxYear);

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [cars, total] = await Promise.all([
      Car.find(query).sort(sort).skip(skip).limit(limitNum),
      Car.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: cars,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/cars/featured - Public: Get featured cars
router.get('/featured', async (req, res) => {
  try {
    const cars = await Car.find({ isFeatured: true, isAvailable: true }).sort('-updatedAt').limit(6);
    res.json({ success: true, data: cars });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/cars/makes - Public: Get distinct makes
router.get('/makes', async (req, res) => {
  try {
    const makes = await Car.distinct('make', { isAvailable: true });
    res.json({ success: true, data: makes.sort() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/cars/:id - Public: Get single car
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }
    // Increment views
    await Car.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ success: true, data: car });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/cars - Admin: Create car
router.post('/', protect, upload.array('images', 10), async (req, res) => {
  try {
    const carData = { ...req.body };

    // Parse features array
    if (typeof carData.features === 'string') {
      carData.features = JSON.parse(carData.features);
    }
    if (carData.price) carData.price = Number(carData.price);
    if (carData.year) carData.year = Number(carData.year);
    if (carData.mileage) carData.mileage = Number(carData.mileage);
    if (carData.horsepower) carData.horsepower = Number(carData.horsepower);
    carData.isFeatured = carData.isFeatured === 'true';

    // Process uploaded images
    if (req.files && req.files.length > 0) {
      carData.images = req.files.map((file, index) => ({
        url: file.path,
        publicId: file.filename,
        isPrimary: index === 0
      }));
    }

    const car = await Car.create(carData);
    res.status(201).json({ success: true, data: car, message: 'Car created successfully.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/cars/:id - Admin: Update car
router.put('/:id', protect, upload.array('images', 10), async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }

    const updateData = { ...req.body };
    if (typeof updateData.features === 'string') {
      updateData.features = JSON.parse(updateData.features);
    }
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.year) updateData.year = Number(updateData.year);
    if (updateData.mileage) updateData.mileage = Number(updateData.mileage);
    if (updateData.horsepower) updateData.horsepower = Number(updateData.horsepower);
    if (updateData.isFeatured !== undefined) updateData.isFeatured = updateData.isFeatured === 'true';

    // Add new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: file.path,
        publicId: file.filename,
        isPrimary: car.images.length === 0 && index === 0
      }));
      updateData.images = [...(car.images || []), ...newImages];
    }

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, updateData, {
      new: true, runValidators: true
    });
    res.json({ success: true, data: updatedCar, message: 'Car updated successfully.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/cars/:id/images/:publicId - Admin: Delete specific image
router.delete('/:id/images/:publicId', protect, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found.' });
    const publicId = decodeURIComponent(req.params.publicId);
    await deleteImage(publicId);
    car.images = car.images.filter(img => img.publicId !== publicId);
    if (car.images.length > 0 && !car.images.some(img => img.isPrimary)) {
      car.images[0].isPrimary = true;
    }
    await car.save();
    res.json({ success: true, message: 'Image deleted.', data: car });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/cars/:id - Admin: Delete car
router.delete('/:id', protect, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found.' });
    // Delete all Cloudinary images
    await Promise.all(car.images.map(img => deleteImage(img.publicId)));
    await Car.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Car deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/cars/:id/toggle-featured
router.patch('/:id/toggle-featured', protect, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found.' });
    car.isFeatured = !car.isFeatured;
    await car.save();
    res.json({ success: true, data: car, message: `Car ${car.isFeatured ? 'featured' : 'unfeatured'}.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

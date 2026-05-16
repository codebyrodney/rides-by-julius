import Car from '../models/Car.js';
import { cloudinary } from '../utils/cloudinary.js';

export const getCars = async (req, res) => {
  try {
    const { brand, bodyType, condition, minPrice, maxPrice, search, sort, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (bodyType) filter.bodyType = bodyType;
    if (condition) filter.condition = condition;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') },
        { model: new RegExp(search, 'i') },
      ];
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
    };
    const sortQuery = sortOptions[sort] || { createdAt: -1 };
    const skip = (Number(page) - 1) * Number(limit);

    const [cars, total] = await Promise.all([
      Car.find(filter).sort(sortQuery).skip(skip).limit(Number(limit)),
      Car.countDocuments(filter),
    ]);

    res.json({ cars, total, pages: Math.ceil(total / Number(limit)), page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFeaturedCars = async (req, res) => {
  try {
    const cars = await Car.find({ isFeatured: true, isAvailable: true }).limit(6).sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    car.views += 1;
    await car.save();
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCar = async (req, res) => {
  try {
    const images = (req.files || []).map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));
    const features = typeof req.body.features === 'string'
      ? JSON.parse(req.body.features)
      : req.body.features || [];

    const car = await Car.create({ ...req.body, images, features });
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    const newImages = (req.files || []).map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    const features = typeof req.body.features === 'string'
      ? JSON.parse(req.body.features)
      : req.body.features || car.features;

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        features,
        images: newImages.length > 0 ? newImages : car.images,
      },
      { new: true, runValidators: true }
    );
    res.json(updatedCar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    // Delete images from Cloudinary
    await Promise.all(car.images.map((img) => {
      if (img.publicId) return cloudinary.uploader.destroy(img.publicId);
    }));

    await car.deleteOne();
    res.json({ message: 'Car deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBrands = async (req, res) => {
  try {
    const brands = await Car.distinct('brand');
    res.json(brands.sort());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// server/controllers/carController.js — Car CRUD + search/filter/pagination

const Car = require('../models/Car');
const { cloudinary } = require('../config/cloudinary');
const { PAGINATION } = require('../../shared/constants');

// ─── List / Search ─────────────────────────────────────────────────────────

/**
 * GET /api/cars
 * Query params: brand, location, minPrice, maxPrice, year, condition,
 *               fuelType, transmission, bodyType, search,
 *               sort, page, limit
 */
exports.getCars = async (req, res) => {
  const {
    brand, location, minPrice, maxPrice, year, condition,
    fuelType, transmission, bodyType, search,
    sort = '-createdAt',
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
  } = req.query;

  const filter = { isAvailable: true };

  if (brand) filter.brand = brand;
  if (location) filter.location = location;
  if (condition) filter.condition = condition;
  if (fuelType) filter.fuelType = fuelType;
  if (transmission) filter.transmission = transmission;
  if (bodyType) filter.bodyType = bodyType;
  if (year) filter.year = Number(year);

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Full-text search
  if (search) {
    filter.$text = { $search: search };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [cars, total] = await Promise.all([
    Car.find(filter)
      .populate('seller', 'name email phone avatar')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Car.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: cars,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
      hasMore: skip + cars.length < total,
    },
  });
};

// ─── Single car ────────────────────────────────────────────────────────────

/**
 * GET /api/cars/:id
 */
exports.getCar = async (req, res) => {
  const car = await Car.findById(req.params.id)
    .populate('seller', 'name email phone avatar createdAt');

  if (!car) {
    return res.status(404).json({ success: false, message: 'Car not found' });
  }

  // Increment views (fire-and-forget)
  Car.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).exec();

  res.json({ success: true, data: car });
};

// ─── Create ────────────────────────────────────────────────────────────────

/**
 * POST /api/cars
 */
exports.createCar = async (req, res) => {
  const {
    title, description, price, brand, model, year, mileage,
    condition, fuelType, transmission, bodyType, color, location, features,
  } = req.body;

  // Build images array from uploaded files
  const images = req.files
    ? req.files.map((file) => ({
        url: file.path || file.secure_url || `/uploads/${file.filename}`,
        publicId: file.filename || file.public_id || null,
      }))
    : [];

  const car = await Car.create({
    title, description, price, brand, model, year, mileage,
    condition, fuelType, transmission, bodyType, color,
    location, features: features ? JSON.parse(features) : [],
    images,
    seller: req.user._id,
  });

  await car.populate('seller', 'name email phone avatar');

  res.status(201).json({ success: true, data: car });
};

// ─── Update ────────────────────────────────────────────────────────────────

/**
 * PUT /api/cars/:id
 */
exports.updateCar = async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    return res.status(404).json({ success: false, message: 'Car not found' });
  }

  // Only seller or admin can edit
  if (car.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to edit this listing' });
  }

  const allowedFields = [
    'title', 'description', 'price', 'brand', 'model', 'year',
    'mileage', 'condition', 'fuelType', 'transmission', 'bodyType',
    'color', 'location', 'features', 'isAvailable',
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      car[field] = req.body[field];
    }
  });

  // Append new images if uploaded
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => ({
      url: file.path || file.secure_url || `/uploads/${file.filename}`,
      publicId: file.filename || file.public_id || null,
    }));
    car.images = [...car.images, ...newImages];
  }

  await car.save();
  await car.populate('seller', 'name email phone avatar');

  res.json({ success: true, data: car });
};

// ─── Delete ────────────────────────────────────────────────────────────────

/**
 * DELETE /api/cars/:id
 */
exports.deleteCar = async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    return res.status(404).json({ success: false, message: 'Car not found' });
  }

  if (car.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
  }

  // Remove images from Cloudinary
  const deletePromises = car.images
    .filter((img) => img.publicId)
    .map((img) => cloudinary.uploader.destroy(img.publicId).catch(() => {}));
  await Promise.all(deletePromises);

  await car.deleteOne();

  res.json({ success: true, message: 'Listing deleted' });
};

// ─── Delete single image from a listing ───────────────────────────────────

/**
 * DELETE /api/cars/:id/images/:imageId
 */
exports.deleteCarImage = async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) return res.status(404).json({ success: false, message: 'Car not found' });

  if (car.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const img = car.images.id(req.params.imageId);
  if (!img) return res.status(404).json({ success: false, message: 'Image not found' });

  if (img.publicId) await cloudinary.uploader.destroy(img.publicId).catch(() => {});
  img.deleteOne();
  await car.save();

  res.json({ success: true, data: car });
};

// ─── Toggle favorite ───────────────────────────────────────────────────────

/**
 * POST /api/cars/:id/favorite
 */
exports.toggleFavorite = async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) return res.status(404).json({ success: false, message: 'Car not found' });

  const userId = req.user._id;
  const isFav = car.favoritedBy.includes(userId);

  if (isFav) {
    car.favoritedBy.pull(userId);
  } else {
    car.favoritedBy.push(userId);
  }

  await car.save();
  res.json({ success: true, isFavorited: !isFav, favoriteCount: car.favoritedBy.length });
};

// ─── User's own listings ───────────────────────────────────────────────────

/**
 * GET /api/cars/mine
 */
exports.getMyCars = async (req, res) => {
  const cars = await Car.find({ seller: req.user._id })
    .sort('-createdAt')
    .lean();

  res.json({ success: true, data: cars, total: cars.length });
};

// ─── User's favorites ──────────────────────────────────────────────────────

/**
 * GET /api/cars/favorites
 */
exports.getFavorites = async (req, res) => {
  const cars = await Car.find({ favoritedBy: req.user._id })
    .populate('seller', 'name email phone')
    .sort('-createdAt')
    .lean();

  res.json({ success: true, data: cars, total: cars.length });
};

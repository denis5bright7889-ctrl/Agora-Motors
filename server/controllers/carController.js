const Car = require('../models/Car');
const cloudinary = require('../config/cloudinary');

// @desc    Get all cars with filters
// @route   GET /api/cars
// @access  Public
const getCars = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const startIndex = (page - 1) * limit;

  let query = {};

  // Filters
  if (req.query.brand) query.brand = req.query.brand;
  if (req.query.minPrice) query.price = { $gte: parseInt(req.query.minPrice) };
  if (req.query.maxPrice) query.price = { ...query.price, $lte: parseInt(req.query.maxPrice) };
  if (req.query.minYear) query.year = { $gte: parseInt(req.query.minYear) };
  if (req.query.maxYear) query.year = { ...query.year, $lte: parseInt(req.query.maxYear) };
  if (req.query.location) query.location = req.query.location;
  if (req.query.condition) query.condition = req.query.condition;
  if (req.query.fuelType) query.fuelType = req.query.fuelType;
  if (req.query.transmission) query.transmission = req.query.transmission;
  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { brand: { $regex: req.query.search, $options: 'i' } },
      { model: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const total = await Car.countDocuments(query);
  const cars = await Car.find(query)
    .populate('seller', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(startIndex);

  res.json({
    cars,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
};

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
const getCarById = async (req, res) => {
  const car = await Car.findById(req.params.id).populate('seller', 'name email');
  
  if (car) {
    res.json(car);
  } else {
    res.status(404);
    throw new Error('Car not found');
  }
};

// @desc    Create a car
// @route   POST /api/cars
// @access  Private
const createCar = async (req, res) => {
  const {
    title,
    price,
    brand,
    model,
    year,
    mileage,
    location,
    description,
    fuelType,
    transmission,
    condition,
  } = req.body;

  const car = await Car.create({
    title,
    price,
    brand,
    model,
    year,
    mileage,
    location,
    description,
    fuelType,
    transmission,
    condition,
    images: req.body.images || [],
    seller: req.user._id,
  });

  res.status(201).json(car);
};

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private
const updateCar = async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (car && car.seller.toString() === req.user._id.toString()) {
    Object.assign(car, req.body);
    const updatedCar = await car.save();
    res.json(updatedCar);
  } else {
    res.status(404);
    throw new Error('Car not found or not authorized');
  }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private
const deleteCar = async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (car && car.seller.toString() === req.user._id.toString()) {
    await car.deleteOne();
    res.json({ message: 'Car removed' });
  } else {
    res.status(404);
    throw new Error('Car not found or not authorized');
  }
};

// @desc    Upload car image
// @route   POST /api/cars/upload
// @access  Private
const uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'auto-agora',
    });
    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500);
    throw new Error('Image upload failed');
  }
};

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  uploadImage,
};
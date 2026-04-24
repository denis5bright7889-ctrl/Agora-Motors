// server/routes/cars.js — Car routes

const router = require('express').Router();
const {
  getCars, getCar, createCar, updateCar, deleteCar,
  toggleFavorite, getMyCars, getFavorites, deleteCarImage,
} = require('../controllers/carController');
const { protect, optionalAuth } = require('../middleware/auth');
const { validateCar } = require('../middleware/validate');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', optionalAuth, getCars);
router.get('/mine', protect, getMyCars);         // must come before /:id
router.get('/favorites', protect, getFavorites); // must come before /:id
router.get('/:id', optionalAuth, getCar);

// Protected routes
router.post('/', protect, upload.array('images', 8), validateCar, createCar);
router.put('/:id', protect, upload.array('images', 8), updateCar);
router.delete('/:id', protect, deleteCar);
router.delete('/:id/images/:imageId', protect, deleteCarImage);
router.post('/:id/favorite', protect, toggleFavorite);

module.exports = router;

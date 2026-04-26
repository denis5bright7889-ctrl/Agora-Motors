const express = require('express');
const multer = require('multer');
const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  uploadImage,
} = require('../controllers/carController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.route('/').get(getCars).post(protect, createCar);
router.route('/:id').get(getCarById).put(protect, updateCar).delete(protect, deleteCar);
router.post('/upload', protect, upload.single('image'), uploadImage);

module.exports = router;
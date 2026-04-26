const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0,
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Please add a model'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Please add a year'],
    min: 1886,
    max: new Date().getFullYear() + 1,
  },
  mileage: {
    type: Number,
    required: [true, 'Please add mileage'],
    min: 0,
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    trim: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: 2000,
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    required: true,
  },
  transmission: {
    type: String,
    enum: ['Manual', 'Automatic'],
    required: true,
  },
  condition: {
    type: String,
    enum: ['New', 'Used', 'Certified Pre-Owned'],
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

carSchema.index({ title: 'text', brand: 'text', model: 'text' });

module.exports = mongoose.model('Car', carSchema);
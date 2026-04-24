// server/models/Car.js — Car listing schema

const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1900, 'Year must be 1900 or later'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    mileage: {
      type: Number,
      required: [true, 'Mileage is required'],
      min: [0, 'Mileage cannot be negative'],
    },
    condition: {
      type: String,
      enum: ['New', 'Used', 'Certified Pre-Owned'],
      default: 'Used',
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'],
      default: 'Petrol',
    },
    transmission: {
      type: String,
      enum: ['Automatic', 'Manual', 'CVT', 'Semi-Automatic'],
      default: 'Automatic',
    },
    bodyType: {
      type: String,
      enum: ['Sedan', 'SUV', 'Hatchback', 'Pickup Truck', 'Coupe', 'Convertible', 'Wagon', 'Minivan', 'Crossover', 'Van'],
    },
    color: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String }, // Cloudinary public_id for deletion
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    features: [String], // e.g. ['Sunroof', 'Leather Seats', 'Backup Camera']
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    favoritedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for common queries
carSchema.index({ brand: 1, model: 1 });
carSchema.index({ price: 1 });
carSchema.index({ location: 1 });
carSchema.index({ seller: 1 });
carSchema.index({ createdAt: -1 });
carSchema.index({ title: 'text', brand: 'text', model: 'text', description: 'text' });

// Virtual: favorite count
carSchema.virtual('favoriteCount').get(function () {
  return this.favoritedBy ? this.favoritedBy.length : 0;
});

// Virtual: primary image URL
carSchema.virtual('primaryImage').get(function () {
  if (this.images && this.images.length > 0) return this.images[0].url;
  return null;
});

module.exports = mongoose.model('Car', carSchema);

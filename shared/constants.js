// shared/constants.js — shared between client and server

const CAR_BRANDS = [
  'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz',
  'Audi', 'Volkswagen', 'Hyundai', 'Kia', 'Nissan', 'Mazda',
  'Subaru', 'Lexus', 'Jeep', 'Tesla', 'Volvo', 'Porsche',
  'Land Rover', 'Jaguar', 'Mitsubishi', 'Peugeot', 'Renault', 'Other'
];

const CAR_CONDITIONS = ['New', 'Used', 'Certified Pre-Owned'];

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];

const TRANSMISSION_TYPES = ['Automatic', 'Manual', 'CVT', 'Semi-Automatic'];

const BODY_TYPES = [
  'Sedan', 'SUV', 'Hatchback', 'Pickup Truck', 'Coupe',
  'Convertible', 'Wagon', 'Minivan', 'Crossover', 'Van'
];

const LOCATIONS = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
  'Thika', 'Malindi', 'Nyeri', 'Machakos', 'Meru',
  'Naivasha', 'Kitale', 'Garissa', 'Kakamega', 'Other'
];

const PRICE_RANGES = [
  { label: 'Under KES 500K', min: 0, max: 500000 },
  { label: 'KES 500K – 1M', min: 500000, max: 1000000 },
  { label: 'KES 1M – 2M', min: 1000000, max: 2000000 },
  { label: 'KES 2M – 5M', min: 2000000, max: 5000000 },
  { label: 'Over KES 5M', min: 5000000, max: null },
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: '-createdAt' },
  { label: 'Oldest First', value: 'createdAt' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Year: Newest', value: '-year' },
  { label: 'Mileage: Lowest', value: 'mileage' },
];

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
};

module.exports = {
  CAR_BRANDS,
  CAR_CONDITIONS,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  BODY_TYPES,
  LOCATIONS,
  PRICE_RANGES,
  SORT_OPTIONS,
  PAGINATION,
};

// Shared constants for Agora Motors
export const CAR_BRANDS = [
  'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz',
  'Audi', 'Volkswagen', 'Hyundai', 'Kia', 'Nissan', 'Mazda',
  'Subaru', 'Lexus', 'Jeep', 'Tesla', 'Volvo', 'Porsche',
  'Land Rover', 'Jaguar', 'Mitsubishi', 'Peugeot', 'Renault', 'Other'
];

export const CAR_CONDITIONS = ['New', 'Used', 'Certified Pre-Owned'];

export const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];

export const TRANSMISSION_TYPES = ['Automatic', 'Manual', 'CVT', 'Semi-Automatic'];

export const BODY_TYPES = [
  'Sedan', 'SUV', 'Hatchback', 'Pickup Truck', 'Coupe',
  'Convertible', 'Wagon', 'Minivan', 'Crossover', 'Van'
];

export const LOCATIONS = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
  'Thika', 'Malindi', 'Nyeri', 'Machakos', 'Meru',
  'Naivasha', 'Kitale', 'Garissa', 'Kakamega', 'Other'
];

export const PRICE_RANGES = [
  { label: 'Under KES 500K', min: 0, max: 500000 },
  { label: 'KES 500K – 1M', min: 500000, max: 1000000 },
  { label: 'KES 1M – 2M', min: 1000000, max: 2000000 },
  { label: 'KES 2M – 5M', min: 2000000, max: 5000000 },
  { label: 'Over KES 5M', min: 5000000, max: null },
];

export const SORT_OPTIONS = [
  { label: 'Newest First', value: '-createdAt' },
  { label: 'Oldest First', value: 'createdAt' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Year: Newest', value: '-year' },
  { label: 'Mileage: Lowest', value: 'mileage' },
];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
};

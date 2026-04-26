import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CAR_BRANDS } from '../constants';

const HomePage = () => {
  const [loading] = useState(false);
  const popularBrands = CAR_BRANDS?.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Car in Kenya</h1>
          <p className="text-xl mb-8">Browse thousands of new and used cars from trusted dealers</p>
          <Link to="/cars" className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition">
            Browse Cars
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Popular Brands</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularBrands.map((brand) => (
            <Link key={brand} to={`/cars?brand=${brand}`} className="bg-white p-4 rounded-lg shadow text-center hover:shadow-lg transition">
              <div className="font-semibold text-gray-800">{brand}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

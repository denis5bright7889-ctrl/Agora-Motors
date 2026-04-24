// client/src/pages/FavoritesPage.jsx

import { useState, useEffect } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { carsApi } from '../api/carsApi';
import CarCard from '../components/cars/CarCard';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const [cars, setCars]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carsApi.getFavorites()
      .then(({ data }) => setCars(data.data))
      .catch(() => toast.error('Failed to load favorites'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="page-header">
        <div className="container-xl">
          <h1 className="text-2xl font-bold text-slate-800">Saved Cars</h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? 'Loading…' : `${cars.length} car${cars.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>
      </div>

      <div className="container-xl py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={30} className="animate-spin text-slate-300" />
          </div>
        ) : cars.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No saved cars"
            description="Tap the heart on any listing to save it here."
            actionLabel="Browse Cars"
            actionTo="/cars"
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {cars.map((car) => <CarCard key={car._id} car={car} />)}
          </div>
        )}
      </div>
    </div>
  );
}

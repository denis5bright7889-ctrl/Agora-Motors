// client/src/components/cars/CarCard.jsx

import { Link } from 'react-router-dom';
import { Heart, MapPin, Fuel, Gauge, Calendar } from 'lucide-react';
import { formatPrice, formatMileage, timeAgo, CAR_PLACEHOLDER } from '../../utils/helpers';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function CarCard({ car, className = '' }) {
  const { isAuthenticated } = useAuth();
  const { toggle, isFavorited } = useFavorites();
  const favorited = isFavorited(car._id);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please log in to save favorites');
      return;
    }
    const ok = await toggle(car._id);
    if (ok) toast.success(favorited ? 'Removed from favorites' : 'Added to favorites');
  };

  const imageUrl = car.images?.[0]?.url || CAR_PLACEHOLDER;

  return (
    <Link
      to={`/cars/${car._id}`}
      className={`card group flex flex-col animate-fade-in ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={car.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = CAR_PLACEHOLDER; }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {car.condition === 'New' && (
            <span className="badge-green text-[11px]">New</span>
          )}
          {car.isFeatured && (
            <span className="badge-orange text-[11px]">Featured</span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center
                      backdrop-blur-sm transition-all duration-200 active:scale-90
                      ${favorited
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-white/80 text-slate-500 hover:bg-white hover:text-red-500'
                      }`}
        >
          <Heart size={15} fill={favorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Price */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xl font-bold text-brand-600 leading-none">
            {formatPrice(car.price)}
          </span>
          <span className="text-xs text-slate-400 mt-0.5 shrink-0">{timeAgo(car.createdAt)}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-3 line-clamp-2">
          {car.title}
        </h3>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 mb-3">
          <StatBadge icon={<Calendar size={12}/>}  label={car.year} />
          <StatBadge icon={<Gauge size={12}/>}     label={formatMileage(car.mileage)} />
          <StatBadge icon={<Fuel size={12}/>}      label={car.fuelType} />
        </div>

        {/* Location */}
        <div className="mt-auto flex items-center gap-1 text-xs text-slate-400">
          <MapPin size={12} className="shrink-0" />
          <span className="truncate">{car.location}</span>
        </div>
      </div>
    </Link>
  );
}

function StatBadge({ icon, label }) {
  return (
    <div className="flex items-center gap-1 bg-slate-50 rounded-lg px-2 py-1.5">
      <span className="text-slate-400">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}

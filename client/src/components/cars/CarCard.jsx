import { Link } from 'react-router-dom';
import { Heart, MapPin, Gauge, Calendar } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { formatMileage, formatPrice, CAR_PLACEHOLDER } from '../../utils/helpers';

export default function CarCard({ car }) {
  const { isFavorited, toggle } = useFavorites();
  const favorited = isFavorited(car._id);

  const handleFavoriteClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await toggle(car._id);
  };

  return (
    <Link to={`/cars/${car._id}`} className="card block overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-[16/10] bg-slate-100">
        <img
          src={car.images?.[0]?.url || CAR_PLACEHOLDER}
          alt={car.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = CAR_PLACEHOLDER;
          }}
        />
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute right-3 top-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-600 flex items-center justify-center"
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={16} fill={favorited ? 'currentColor' : 'none'} className={favorited ? 'text-red-500' : ''} />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-slate-900 line-clamp-1">{car.title}</h3>
        <p className="text-brand-600 font-bold text-lg">{formatPrice(car.price)}</p>

        <div className="text-sm text-slate-500 flex items-center gap-1">
          <MapPin size={14} />
          <span className="line-clamp-1">{car.location}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1">
            <Calendar size={13} />
            <span>{car.year || '-'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge size={13} />
            <span>{formatMileage(car.mileage)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

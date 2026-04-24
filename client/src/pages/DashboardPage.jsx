// client/src/pages/DashboardPage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Car, Eye, Heart, Edit2, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { carsApi } from '../api/carsApi';
import { useAuth } from '../context/AuthContext';
import { formatPrice, timeAgo, CAR_PLACEHOLDER } from '../utils/helpers';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const [cars, setCars]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    carsApi.getMine()
      .then(({ data }) => setCars(data.data))
      .catch(() => toast.error('Failed to load listings'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await carsApi.remove(id);
      setCars((prev) => prev.filter((c) => c._id !== id));
      toast.success('Listing deleted');
    } catch {
      toast.error('Failed to delete listing');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleAvailable = async (car) => {
    try {
      const fd = new FormData();
      fd.append('isAvailable', !car.isAvailable);
      const { data } = await carsApi.update(car._id, fd);
      setCars((prev) => prev.map((c) => c._id === car._id ? data.data : c));
      toast.success(data.data.isAvailable ? 'Listing activated' : 'Listing paused');
    } catch {
      toast.error('Failed to update listing');
    }
  };

  const stats = [
    { label: 'Total Listings', value: cars.length,              icon: Car },
    { label: 'Active',         value: cars.filter((c) => c.isAvailable).length,  icon: Eye },
    { label: 'Total Views',    value: cars.reduce((s, c) => s + c.views, 0), icon: Eye },
    { label: 'Saved',          value: cars.reduce((s, c) => s + (c.favoritedBy?.length || 0), 0), icon: Heart },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="page-header">
        <div className="container-xl flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Welcome back, {user?.name?.split(' ')[0]}</p>
          </div>
          <Link to="/listings/new" className="btn-primary">
            <Plus size={16} /> New Listing
          </Link>
        </div>
      </div>

      <div className="container-xl py-8 space-y-8">

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl shadow-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center">
                  <Icon size={15} className="text-brand-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800">{value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Listings table */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">My Listings</h2>
            <span className="badge-slate">{cars.length} total</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={28} className="animate-spin text-slate-300" />
            </div>
          ) : cars.length === 0 ? (
            <EmptyState
              icon={Car}
              title="No listings yet"
              description="Create your first listing to start selling."
              actionLabel="Create Listing"
              actionTo="/listings/new"
            />
          ) : (
            <div className="divide-y divide-slate-50">
              {cars.map((car) => (
                <ListingRow
                  key={car._id}
                  car={car}
                  onDelete={handleDelete}
                  onToggle={handleToggleAvailable}
                  deleting={deleting === car._id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ListingRow({ car, onDelete, onToggle, deleting }) {
  const img = car.images?.[0]?.url || CAR_PLACEHOLDER;

  return (
    <div className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
      {/* Thumbnail */}
      <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
        <img src={img} alt={car.title} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/cars/${car._id}`} className="font-semibold text-slate-800 text-sm hover:text-brand-600 truncate block">
          {car.title}
        </Link>
        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
          <span className="font-semibold text-brand-600">{formatPrice(car.price)}</span>
          <span>{car.year} · {car.location}</span>
          <span>{car.views} views</span>
          <span>{timeAgo(car.createdAt)}</span>
        </div>
      </div>

      {/* Status badge */}
      <span className={car.isAvailable ? 'badge-green hidden sm:inline-flex' : 'badge-slate hidden sm:inline-flex'}>
        {car.isAvailable ? 'Active' : 'Paused'}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onToggle(car)}
          title={car.isAvailable ? 'Pause listing' : 'Activate listing'}
          className="p-2 rounded-xl text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
        >
          {car.isAvailable ? <ToggleRight size={18} className="text-emerald-500" /> : <ToggleLeft size={18} />}
        </button>

        <Link
          to={`/listings/${car._id}/edit`}
          className="p-2 rounded-xl text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
          title="Edit listing"
        >
          <Edit2 size={16} />
        </Link>

        <button
          onClick={() => onDelete(car._id)}
          disabled={deleting}
          className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
          title="Delete listing"
        >
          {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
      </div>
    </div>
  );
}

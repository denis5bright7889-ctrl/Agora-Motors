// client/src/pages/CarDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Gauge, Fuel, Settings2, Car, Heart, Phone,
  Mail, Share2, Flag, ChevronLeft, ChevronRight, Loader2, Edit, Trash2,
} from 'lucide-react';
import { carsApi } from '../api/carsApi';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { formatPrice, formatMileage, timeAgo, CAR_PLACEHOLDER } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function CarDetailPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toggle, isFavorited }   = useFavorites();

  const [car, setCar]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx]   = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    carsApi.getById(id)
      .then(({ data }) => setCar(data.data))
      .catch(() => navigate('/cars', { replace: true }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleFavorite = async () => {
    if (!isAuthenticated) { toast.error('Please log in to save favorites'); return; }
    const ok = await toggle(car._id);
    if (ok) toast.success(isFavorited(car._id) ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    setDeleting(true);
    try {
      await carsApi.remove(car._id);
      toast.success('Listing deleted');
      navigate('/dashboard');
    } catch {
      toast.error('Could not delete listing');
      setDeleting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 size={32} className="animate-spin text-brand-600" />
    </div>
  );

  if (!car) return null;

  const images  = car.images?.length > 0 ? car.images : [{ url: CAR_PLACEHOLDER }];
  const isOwner = user && car.seller?._id === user._id;
  const favorited = isFavorited(car._id);

  const prevImg = () => setImgIdx((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setImgIdx((i) => (i + 1) % images.length);

  return (
    <div className="container-xl py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link to="/" className="hover:text-slate-700">Home</Link>
        <ChevronRight size={14} />
        <Link to="/cars" className="hover:text-slate-700">Cars</Link>
        <ChevronRight size={14} />
        <span className="text-slate-600 truncate max-w-[200px]">{car.title}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ── Left column ───────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Gallery */}
          <div className="card overflow-hidden">
            <div className="relative aspect-video bg-slate-100">
              <img
                src={images[imgIdx]?.url || CAR_PLACEHOLDER}
                alt={car.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = CAR_PLACEHOLDER; }}
              />
              {images.length > 1 && (
                <>
                  <button onClick={prevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                               bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                               bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors">
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                    {imgIdx + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all
                      ${i === imgIdx ? 'border-brand-500' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = CAR_PLACEHOLDER; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Price */}
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{car.title}</h1>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><MapPin size={13}/> {car.location}</span>
                  <span>·</span>
                  <span>Listed {timeAgo(car.createdAt)}</span>
                  <span>·</span>
                  <span>{car.views} views</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-brand-600">{formatPrice(car.price)}</div>
                {car.condition && <span className="badge-slate mt-1">{car.condition}</span>}
              </div>
            </div>
          </div>

          {/* Specs */}
          <div className="card p-6">
            <h2 className="font-semibold text-slate-800 mb-5">Vehicle Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <SpecItem icon={<Calendar size={16}/>}  label="Year"         value={car.year} />
              <SpecItem icon={<Gauge size={16}/>}     label="Mileage"      value={formatMileage(car.mileage)} />
              <SpecItem icon={<Fuel size={16}/>}      label="Fuel"         value={car.fuelType} />
              <SpecItem icon={<Settings2 size={16}/>} label="Transmission" value={car.transmission} />
              <SpecItem icon={<Car size={16}/>}       label="Body Type"    value={car.bodyType} />
              {car.color && (
                <SpecItem icon={<span className="text-base">🎨</span>} label="Colour" value={car.color} />
              )}
            </div>
          </div>

          {/* Description */}
          {car.description && (
            <div className="card p-6">
              <h2 className="font-semibold text-slate-800 mb-4">Description</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{car.description}</p>
            </div>
          )}

          {/* Features */}
          {car.features?.length > 0 && (
            <div className="card p-6">
              <h2 className="font-semibold text-slate-800 mb-4">Features & Extras</h2>
              <div className="flex flex-wrap gap-2">
                {car.features.map((f) => (
                  <span key={f} className="badge-slate">{f}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right column ──────────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Seller card */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Seller Information</h3>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-lg font-bold uppercase">
                {car.seller?.name?.charAt(0) || 'S'}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{car.seller?.name || 'Unknown'}</p>
                <p className="text-xs text-slate-400">Member since {new Date(car.seller?.createdAt).getFullYear()}</p>
              </div>
            </div>

            <div className="space-y-3">
              {car.seller?.phone && (
                <a href={`tel:${car.seller.phone}`} className="btn-primary w-full">
                  <Phone size={16}/> Call Seller
                </a>
              )}
              {car.seller?.email && (
                <a href={`mailto:${car.seller.email}?subject=Enquiry: ${car.title}`}
                   className="btn-outline w-full">
                  <Mail size={16}/> Email Seller
                </a>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="card p-5">
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleFavorite}
                className={`btn ${favorited ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' : 'btn-outline'}`}>
                <Heart size={16} fill={favorited ? 'currentColor' : 'none'} />
                {favorited ? 'Saved' : 'Save'}
              </button>
              <button onClick={handleShare} className="btn-outline">
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div className="card p-5 border border-amber-200 bg-amber-50">
              <p className="text-xs font-semibold text-amber-700 mb-3 uppercase tracking-wide">Your Listing</p>
              <div className="space-y-2">
                <Link to={`/listings/${car._id}/edit`} className="btn-outline w-full">
                  <Edit size={16}/> Edit Listing
                </Link>
                <button onClick={handleDelete} disabled={deleting} className="btn-danger w-full">
                  {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16}/>}
                  Delete Listing
                </button>
              </div>
            </div>
          )}

          {/* Safety tip */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-700 mb-2">⚠️ Safety Tips</p>
            <ul className="text-xs text-slate-500 space-y-1.5 list-disc list-inside">
              <li>Meet in a public place</li>
              <li>Inspect the car before paying</li>
              <li>Verify documents before transfer</li>
              <li>Never send money without seeing the car</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecItem({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
      <span className="text-slate-400 mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-700 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

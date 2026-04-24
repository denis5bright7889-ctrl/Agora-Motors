// client/src/pages/HomePage.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Shield, Zap, Star, ChevronRight } from 'lucide-react';
import { carsApi } from '../api/carsApi';
import CarCard from '../components/cars/CarCard';
import CarCardSkeleton from '../components/cars/CarCardSkeleton';
import { CAR_BRANDS } from '../../../shared/constants';

// Popular brands to feature (subset with logos via placeholder)
const FEATURED_BRANDS = ['Toyota', 'Honda', 'BMW', 'Mercedes-Benz', 'Ford', 'Audi', 'Hyundai', 'Volkswagen'];

const STATS = [
  { value: '10,000+', label: 'Cars Listed' },
  { value: '5,000+', label: 'Happy Buyers' },
  { value: '50+', label: 'Verified Dealers' },
  { value: '47', label: 'Counties Covered' },
];

const WHY_US = [
  {
    icon: <Shield size={22} />,
    title: 'Verified Listings',
    desc: 'Every car goes through our verification process before going live.',
  },
  {
    icon: <Zap size={22} />,
    title: 'Instant Alerts',
    desc: 'Get notified the moment a car matching your criteria is listed.',
  },
  {
    icon: <Star size={22} />,
    title: 'Trusted Sellers',
    desc: 'Read reviews and ratings from real buyers before you commit.',
  },
];

export default function HomePage() {
  const navigate  = useNavigate();
  const [search, setSearch]     = useState('');
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    carsApi.getAll({ limit: 8, sort: '-createdAt' })
      .then(({ data }) => setFeatured(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/cars?search=${encodeURIComponent(search)}`);
  };

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-slate-900 overflow-hidden">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Orange accent blob */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-brand-500/10 blur-3xl" />

        <div className="container-xl relative py-20 md:py-28 lg:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-600/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span className="text-brand-300 text-xs font-medium">Kenya's #1 Car Marketplace</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white tracking-wider leading-none mb-6">
              FIND YOUR<br />
              <span className="text-brand-400">PERFECT</span><br />
              DRIVE.
            </h1>
            <p className="text-slate-400 text-lg mb-10 max-w-xl leading-relaxed">
              Browse thousands of verified car listings across Kenya. Buy with confidence, sell in minutes.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex gap-3 max-w-xl">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by make, model, or keyword…"
                  className="w-full bg-white/10 backdrop-blur border border-white/20 text-white placeholder:text-slate-500
                             rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20"
                />
              </div>
              <button type="submit" className="btn-primary btn-lg shrink-0 rounded-2xl">
                Search
              </button>
            </form>

            {/* Quick filters */}
            <div className="flex flex-wrap gap-2 mt-5">
              {['SUV', 'Sedan', 'Under KES 1M', 'Electric'].map((tag) => (
                <Link
                  key={tag}
                  to={`/cars?${tag === 'Under KES 1M' ? 'maxPrice=1000000' : tag === 'Electric' ? 'fuelType=Electric' : `bodyType=${tag}`}`}
                  className="text-xs bg-white/10 text-slate-300 border border-white/10 rounded-full
                             px-3.5 py-1.5 hover:bg-white/20 hover:text-white transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="bg-brand-600">
        <div className="container-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-brand-500">
            {STATS.map(({ value, label }) => (
              <div key={label} className="py-6 px-8 text-center">
                <div className="font-display text-4xl text-white tracking-wider">{value}</div>
                <div className="text-brand-200 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Listings ──────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-2">Fresh Arrivals</p>
              <h2 className="text-3xl font-bold text-slate-900">Latest Listings</h2>
            </div>
            <Link to="/cars" className="btn-outline hidden sm:flex items-center gap-2">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <CarCardSkeleton key={i} />)}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {featured.map((car) => <CarCard key={car._id} car={car} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <p className="text-lg">No listings yet. Be the first to sell!</p>
              <Link to="/listings/new" className="btn-primary mt-4">Post a Car</Link>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link to="/cars" className="btn-outline">View All Cars</Link>
          </div>
        </div>
      </section>

      {/* ── Browse by Brand ──────────────────────────────────────────────── */}
      <section className="section bg-slate-50 border-y border-slate-100">
        <div className="container-xl">
          <div className="text-center mb-10">
            <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-2">Popular Makes</p>
            <h2 className="text-3xl font-bold text-slate-900">Browse by Brand</h2>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {FEATURED_BRANDS.map((brand) => (
              <Link
                key={brand}
                to={`/cars?brand=${brand}`}
                className="group flex flex-col items-center gap-3 bg-white rounded-2xl p-4
                           shadow-card hover:shadow-card-hover transition-all duration-200
                           hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center
                                group-hover:bg-brand-50 transition-colors">
                  <span className="font-bold text-lg text-slate-600 group-hover:text-brand-600 transition-colors">
                    {brand.charAt(0)}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-600 text-center leading-tight">{brand}</span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/cars" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors">
              See all brands <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why CarMax ───────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-2">Why Choose Us</p>
            <h2 className="text-3xl font-bold text-slate-900">The CarMax Difference</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {WHY_US.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-3xl p-8 shadow-card text-center hover:shadow-card-hover transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-5">
                  {icon}
                </div>
                <h3 className="font-bold text-slate-800 mb-3">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="bg-slate-900 py-16">
        <div className="container-xl text-center">
          <h2 className="font-display text-4xl md:text-5xl text-white tracking-wider mb-4">
            READY TO SELL?
          </h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            List your car in under 5 minutes and reach thousands of buyers across Kenya.
          </p>
          <Link to="/listings/new" className="btn-primary btn-lg">
            Post Your Car for Free
          </Link>
        </div>
      </section>
    </div>
  );
}

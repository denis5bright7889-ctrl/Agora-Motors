// client/src/pages/ListingsPage.jsx

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { carsApi } from '../api/carsApi';
import CarCard from '../components/cars/CarCard';
import CarCardSkeleton from '../components/cars/CarCardSkeleton';
import SearchFilters from '../components/cars/SearchFilters';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import { SORT_OPTIONS } from '../../../shared/constants';
import { pluralise } from '../utils/helpers';

const DEFAULT_FILTERS = {
  search: '', brand: '', location: '', bodyType: '',
  fuelType: '', transmission: '', year: '', condition: '',
  minPrice: '', maxPrice: '', sort: '-createdAt', page: 1,
};

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars]           = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading]     = useState(true);

  // Initialise filters from URL params
  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    ...Object.fromEntries(searchParams.entries()),
  }));

  // Sync filters → URL
  const syncUrl = useCallback((f) => {
    const params = {};
    Object.entries(f).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined && v !== 1 && k !== 'page') params[k] = v;
      if (k === 'page' && Number(v) > 1) params[k] = v;
    });
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  const fetchCars = useCallback(async (f) => {
    setLoading(true);
    try {
      const { data } = await carsApi.getAll(f);
      setCars(data.data);
      setPagination(data.pagination);
    } catch {
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars(filters);
    syncUrl(filters);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFiltersChange = (newFilters) => setFilters(newFilters);
  const handleReset = () => setFilters({ ...DEFAULT_FILTERS });
  const handlePageChange = (page) => {
    setFilters((f) => ({ ...f, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div className="container-xl">
          <h1 className="text-2xl font-bold text-slate-900">Browse Cars</h1>
          {!loading && (
            <p className="text-slate-500 text-sm mt-1">
              {pluralise(pagination.total, 'car', 'cars')} available
            </p>
          )}
        </div>
      </div>

      <div className="container-xl py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <SearchFilters
              filters={filters}
              onChange={handleFiltersChange}
              onReset={handleReset}
            />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-slate-500 hidden lg:block">
                {loading ? 'Loading…' : `${pluralise(pagination.total, 'result')}`}
              </p>
              <div className="flex items-center gap-3 ml-auto">
                <label className="text-sm text-slate-500 hidden sm:block">Sort:</label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value, page: 1 }))}
                  className="input w-auto text-sm"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 9 }).map((_, i) => <CarCardSkeleton key={i} />)}
              </div>
            ) : cars.length === 0 ? (
              <EmptyState
                title="No cars found"
                description="Try adjusting your filters or search term to find more results."
                actionLabel="Clear Filters"
                onAction={handleReset}
              />
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {cars.map((car) => <CarCard key={car._id} car={car} />)}
              </div>
            )}

            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

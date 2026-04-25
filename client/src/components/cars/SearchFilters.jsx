// client/src/components/cars/SearchFilters.jsx

import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CAR_BRANDS, LOCATIONS, BODY_TYPES, FUEL_TYPES, TRANSMISSION_TYPES } from '../shared/constants';
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => currentYear - i);

export default function SearchFilters({ filters, onChange, onReset }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleChange = (key, value) => onChange({ ...filters, [key]: value, page: 1 });

  const activeCount = Object.values(filters).filter(
    (v) => v !== '' && v !== null && v !== undefined && v !== 1
  ).length;

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4 flex gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-10"
            placeholder="Search carsâ€¦"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="btn-outline gap-2 shrink-0"
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Sidebar (desktop) + drawer (mobile) */}
      <aside
        className={`
          fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity duration-200
          ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setMobileOpen(false)}
      >
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto
                       transition-transform duration-300
                       ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <span className="font-semibold">Filters</span>
            <button onClick={() => setMobileOpen(false)}><X size={20}/></button>
          </div>
          <div className="p-5">
            <FilterFields filters={filters} onChange={handleChange} onReset={onReset} />
          </div>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <FilterFields filters={filters} onChange={handleChange} onReset={onReset} />
      </div>
    </>
  );
}

function FilterFields({ filters, onChange, onReset }) {
  return (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label className="label">Search</label>
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Make, model, keywordâ€¦"
            value={filters.search || ''}
            onChange={(e) => onChange('search', e.target.value)}
          />
        </div>
      </div>

      <FilterSelect label="Brand"        field="brand"        options={CAR_BRANDS}          filters={filters} onChange={onChange} />
      <FilterSelect label="Location"     field="location"     options={LOCATIONS}            filters={filters} onChange={onChange} />
      <FilterSelect label="Body Type"    field="bodyType"     options={BODY_TYPES}           filters={filters} onChange={onChange} />
      <FilterSelect label="Fuel Type"    field="fuelType"     options={FUEL_TYPES}           filters={filters} onChange={onChange} />
      <FilterSelect label="Transmission" field="transmission" options={TRANSMISSION_TYPES}   filters={filters} onChange={onChange} />
      <FilterSelect label="Year"         field="year"         options={YEARS.map(String)}    filters={filters} onChange={onChange} />
      <FilterSelect label="Condition"    field="condition"    options={['New','Used','Certified Pre-Owned']} filters={filters} onChange={onChange} />

      {/* Price range */}
      <div>
        <label className="label">Price Range (KES)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number" min="0" placeholder="Min"
            className="input"
            value={filters.minPrice || ''}
            onChange={(e) => onChange('minPrice', e.target.value)}
          />
          <input
            type="number" min="0" placeholder="Max"
            className="input"
            value={filters.maxPrice || ''}
            onChange={(e) => onChange('maxPrice', e.target.value)}
          />
        </div>
      </div>

      {/* Reset */}
      <button onClick={onReset} className="btn-outline w-full">
        <X size={15}/> Clear Filters
      </button>
    </div>
  );
}

function FilterSelect({ label, field, options, filters, onChange }) {
  return (
    <div>
      <label className="label">{label}</label>
      <select
        className="input"
        value={filters[field] || ''}
        onChange={(e) => onChange(field, e.target.value)}
      >
        <option value="">All {label}s</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}


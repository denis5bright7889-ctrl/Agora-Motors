// client/src/components/cars/CarForm.jsx — Reusable create/edit form

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  CAR_BRANDS, BODY_TYPES, FUEL_TYPES, TRANSMISSION_TYPES, LOCATIONS,
} from '../../../../shared/constants';

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => currentYear - i);
const CONDITIONS = ['New', 'Used', 'Certified Pre-Owned'];

export default function CarForm({ defaultValues = {}, onSubmit, loading, submitLabel = 'Save Listing' }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [previewFiles, setPreviewFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(defaultValues.images || []);
  const [removedImages, setRemovedImages] = useState([]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const total = existingImages.length + previewFiles.length + files.length;
    if (total > 8) {
      toast.error('Maximum 8 images allowed');
      return;
    }
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setPreviewFiles((prev) => [...prev, ...previews]);
  };

  const removePreview = (idx) => {
    setPreviewFiles((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const removeExisting = (img) => {
    setExistingImages((prev) => prev.filter((i) => i._id !== img._id));
    setRemovedImages((prev) => [...prev, img._id]);
  };

  const handleFormSubmit = (data) => {
    const formData = new FormData();

    // Append all text fields
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== '') formData.append(k, v);
    });

    // Append new image files
    previewFiles.forEach(({ file }) => formData.append('images', file));

    // Pass along removed/existing image IDs for the parent to handle
    formData.append('removedImages', JSON.stringify(removedImages));
    formData.append('existingImages', JSON.stringify(existingImages.map((i) => i._id)));

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8" noValidate>

      {/* ── Basic Info ── */}
      <Section title="Basic Information">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Listing Title *" error={errors.title?.message} className="sm:col-span-2">
            <input
              {...register('title', { required: 'Title is required', minLength: { value: 5, message: 'At least 5 characters' } })}
              className={`input ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g. 2021 Toyota RAV4 XLE Premium"
            />
          </Field>

          <Field label="Brand *" error={errors.brand?.message}>
            <select {...register('brand', { required: 'Brand is required' })} className={`input ${errors.brand ? 'input-error' : ''}`}>
              <option value="">Select brand</option>
              {CAR_BRANDS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </Field>

          <Field label="Model *" error={errors.model?.message}>
            <input
              {...register('model', { required: 'Model is required' })}
              className={`input ${errors.model ? 'input-error' : ''}`}
              placeholder="e.g. RAV4"
            />
          </Field>

          <Field label="Year *" error={errors.year?.message}>
            <select {...register('year', { required: 'Year is required', valueAsNumber: true })} className="input">
              <option value="">Select year</option>
              {YEARS.map((y) => <option key={y}>{y}</option>)}
            </select>
          </Field>

          <Field label="Condition *" error={errors.condition?.message}>
            <select {...register('condition', { required: 'Condition is required' })} className="input">
              <option value="">Select condition</option>
              {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      {/* ── Pricing & Details ── */}
      <Section title="Pricing & Details">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Price (KES) *" error={errors.price?.message}>
            <input
              type="number" min="0"
              {...register('price', { required: 'Price is required', min: { value: 0, message: 'Must be ≥ 0' }, valueAsNumber: true })}
              className={`input ${errors.price ? 'input-error' : ''}`}
              placeholder="e.g. 2500000"
            />
          </Field>

          <Field label="Mileage (km) *" error={errors.mileage?.message}>
            <input
              type="number" min="0"
              {...register('mileage', { required: 'Mileage is required', min: { value: 0, message: 'Must be ≥ 0' }, valueAsNumber: true })}
              className={`input ${errors.mileage ? 'input-error' : ''}`}
              placeholder="e.g. 45000"
            />
          </Field>

          <Field label="Fuel Type">
            <select {...register('fuelType')} className="input">
              {FUEL_TYPES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </Field>

          <Field label="Transmission">
            <select {...register('transmission')} className="input">
              {TRANSMISSION_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>

          <Field label="Body Type">
            <select {...register('bodyType')} className="input">
              <option value="">Select body type</option>
              {BODY_TYPES.map((b) => <option key={b}>{b}</option>)}
            </select>
          </Field>

          <Field label="Color">
            <input
              {...register('color')}
              className="input"
              placeholder="e.g. Pearl White"
            />
          </Field>

          <Field label="Location *" error={errors.location?.message} className="sm:col-span-2">
            <select {...register('location', { required: 'Location is required' })} className={`input ${errors.location ? 'input-error' : ''}`}>
              <option value="">Select location</option>
              {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      {/* ── Description ── */}
      <Section title="Description">
        <Field label="Description">
          <textarea
            {...register('description')}
            rows={5}
            className="input resize-none"
            placeholder="Describe the car in detail — service history, modifications, extras…"
          />
        </Field>
      </Section>

      {/* ── Images ── */}
      <Section title="Photos">
        <p className="text-sm text-slate-500 mb-4">Upload up to 8 photos. First photo will be the cover image.</p>

        {/* Existing images */}
        {existingImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
            {existingImages.map((img) => (
              <div key={img._id} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-100">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExisting(img)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                             transition-opacity flex items-center justify-center"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New previews */}
        {previewFiles.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
            {previewFiles.map((p, idx) => (
              <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-100">
                <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePreview(idx)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                             transition-opacity flex items-center justify-center"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload area */}
        {existingImages.length + previewFiles.length < 8 && (
          <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed
                             border-slate-200 rounded-2xl p-8 cursor-pointer
                             hover:border-brand-400 hover:bg-brand-50/50 transition-colors">
            <Upload size={24} className="text-slate-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">Click to upload photos</p>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP · Max 5MB each</p>
            </div>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />
          </label>
        )}
      </Section>

      {/* Submit */}
      <button type="submit" disabled={loading} className="btn-primary btn-lg w-full sm:w-auto">
        {loading ? <><Loader2 size={18} className="animate-spin" /> Saving…</> : submitLabel}
      </button>
    </form>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2.5 border-b border-slate-100">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

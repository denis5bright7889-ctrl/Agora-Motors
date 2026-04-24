// client/src/pages/EditListingPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { carsApi } from '../api/carsApi';
import { useAuth } from '../context/AuthContext';
import CarForm from '../components/cars/CarForm';
import { getErrorMessage } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function EditListingPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [car, setCar]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    carsApi.getById(id)
      .then(({ data }) => {
        // Only seller can edit
        if (data.data.seller._id !== user._id && user.role !== 'admin') {
          toast.error('Not authorised to edit this listing');
          navigate('/dashboard');
          return;
        }
        setCar(data.data);
      })
      .catch(() => {
        toast.error('Listing not found');
        navigate('/dashboard');
      })
      .finally(() => setLoading(false));
  }, [id]); // eslint-disable-line

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      const { data } = await carsApi.update(id, formData);
      toast.success('Listing updated!');
      navigate(`/cars/${data.data._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 size={32} className="animate-spin text-slate-300" />
      </div>
    );
  }

  // Build default values for react-hook-form
  const defaults = car ? {
    title: car.title, description: car.description || '', price: car.price,
    brand: car.brand, model: car.model, year: car.year, mileage: car.mileage,
    condition: car.condition, fuelType: car.fuelType, transmission: car.transmission,
    bodyType: car.bodyType || '', color: car.color || '', location: car.location,
    images: car.images || [],
  } : {};

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="page-header">
        <div className="container-xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Edit Listing</h1>
          <p className="text-sm text-slate-500 mt-1 truncate max-w-lg">{car?.title}</p>
        </div>
      </div>

      <div className="container-xl py-8">
        <div className="max-w-3xl">
          <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
            <CarForm
              defaultValues={defaults}
              onSubmit={handleSubmit}
              loading={saving}
              submitLabel="Save Changes"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

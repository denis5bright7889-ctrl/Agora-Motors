// client/src/pages/CreateListingPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { carsApi } from '../api/carsApi';
import CarForm from '../components/cars/CarForm';
import { getErrorMessage } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function CreateListingPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data } = await carsApi.create(formData);
      toast.success('Listing created successfully!');
      navigate(`/cars/${data.data._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-slate-800">Create New Listing</h1>
          <p className="text-sm text-slate-500 mt-1">Fill in the details to list your car for sale</p>
        </div>
      </div>

      <div className="container-xl py-8">
        <div className="max-w-3xl">
          <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
            <CarForm
              onSubmit={handleSubmit}
              loading={loading}
              submitLabel="Publish Listing"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

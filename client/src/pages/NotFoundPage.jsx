// client/src/pages/NotFoundPage.jsx

import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
        <Car size={36} className="text-slate-300" />
      </div>
      <h1 className="font-display text-7xl text-slate-900 tracking-wide mb-2">404</h1>
      <h2 className="text-2xl font-bold text-slate-700 mb-3">Page Not Found</h2>
      <p className="text-slate-500 max-w-sm mb-8">
        Looks like this road leads nowhere. The page you're looking for doesn't exist.
      </p>
      <div className="flex gap-3">
        <Link to="/" className="btn-primary">Go Home</Link>
        <Link to="/cars" className="btn-outline">Browse Cars</Link>
      </div>
    </div>
  );
}

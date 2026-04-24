// client/src/components/layout/Footer.jsx

import { Link } from 'react-router-dom';
import { Car, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="container-xl py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <Car size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display text-2xl text-white tracking-wider">CarMax</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500">
              Kenya's premier car marketplace. Find your perfect drive or sell your car with confidence.
            </p>
            <div className="flex gap-3 mt-5">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-brand-600 transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Browse */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Browse</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['All Cars', '/cars'],
                ['New Cars', '/cars?condition=New'],
                ['Used Cars', '/cars?condition=Used'],
                ['SUVs', '/cars?bodyType=SUV'],
                ['Sedans', '/cars?bodyType=Sedan'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Account</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['Register', '/register'],
                ['Log In', '/login'],
                ['Dashboard', '/dashboard'],
                ['Sell a Car', '/listings/new'],
                ['My Favorites', '/favorites'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li>📍 Nairobi, Kenya</li>
              <li>📧 hello@carmax.co.ke</li>
              <li>📞 +254 700 000 000</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-slate-600">
          <span>© {year} CarMax. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

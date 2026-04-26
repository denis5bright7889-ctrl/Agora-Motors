import { Link, NavLink } from 'react-router-dom';
import { Car } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="container-xl h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
            <Car size={18} />
          </div>
          <span className="font-semibold text-slate-900">CarMax</span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <NavLink to="/cars" className="text-slate-600 hover:text-slate-900">
            Browse
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className="text-slate-600 hover:text-slate-900">
                Dashboard
              </NavLink>
              <button type="button" onClick={logout} className="text-slate-600 hover:text-slate-900">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-slate-600 hover:text-slate-900">
                Login
              </NavLink>
              <NavLink to="/register" className="btn-primary py-2 px-4">
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

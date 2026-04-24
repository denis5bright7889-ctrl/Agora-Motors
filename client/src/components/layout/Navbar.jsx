// client/src/components/layout/Navbar.jsx

import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Car, Heart, LayoutDashboard, LogOut, Menu, Plus, User, X, ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    toast.success('Logged out');
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
      <div className="container-xl">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Car size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-2xl text-slate-900 tracking-wider leading-none">
              CarMax
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/cars" className={navLinkClass}>Browse Cars</NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard"  className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/favorites"  className={navLinkClass}>Favorites</NavLink>
              </>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Sell CTA */}
                <Link to="/listings/new" className="hidden sm:flex btn-primary btn-sm">
                  <Plus size={15} strokeWidth={2.5} /> Sell Car
                </Link>

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-xl px-3 py-1.5
                               text-sm font-medium text-slate-700
                               hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700
                                    flex items-center justify-center text-xs font-bold uppercase shrink-0">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden sm:block max-w-[100px] truncate">{user?.name}</span>
                    <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl
                                    shadow-[0_8px_40px_rgba(0,0,0,.12)] border border-slate-100
                                    py-1.5 animate-fade-in">
                      <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                        <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <DropItem to="/dashboard"    icon={<LayoutDashboard size={15}/>} label="Dashboard" onClick={() => setDropdownOpen(false)} />
                      <DropItem to="/profile"      icon={<User size={15}/>}            label="Profile"   onClick={() => setDropdownOpen(false)} />
                      <DropItem to="/favorites"    icon={<Heart size={15}/>}           label="Favorites" onClick={() => setDropdownOpen(false)} />
                      <DropItem to="/listings/new" icon={<Plus size={15}/>}            label="Sell a Car" onClick={() => setDropdownOpen(false)} />
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm
                                     text-red-600 hover:bg-red-50 transition-colors rounded-xl mx-0.5"
                        >
                          <LogOut size={15}/> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn-ghost btn-sm hidden sm:flex">Log in</Link>
                <Link to="/register" className="btn-primary btn-sm">Sign up</Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden btn-ghost btn-sm p-2"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white animate-slide-up">
          <nav className="container-xl py-4 flex flex-col gap-1">
            <MobileLink to="/cars"        label="Browse Cars"  onClick={() => setMobileOpen(false)} />
            {isAuthenticated ? (
              <>
                <MobileLink to="/dashboard"    label="Dashboard"  onClick={() => setMobileOpen(false)} />
                <MobileLink to="/favorites"    label="Favorites"  onClick={() => setMobileOpen(false)} />
                <MobileLink to="/listings/new" label="Sell a Car" onClick={() => setMobileOpen(false)} />
                <MobileLink to="/profile"      label="Profile"    onClick={() => setMobileOpen(false)} />
                <button
                  onClick={handleLogout}
                  className="mt-2 text-left px-4 py-2.5 rounded-xl text-sm font-medium
                             text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileLink to="/login"    label="Log in"  onClick={() => setMobileOpen(false)} />
                <MobileLink to="/register" label="Sign up" onClick={() => setMobileOpen(false)} />
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function DropItem({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700
                 hover:bg-slate-50 transition-colors rounded-xl mx-0.5"
    >
      <span className="text-slate-400">{icon}</span>
      {label}
    </Link>
  );
}

function MobileLink({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
          isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

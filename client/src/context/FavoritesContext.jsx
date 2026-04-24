// client/src/context/FavoritesContext.jsx — Favorites / wishlist state

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { carsApi } from '../api/carsApi';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState(new Set()); // Set of car IDs

  // Load favorites when authenticated
  useEffect(() => {
    if (!isAuthenticated) { setFavorites(new Set()); return; }
    carsApi.getFavorites()
      .then(({ data }) => {
        setFavorites(new Set(data.data.map((c) => c._id)));
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const toggle = useCallback(async (carId) => {
    if (!isAuthenticated) return false;
    try {
      await carsApi.toggleFavorite(carId);
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(carId)) next.delete(carId);
        else next.add(carId);
        return next;
      });
      return true;
    } catch {
      return false;
    }
  }, [isAuthenticated]);

  const isFavorited = useCallback((carId) => favorites.has(carId), [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorited }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider');
  return ctx;
};

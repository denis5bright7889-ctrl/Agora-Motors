import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { carsApi } from '../api/carsApi';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavorites(new Set());
      return;
    }

    let mounted = true;
    setLoading(true);

    carsApi.getFavorites()
      .then(({ data }) => {
        if (!mounted) return;
        const ids = new Set(data.data.map((car) => car._id));
        setFavorites(ids);
      })
      .catch(() => {
        if (mounted) setFavorites(new Set());
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [isAuthenticated]);

  const toggle = async (id) => {
    try {
      await carsApi.toggleFavorite(id);
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
      return true;
    } catch {
      return false;
    }
  };

  const isFavorited = (id) => favorites.has(id);

  return (
    <FavoritesContext.Provider value={{ favorites, loading, toggle, isFavorited }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}

// client/src/App.jsx — Root router

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Layout           from './components/layout/Layout';
import HomePage         from './pages/HomePage';
import ListingsPage     from './pages/ListingsPage';
import CarDetailPage    from './pages/CarDetailPage';
import LoginPage        from './pages/LoginPage';
import RegisterPage     from './pages/RegisterPage';
import DashboardPage    from './pages/DashboardPage';
import CreateListingPage from './pages/CreateListingPage';
import EditListingPage  from './pages/EditListingPage';
import FavoritesPage    from './pages/FavoritesPage';
import ProfilePage      from './pages/ProfilePage';
import NotFoundPage     from './pages/NotFoundPage';

/** Redirect authenticated users away from auth pages */
function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

/** Block unauthenticated users */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public */}
        <Route index element={<HomePage />} />
        <Route path="cars" element={<ListingsPage />} />
        <Route path="cars/:id" element={<CarDetailPage />} />

        {/* Guest-only */}
        <Route path="login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* Protected */}
        <Route path="dashboard"      element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="listings/new"   element={<ProtectedRoute><CreateListingPage /></ProtectedRoute>} />
        <Route path="listings/:id/edit" element={<ProtectedRoute><EditListingPage /></ProtectedRoute>} />
        <Route path="favorites"      element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
        <Route path="profile"        element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

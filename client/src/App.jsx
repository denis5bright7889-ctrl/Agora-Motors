import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { FavoritesProvider } from './context/FavoritesContext'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ListingsPage from './pages/ListingsPage'
import CarDetailPage from './pages/CarDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CreateListingPage from './pages/CreateListingPage'
import EditListingPage from './pages/EditListingPage'
import FavoritesPage from './pages/FavoritesPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/cars/ProtectedRoute'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <Router>
            <Routes>
              <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="cars" element={<ListingsPage />} />
            <Route path="cars/:id" element={<CarDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="listings/new" element={<ProtectedRoute><CreateListingPage /></ProtectedRoute>} />
            <Route path="listings/:id/edit" element={<ProtectedRoute><EditListingPage /></ProtectedRoute>} />
            <Route path="favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Router>
        <Toaster position="top-right" />
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
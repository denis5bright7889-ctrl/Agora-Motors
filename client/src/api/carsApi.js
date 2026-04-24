// client/src/api/carsApi.js — Car listing API calls

import api from './axios';

export const carsApi = {
  /** Fetch paginated / filtered car listings */
  getAll: (params) => api.get('/cars', { params }),

  /** Fetch single car by ID */
  getById: (id) => api.get(`/cars/${id}`),

  /** Create a new listing (multipart/form-data for images) */
  create: (formData) =>
    api.post('/cars', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),

  /** Update a listing */
  update: (id, formData) =>
    api.put(`/cars/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),

  /** Delete a listing */
  remove: (id) => api.delete(`/cars/${id}`),

  /** Delete a single image from a listing */
  removeImage: (carId, imageId) => api.delete(`/cars/${carId}/images/${imageId}`),

  /** Toggle favorite */
  toggleFavorite: (id) => api.post(`/cars/${id}/favorite`),

  /** Current user's listings */
  getMine: () => api.get('/cars/mine'),

  /** Current user's favorited cars */
  getFavorites: () => api.get('/cars/favorites'),
};

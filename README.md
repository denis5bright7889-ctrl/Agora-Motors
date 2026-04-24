# 🚗 CarMax — Full-Stack Car Marketplace

> Kenya's premier car marketplace built with React + Node.js + MongoDB

## ✨ Features

- **Authentication** — JWT-based register/login with protected routes
- **Car Listings** — Create, edit, delete with multi-image upload
- **Marketplace UI** — Search, filter, sort with pagination
- **Favorites / Wishlist** — Save cars with real-time toggle
- **User Dashboard** — Manage listings, toggle availability, view stats
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Skeleton Loaders** — Polished loading states throughout
- **Image Upload** — Cloudinary-ready or local fallback

## 🏗️ Project Structure

```
carmax/
├── client/               # React + Vite + Tailwind
│   └── src/
│       ├── api/          # Axios + API service modules
│       ├── components/
│       │   ├── auth/
│       │   ├── cars/     # CarCard, CarForm, SearchFilters, Skeletons
│       │   ├── common/   # Pagination, EmptyState
│       │   └── layout/   # Navbar, Footer, Layout
│       ├── context/      # AuthContext, FavoritesContext
│       ├── pages/        # All route pages
│       └── utils/        # Helper functions
├── server/               # Node.js + Express + MongoDB
│   ├── config/           # DB, Cloudinary config
│   ├── controllers/      # authController, carController
│   ├── middleware/        # auth, errorHandler, validate
│   ├── models/           # User, Car (Mongoose)
│   ├── routes/           # auth.js, cars.js
│   └── server.js
└── shared/
    └── constants.js      # Brands, locations, filter options
```

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repo-url> && cd carmax
npm run install:all
```

### 2. Configure Environment

```bash
# Server
cp server/.env.example server/.env
# Edit server/.env — set MONGO_URI and JWT_SECRET

# Client (optional, proxy handles API in dev)
cp client/.env.example client/.env
```

### 3. Run Development

```bash
npm run dev
# → API:    http://localhost:5000
# → Client: http://localhost:5173
```

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login + get JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| PUT | `/api/auth/profile` | ✅ | Update profile |
| PUT | `/api/auth/password` | ✅ | Change password |
| GET | `/api/cars` | — | List / search cars |
| POST | `/api/cars` | ✅ | Create listing |
| GET | `/api/cars/:id` | — | Get single car |
| PUT | `/api/cars/:id` | ✅ | Edit listing |
| DELETE | `/api/cars/:id` | ✅ | Delete listing |
| GET | `/api/cars/mine` | ✅ | My listings |
| GET | `/api/cars/favorites` | ✅ | Saved cars |
| POST | `/api/cars/:id/favorite` | ✅ | Toggle favorite |

## 🌐 Query Parameters (GET /api/cars)

| Param | Example | Description |
|-------|---------|-------------|
| `search` | `RAV4` | Full-text search |
| `brand` | `Toyota` | Filter by brand |
| `location` | `Nairobi` | Filter by city |
| `minPrice` | `500000` | Min price (KES) |
| `maxPrice` | `2000000` | Max price (KES) |
| `year` | `2020` | Filter by year |
| `condition` | `Used` | New/Used/CPO |
| `fuelType` | `Petrol` | Fuel type |
| `transmission` | `Automatic` | Transmission |
| `bodyType` | `SUV` | Body style |
| `sort` | `-price` | Sort field |
| `page` | `2` | Page number |
| `limit` | `12` | Results per page |

## 🖼️ Image Uploads

By default, images are saved to `server/uploads/` (local disk).

To enable **Cloudinary**:
1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Add credentials to `server/.env`:
   ```
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS 3 |
| Routing | React Router v6 |
| Forms | React Hook Form |
| HTTP | Axios |
| State | Context API |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose 8 |
| Auth | JWT (jsonwebtoken) |
| Validation | express-validator |
| Images | Multer + Cloudinary |
| Security | Helmet, CORS, Rate Limiting |

## 🔐 Environment Variables

### server/.env
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/carmax
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=  # optional
CLOUDINARY_API_KEY=     # optional
CLOUDINARY_API_SECRET=  # optional
```

# CarMax — AI Coding Agent Instructions

## Project Overview
CarMax is a full-stack car marketplace built with React (client), Node.js/Express (server), and MongoDB. It's a monorepo with `client/`, `server/`, and `shared/` directories. The app features JWT authentication, car listings with search/filter, favorites, image uploads (local or Cloudinary), and a responsive UI with Tailwind CSS.

## Architecture
- **Client**: React 18 + Vite + Tailwind CSS. Uses Context API for global state (auth, favorites). Axios for API calls with interceptors for JWT auth.
- **Server**: Express.js with Mongoose ODM. RESTful API with validation, rate limiting, and error handling.
- **Shared**: Constants (brands, locations, etc.) used by both client and server.
- **Data Flow**: Client → Axios (with JWT) → Express routes → Controllers → Mongoose models → MongoDB.

## Key Patterns & Conventions

### Authentication
- JWT tokens stored in `localStorage` as `'carmax_token'` and user data as `'carmax_user'`.
- Axios request interceptor attaches `Authorization: Bearer ${token}` to authenticated requests.
- Response interceptor handles 401 by clearing localStorage and redirecting to `/login?session=expired`.
- Protected routes use `<ProtectedRoute>` component that checks `useAuth().isAuthenticated`.
- AuthContext hydrates user on mount by calling `/api/auth/me` to validate stored token.

### API Structure
- Base URL: `/api` (proxied in dev via Vite).
- Auth endpoints: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, etc.
- Cars endpoints: `/api/cars` (GET with query params for search/filter), `/api/cars/:id`, etc.
- Response format: `{ success: boolean, data: object, message?: string }`.
- Errors: `{ success: false, message: string }` with appropriate HTTP status.

### Forms & Validation
- Uses `react-hook-form` for form state management.
- Server-side validation with `express-validator`.
- File uploads: `multer` for multipart/form-data, supports multiple images.
- Images stored locally in `server/uploads/` or Cloudinary (configured via env vars).

### State Management
- Auth: `AuthContext` with `useAuth()` hook.
- Favorites: `FavoritesContext` with `useFavorites()` hook.
- No global state library; uses React's built-in Context + useState.

### Database Schema
- **User**: name, email, password (hashed), phone, avatar, role.
- **Car**: title, description, price, brand, model, year, mileage, condition, fuelType, transmission, bodyType, color, location, images (array of {url, publicId}), seller (ref User), features (array), isAvailable, favoritedBy (array of User refs).
- Indexes on common query fields (brand, price, location, etc.).
- Full-text search on title, brand, model, description.

### Search & Filtering
- Query params: `search` (full-text), `brand`, `location`, `minPrice`/`maxPrice`, `year`, `condition`, `fuelType`, `transmission`, `bodyType`, `sort`, `page`, `limit`.
- Pagination: Default 12 items/page, uses `skip` and `limit` in MongoDB.
- Sort options: `-createdAt`, `price`, `-price`, etc.

### Developer Workflows
- **Setup**: Run `npm run install:all` to install deps in root, server/, client/.
- **Dev**: `npm run dev` starts both client (port 5173) and server (port 5000) concurrently.
- **Build**: `cd client && npm run build` for production client build.
- **Environment**: Copy `server/.env.example` to `server/.env`, set `MONGO_URI`, `JWT_SECRET`, optional `CLOUDINARY_*` for image uploads.
- **Database**: MongoDB required; no seeding script visible, but `server.js` connects via `config/db.js`.

### File Organization
- **Client components**: Grouped by feature (`cars/`, `auth/`, `layout/`) with skeletons for loading states.
- **API modules**: `api/authApi.js`, `api/carsApi.js` — thin wrappers around Axios calls.
- **Pages**: One component per route, uses shared `Layout` with `Navbar` and `Footer`.
- **Server routes**: Modular in `routes/`, controllers in `controllers/`, models in `models/`.
- **Middleware**: Auth middleware checks JWT, validation middleware uses express-validator.

### UI/UX Patterns
- Responsive design with Tailwind utility classes.
- Skeleton loaders for async content (e.g., `CarCardSkeleton`).
- Toast notifications via `react-hot-toast`.
- Consistent button styles: `btn-primary`, `btn-secondary`, etc.
- Card shadows: `shadow-card` class.

### Common Gotchas
- Always use absolute paths for file operations (e.g., `path.join(__dirname, ...)`).
- JWT expires in 7 days by default; handle token refresh if needed.
- Image uploads: Check if Cloudinary is configured; fallback to local storage.
- CORS configured for client URL (default localhost:5173).
- Rate limiting: 200 req/15min general, 20 req/15min for auth endpoints.

## Examples

### Creating a new car listing
```jsx
// In a component
import { carsApi } from '../api/carsApi';

const handleSubmit = async (formData) => {
  try {
    const { data } = await carsApi.create(formData); // FormData with images
    navigate(`/cars/${data.data._id}`);
  } catch (err) {
    toast.error(getErrorMessage(err));
  }
};
```

### Protected route
```jsx
// In App.jsx
<Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
```

### API controller pattern
```javascript
// server/controllers/carController.js
exports.getCars = async (req, res) => {
  const filter = { isAvailable: true };
  // Build filter from req.query
  const cars = await Car.find(filter).populate('seller', 'name email').sort(sort);
  res.json({ success: true, data: cars, total });
};
```

### Database query with population
```javascript
const car = await Car.findById(id).populate('seller', 'name email phone avatar');
```

Focus on maintaining consistency with existing patterns: JWT auth flow, Axios interceptors, Context providers, RESTful API responses, Mongoose schemas with validation, and Tailwind-based responsive UI.
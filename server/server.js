const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Agora Motors API is running!',
        endpoints: [
            '/api/cars',
            '/api/auth/test',
            '/api/auth/register',
            '/api/auth/login'
        ]
    });
});
// Auth routes - Add this before app.listen
app.get('/api/auth/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Auth API is working!',
        endpoints: {
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login',
            profile: 'GET /api/auth/profile'
        }
    });
});

app.post('/api/auth/register', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Registration successful',
        user: { id: 1, name: req.body.name, email: req.body.email }
    });
});

app.post('/api/auth/login', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Login successful',
        token: 'dummy-jwt-token',
        user: { id: 1, email: req.body.email }
    });
});

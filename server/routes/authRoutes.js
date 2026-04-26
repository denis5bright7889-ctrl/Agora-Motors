const express = require('express');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Auth API is working!',
        endpoints: {
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login',
            profile: 'GET /api/auth/profile',
            test: 'GET /api/auth/test'
        }
    });
});

// Register route - working directly
router.post('/register', (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        console.log('Registration attempt:', { name, email, password });
        
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide name, email and password' 
            });
        }
        
        // Here you would save to database
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: { id: Date.now(), name, email }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Login route - working directly
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('Login attempt:', { email, password });
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide email and password' 
            });
        }
        
        // Here you would verify credentials
        res.json({
            success: true,
            message: 'Login successful',
            token: 'jwt-token-' + Date.now(),
            user: { id: Date.now(), email }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Profile route
router.get('/profile', (req, res) => {
    res.json({
        success: true,
        user: { 
            id: 1, 
            name: 'Test User', 
            email: 'test@example.com',
            role: 'user'
        }
    });
});

module.exports = router;
